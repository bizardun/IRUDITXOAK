
import { GoogleGenAI, Type } from "@google/genai";
import type { Plato, RestaurantConfig, Alergeno } from '../types';
import { getActiveConfig, bolinaConfig } from '../config/restaurant';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch, onSnapshot } from 'firebase/firestore';


const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY
  ? process.env.API_KEY
  : "";

const ai = new GoogleGenAI({ apiKey });

// Helper para obtener fuentes de grounding
const extractSources = (response: any) => {
    return response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || "Fuente de información",
        uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];
};

export const translateText = async (text: string, targetLang: string, targetLangName: string): Promise<{text: string, sources: any[]}> => {
    if (!text || !apiKey) return { text, sources: [] };
    try {
        const isBasque = targetLang === 'EU';
        const systemPrompt = `You are a professional restaurant translator and culinary expert.
        Translate from Spanish to ${targetLangName}. 
        Focus on culinary accuracy, cultural localization, and appetizing descriptions.
        ${isBasque ? "CRITICAL: For Basque (EU) translations, you MUST verify terminology using the Elhuyar Dictionary (https://www.euskadi.eus/diccionario-elhuyar/) to ensure academic correctness." : ""}
        Respond ONLY with the translated text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `Translate "${text}" to ${targetLangName}.`,
            config: { 
                systemInstruction: systemPrompt,
                tools: isBasque ? [{ googleSearch: {} }] : undefined
            }
        });
        
        return {
            text: response.text ? response.text.trim().replace(/^"(.*)"$/, '$1') : text,
            sources: extractSources(response)
        };
    } catch (error) {
        console.error("Translation error:", error);
        return { text, sources: [] };
    }
};

export const analyzeDish = async (dishName: string): Promise<{ translations: Record<string, string>, allergens: Alergeno[], sources: any[] }> => {
    if (!dishName || !apiKey) return { translations: {}, allergens: [], sources: [] };
    
    const allergenList = [
        "GLUTEN", "LACTEOS", "HUEVOS", "PESCADO", "MARISCO", "CRUSTACEOS", "MOLUSCOS", 
        "SOJA", "CACAHUETES", "MOSTAZA", "SESAMO", "SULFITOS", "APIO", "ALTRAMUCES", "CALAMARES"
    ];

    const currentConfig = getActiveConfig();
    let websiteSearchRule = "";
    if (currentConfig.officialWebsite) {
        let domain = currentConfig.officialWebsite;
        try {
            domain = new URL(currentConfig.officialWebsite).hostname;
        } catch(e) {}
        websiteSearchRule = `2. You MUST use Google Search with 'site:${domain}' to find the official translations for the given dish name on the restaurant's website. If you find existing translations on the website, YOU MUST PRESERVE AND RETURN THOSE EXACT TRANSLATIONS. Only generate new translations if the dish cannot be found on their website.`;
    } else {
        websiteSearchRule = "2. (No official website configured for this restaurant, generate standard translations).";
    }

    const systemPrompt = `
        You are an expert culinary AI and food safety inspector.
        Analyze the Spanish Dish Name provided.
        
        CRITICAL TRANSLATION RULES:
        1. Translate the dish name to: EU, EN, FR, DE, IT.
        ${websiteSearchRule}
        3. For EU (Basque), if it's a new translation not on the website, you MUST use Google Search to cross-reference with https://www.euskadi.eus/diccionario-elhuyar/.

        4. Detect ALL allergens present in the standard recipe for this dish from the following list ONLY: ${allergenList.join(', ')}.
        
        CRITICAL ALLERGEN RULES:
        - If the dish name explicitly contains a word related to an allergen (e.g., "marisco", "queso", "huevo", "pescado", "calamar"), you MUST ALWAYS include that specific allergen (e.g., "MARISCO", "LACTEOS", "HUEVOS", "PESCADO", "CALAMARES").
        - Think deeply about the typical ingredients used to prepare this dish, including sauces, marinades, and garnishes.
        - "Mayonesa" (Mayonnaise) contains HUEVOS.
        - "Salsa de soja" (Soy sauce) contains SOJA and GLUTEN.
        - "Queso", "Nata", "Mantequilla" (Cheese, Cream, Butter) contain LACTEOS.
        - "Pan", "Rebozado", "Empanado", "Harina", "Galleta" (Bread, Battered, Breaded, Flour, Cookie) contain GLUTEN.
        - "Vino", "Vinagre" (Wine, Vinegar) often contain SULFITOS.
        - "Marisco" includes shrimp, prawns, crab, lobster (CRUSTACEOS) and clams, mussels, octopus, squid (MOLUSCOS/CALAMARES). If the dish is called "de marisco" or "con marisco", ALWAYS include the "MARISCO" allergen, and optionally add CRUSTACEOS/MOLUSCOS if you know the specific ingredients.
        - "Pasta" contains GLUTEN and often HUEVOS.
        - "Croquetas" contain GLUTEN, LACTEOS, and often HUEVOS.
        - "Tortilla" contains HUEVOS.
        - "Pesto" contains LACTEOS.
        - "Chocolate" often contains LACTEOS and SOJA.
        
        Return JSON ONLY.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `Dish Name: "${dishName}"`,
            config: { 
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        translations: {
                            type: Type.OBJECT,
                            properties: {
                                EU: { type: Type.STRING },
                                EN: { type: Type.STRING },
                                FR: { type: Type.STRING },
                                DE: { type: Type.STRING },
                                IT: { type: Type.STRING }
                            }
                        },
                        allergens: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                },
                tools: [{ googleSearch: {} }]
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        const result = JSON.parse(text);
        return {
            translations: result.translations || {},
            allergens: result.allergens || [],
            sources: extractSources(response)
        };
    } catch (error) {
        console.error("Error analyzing dish:", error);
        return { translations: {}, allergens: [], sources: [] };
    }
};

export const generateAppConfig = async (prompt: string, fileData: string | null, mimeType: string | null): Promise<{ slogan: string, initialPlatos: Plato[] }> => {
    if (!apiKey) throw new Error("API Key missing");

    const systemPrompt = `
        AI Menu Generator.
        For all Basque (EU) translations, ensure they align with Elhuyar standards (https://www.euskadi.eus/diccionario-elhuyar/).
        OUTPUT JSON: { "slogan": "...", "initialPlatos": [...] }
    `;

    const parts: any[] = [];
    if (fileData && mimeType) {
        parts.push(mimeType.startsWith('text/') ? { text: fileData } : { inlineData: { mimeType, data: fileData } });
    }
    parts.push({ text: `Prompt: ${prompt}` });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: { parts },
            config: { 
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                tools: [{ googleSearch: {} }]
            }
        });

        const result = JSON.parse(response.text || '{}');
        return {
            slogan: result.slogan || "Cocina de Calidad",
            initialPlatos: (result.initialPlatos || []).map((p: any) => ({
                ...p,
                ID_Plato: Number(p.ID_Plato) || Math.floor(Math.random() * 1000),
                Precio: Number(p.Precio) || 0,
                Categoria: "CARTA",
                Rol_Menu: null,
                Alergenos: Array.isArray(p.Alergenos) ? p.Alergenos : []
            }))
        };
    } catch (error) {
        console.error("Generation error:", error);
        throw error;
    }
};


let _apiAppId = "";
export const setApiAppId = (id: string) => { _apiAppId = id; };
const getPlatosPath = () => `restaurants/${_apiAppId || getActiveConfig().id}/platos`;
const getConfigPath = () => `restaurants/${_apiAppId || getActiveConfig().id}`;

const getApps = async (): Promise<RestaurantConfig[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        const apps = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data } as RestaurantConfig;
        }).filter(app => app.name); // Only return apps that have a name (not just menuPrice stubs)
        return apps;
    } catch (e) {
        console.error("Error fetching apps from Firebase:", e);
        return [];
    }
};

const saveApp = async (app: RestaurantConfig, isNewApp: boolean = false) => {
    try {
        await setDoc(doc(db, 'restaurants', app.id), app, { merge: true });
        // Also save initial platos only if it's a new app to prevent overwriting existing edited plates
        if (isNewApp && app.initialPlatos && Array.isArray(app.initialPlatos)) {
            const batch = writeBatch(db);
            app.initialPlatos.forEach(p => {
                const docRef = doc(collection(db, `restaurants/${app.id}/platos`), p.ID_Plato.toString());
                batch.set(docRef, p);
            });
            await batch.commit();
        }
    } catch (e) {
        console.error("Error saving app:", e);
    }
};

const deleteAppFromDb = async (id: string) => {
    try {
        // In a real app we'd delete subcollections first. For this scale, it's fine.
        await deleteDoc(doc(db, 'restaurants', id));
    } catch (e) {
        console.error("Error deleting app:", e);
    }
};

const getPlatos = async (): Promise<Plato[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, getPlatosPath()));
        let platos = querySnapshot.docs.map(doc => doc.data() as Plato);
        
        if (platos.length === 0) {
            console.log('Seeding initial platos...');
            const config = getActiveConfig();
            let initialData = config.initialPlatos && config.initialPlatos.length > 0 ? config.initialPlatos : bolinaConfig.initialPlatos;
            if (typeof window !== 'undefined' && window.localStorage) {
                try {
                    const stored = window.localStorage.getItem(config.id);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            initialData = parsed;
                            console.log('Migrated data from LocalStorage to Firebase');
                        }
                    }
                } catch(e) {}
            }
            platos = initialData || [];
            
            const batch = writeBatch(db);
            platos.forEach(p => {
                const docRef = doc(collection(db, getPlatosPath()), p.ID_Plato.toString());
                batch.set(docRef, p);
            });
            await batch.commit();
        }
        
        // Sort by ID_Plato to keep order
        platos.sort((a, b) => a.ID_Plato - b.ID_Plato);
        return platos;
    } catch (e) {
        console.error("Error fetching platos from Firebase:", e);
        return getActiveConfig().initialPlatos;
    }
};

const getMenuPrice = async (): Promise<number> => {
    try {
        const docSnap = await getDoc(doc(db, getConfigPath()));
        if (docSnap.exists() && docSnap.data().menuPrice !== undefined) {
            return parseFloat(docSnap.data().menuPrice);
        }
        // Migration from LocalStorage
        let fallbackPrice = 16.50;
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = window.localStorage.getItem(`${getActiveConfig().id}_price`);
            if (stored) fallbackPrice = parseFloat(stored);
        }
        // Save it to firebase
        await setDoc(doc(db, getConfigPath()), { menuPrice: fallbackPrice }, { merge: true });
        return fallbackPrice;
    } catch (e) {
        console.error("Error fetching menu price:", e);
        return 16.50;
    }
};

const subscribeToPlatos = (callback: (platos: Plato[]) => void) => {
    return onSnapshot(collection(db, getPlatosPath()), { includeMetadataChanges: true }, (querySnapshot) => {
        const platos = querySnapshot.docs.map(doc => doc.data() as Plato);
        
        if (platos.length > 0) {
            platos.sort((a, b) => a.ID_Plato - b.ID_Plato);
            callback(platos);
        } else {
            // If cache is empty or server is empty, show initial data immediately
            callback(getActiveConfig().initialPlatos || bolinaConfig.initialPlatos);
            
            // Only seed if we confirmed with the server that it's actually empty
            if (!querySnapshot.metadata.fromCache) {
                getPlatos().catch(e => console.error("Error seeding platos:", e));
            }
        }
    }, (error) => {
        console.error("Error in platos subscription:", error);
    });
};

const subscribeToMenuPrice = (callback: (price: number) => void) => {
    return onSnapshot(doc(db, getConfigPath()), { includeMetadataChanges: true }, (docSnap) => {
        if (docSnap.exists() && docSnap.data().menuPrice !== undefined) {
            callback(parseFloat(docSnap.data().menuPrice));
        } else {
            callback(16.50); // Fallback until seeded
            if (!docSnap.metadata.fromCache) {
                getMenuPrice().catch(e => console.error("Error seeding price:", e));
            }
        }
    }, (error) => {
        console.error("Error in menu price subscription:", error);
    });
};

const updatePlato = async (id: number, data: Partial<Plato>) => {
    try {
        const docRef = doc(db, getPlatosPath(), id.toString());
        await updateDoc(docRef, data);
    } catch (e) {
        console.error("Error updating plato:", e);
    }
};

const updatePlatosOrder = async (newOrder: Plato[]) => {
    try {
        const batch = writeBatch(db);
        newOrder.forEach((p, index) => {
            const docRef = doc(db, getPlatosPath(), p.ID_Plato.toString());
            batch.set(docRef, p, { merge: true }); 
        });
        await batch.commit();
    } catch (e) {
        console.error("Error updating order:", e);
    }
};

const addPlato = async (plato: any) => {
    try {
        const currentPlatos = await getPlatos();
        const newId = Math.max(...currentPlatos.map(p => p.ID_Plato), 0) + 1;
        const newPlato = { ...plato, ID_Plato: newId, Activo_Dia: true };
        await setDoc(doc(db, getPlatosPath(), newId.toString()), newPlato);
    } catch (e) {
        console.error("Error adding plato:", e);
    }
};

const deletePlato = async (id: number) => {
    try {
        await deleteDoc(doc(db, getPlatosPath(), id.toString()));
    } catch (e) {
        console.error("Error deleting plato:", e);
    }
};

const setMenuPrice = async (price: number) => {
    try {
        await setDoc(doc(db, getConfigPath()), { menuPrice: price }, { merge: true });
    } catch (e) {
        console.error("Error setting menu price:", e);
    }
};

export default {
    setApiAppId,
    getApps,
    saveApp,
    deleteAppFromDb,

    getPlatos,
    getMenuPrice,
    subscribeToPlatos,
    subscribeToMenuPrice,
    updatePlato,
    updatePlatosOrder,
    addPlato,
    deletePlato,
    setMenuPrice,
    translateText,
    analyzeDish,
    generateAppConfig, 
    login: async (u: string, p: string) => {
        const appId = _apiAppId || getActiveConfig().id;
        try {
            const snap = await getDoc(doc(db, 'restaurants', appId));
            if (snap.exists()) {
                const appData = snap.data();
                const expectedPass = appData.adminPassword || '1234';
                if (u === 'admin' && p === expectedPass) return true;
            } else {
                if (u === 'admin' && p === '1234') return true;
            }
        } catch(e) {
            console.error('Login error:', e);
        }
        throw new Error('Credenciales incorrectas');
    }
};

