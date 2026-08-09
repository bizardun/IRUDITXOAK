
import { GoogleGenAI, Type } from "@google/genai";
import type { Plato, RestaurantConfig, Alergeno } from '../types';
import { getActiveConfig } from '../config/restaurant';

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

    const systemPrompt = `
        You are an expert culinary AI and food safety inspector.
        Analyze the Spanish Dish Name provided.
        
        1. Translate the dish name to: EU, EN, FR, DE, IT.
        2. For EU (Basque), you MUST use Google Search to cross-reference with https://www.euskadi.eus/diccionario-elhuyar/.
        3. Detect ALL allergens present in the standard recipe for this dish from the following list ONLY: ${allergenList.join(', ')}.
        
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

const loadData = (): Plato[] => {
    const config = getActiveConfig();
    if (!config || !config.initialPlatos) return [];
    if (typeof localStorage === 'undefined') return config.initialPlatos;
    const stored = localStorage.getItem(config.id);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
    }
    return config.initialPlatos;
};

const saveData = (platos: Plato[]) => {
    const config = getActiveConfig();
    if (typeof localStorage !== 'undefined' && config) {
        localStorage.setItem(config.id, JSON.stringify(platos));
    }
};

export default {
    getPlatos: async () => loadData(),
    getMenuPrice: async () => {
        const config = getActiveConfig();
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(`${config.id}_price`) : null;
        return stored ? parseFloat(stored) : 16.50;
    },
    updatePlato: async (id: number, data: Partial<Plato>) => {
        const current = loadData();
        saveData(current.map(p => p.ID_Plato === id ? { ...p, ...data } : p));
    },
    updatePlatosOrder: async (newOrder: Plato[]) => saveData(newOrder),
    addPlato: async (plato: any) => {
        const current = loadData();
        const newId = Math.max(...current.map(p => p.ID_Plato), 0) + 1;
        current.push({ ...plato, ID_Plato: newId, Activo_Dia: true });
        saveData(current);
    },
    deletePlato: async (id: number) => {
        const current = loadData();
        saveData(current.filter(p => p.ID_Plato !== id));
    },
    setMenuPrice: async (price: number) => {
        const config = getActiveConfig();
        localStorage.setItem(`${config.id}_price`, price.toString());
    },
    translateText,
    analyzeDish,
    generateAppConfig, 
    login: async (u: string, p: string) => {
        if (u === 'admin' && p === '1234') return true;
        throw new Error('Credenciales incorrectas');
    }
};
