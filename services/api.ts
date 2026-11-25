
import { GoogleGenAI, Type } from "@google/genai";
import type { Plato, RestaurantConfig, Alergeno, UploadedAppFile, CustomThemeColors } from '../types';
import { getActiveConfig, bolinaConfig } from '../config/restaurant';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch, onSnapshot } from 'firebase/firestore';
import kanalaDictionary from '../src/data/kanala_dictionary.json';


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
    
    // Check local knowledge base for Kanala
    const currentConfig = getActiveConfig();
    if (currentConfig.officialWebsite && currentConfig.officialWebsite.includes('kanalabeach')) {
        const normalizedText = text.trim().toLowerCase();
        const strippedText = normalizedText.replace(/\s*\(.*?\)\s*/g, '').trim();
        
        // Search by exact dish name or exact description
        const match = kanalaDictionary.find((d: any) => 
            (d.desc_es && d.desc_es.toLowerCase() === normalizedText) || 
            (d.plato_es && d.plato_es.toLowerCase() === normalizedText) ||
            (d.plato_es && d.plato_es.toLowerCase() === strippedText)
        );
        
        if (match) {
            let directTranslation = null;
            if (targetLang === 'EU' && match.desc_eu && match.desc_es && match.desc_es.toLowerCase() === normalizedText) directTranslation = match.desc_eu;
            if (targetLang === 'EN' && match.desc_en && match.desc_es && match.desc_es.toLowerCase() === normalizedText) directTranslation = match.desc_en;
            if (targetLang === 'FR' && match.desc_fr && match.desc_es && match.desc_es.toLowerCase() === normalizedText) directTranslation = match.desc_fr;
            
            if (targetLang === 'EU' && match.plato_eu && match.plato_es && (match.plato_es.toLowerCase() === normalizedText || match.plato_es.toLowerCase() === strippedText)) directTranslation = match.plato_eu;
            if (targetLang === 'EN' && match.plato_en && match.plato_es && (match.plato_es.toLowerCase() === normalizedText || match.plato_es.toLowerCase() === strippedText)) directTranslation = match.plato_en;
            if (targetLang === 'FR' && match.plato_fr && match.plato_es && (match.plato_es.toLowerCase() === normalizedText || match.plato_es.toLowerCase() === strippedText)) directTranslation = match.plato_fr;

            if (directTranslation) {
                return { text: directTranslation, sources: [] };
            }
        }
    }

    try {
        const isBasque = targetLang === 'EU';
        const systemPrompt = `You are a professional restaurant translator and culinary expert.
        Translate the Spanish dish name or culinary text completely into natural, idiomatic ${targetLangName}.
        CRITICAL RULES:
        - NEVER leave Spanish words untranslated (except proper nouns/brands/places like Joselito, Kanala, Wagyu, Idiazabal, Josper, Navarra, Huelva).
        - Use authentic restaurant menu terminology in ${targetLangName} (for Italian and German, write natural fine-dining menu names that native Italian/German diners immediately understand).
        - Preserve dietary notes like "(sin gluten)" translated properly ("(senza glutine)" in Italian, "(glutenfrei)" in German, "(gluten-free)" in English, "(sans gluten)" in French).
        ${isBasque ? "CRITICAL: For Basque (EU) translations, you MUST verify terminology using the Elhuyar Dictionary (https://www.euskadi.eus/diccionario-elhuyar/) to ensure academic correctness." : ""}
        Respond ONLY with the translated text, no quotes or commentary.`;

        const response = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: `Translate this Spanish menu item into ${targetLangName}: "${text}"`,
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

export const analyzeDish = async (dishName: string, dishDescription?: string): Promise<{ ok: boolean, translations: Record<string, string>, allergens: Alergeno[], sources: any[] }> => {
    if (!dishName || !apiKey) return { ok: false, translations: {}, allergens: [], sources: [] };
    
    // Lista oficial de los 14 alérgenos de obligada declaración en la UE (Reglamento 1169/2011) + retrocompatibilidad
    const allergenList = [
        "GLUTEN", "CRUSTACEOS", "HUEVOS", "PESCADO", "CACAHUETES", "SOJA", "LACTEOS", 
        "FRUTOS_CASCARA", "APIO", "MOSTAZA", "SESAMO", "SULFITOS", "ALTRAMUCES", "MOLUSCOS", 
        "CALAMARES", "MARISCO"
    ];

    const currentConfig = getActiveConfig();
    let websiteSearchRule = "";
    let kanalaExactMatch: any = null;
    if (currentConfig.officialWebsite) {
        let baseUrl = currentConfig.officialWebsite.trim();
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
        
        let exactMatchStr = "";
        // Consulta prioritaria de base de conocimiento local para Kanala o cualquier app configurada
        if (baseUrl.includes('kanalabeach')) {
            const normalizedDishName = dishName.trim().toLowerCase();
            const strippedDishName = normalizedDishName.replace(/\s*\(.*?\)\s*/g, '').trim();
            const match = kanalaDictionary.find((d: any) =>
                d.plato_es && (
                    d.plato_es.toLowerCase() === normalizedDishName ||
                    d.plato_es.toLowerCase() === strippedDishName
                )
            );
            if (match) {
                kanalaExactMatch = match;
                exactMatchStr = `
        WE FOUND THE OFFICIAL RESTAURANT TRANSLATIONS IN THE LOCAL KNOWLEDGE BASE FOR THIS EXACT DISH. YOU MUST USE THESE EXACT STRINGS WITHOUT INVENTING ANYTHING NEW:
        - Basque (EU): "${match.plato_eu}"
        - English (EN): "${match.plato_en}"
        - French (FR): "${match.plato_fr}"
        For these 3 languages, DO NOT perform a web search. Just output those exact strings.
        For German (DE) and Italian (IT), you MUST generate complete, idiomatic, high-end restaurant menu translations (NEVER leave DE or IT empty or untranslated).`;
            }
        }

        websiteSearchRule = `2. CRITICAL - DO NOT INVENT TRANSLATIONS: The active restaurant (${currentConfig.name}) has an official website at ${baseUrl}. ${exactMatchStr ? exactMatchStr : `You MUST use Google Search to inspect the official website (${baseUrl}) and identify whether this dish or equivalent appears on their multilingual pages.
        - For Basque (EU), check: ${baseUrl}/eu/ or Basque menu sections
        - For English (EN), check: ${baseUrl}/en/ or English menu sections
        - For French (FR), check: ${baseUrl}/fr/ or French menu sections
        If found on the official website, you MUST return EXACTLY what is written there without changing a single letter. Only generate a translation if the dish is absent from the official website.`}`;
    } else {
        websiteSearchRule = `2. (No official website configured for restaurant "${currentConfig.name}", generate standard authentic culinary translations).`;
    }

    const dishContext = dishDescription ? `Dish Name: "${dishName}". Description / Ingredients: "${dishDescription}"` : `Dish Name: "${dishName}"`;

    const systemPrompt = `
        You are an expert culinary AI, certified food safety inspector, and multilingual gastronomic translator.
        Analyze the Spanish Dish Name and optional Ingredients/Description provided.
        
        CRITICAL TRANSLATION RULES:
        1. You MUST translate the dish name completely into ALL FIVE languages: EU (Basque), EN (English), FR (French), DE (German), IT (Italian). Every single key (EU, EN, FR, DE, IT) MUST be a non-empty string.
        ${websiteSearchRule}
        3. For EU (Basque), if it's not already on the restaurant's official website or knowledge base, you MUST strictly search and cross-reference with the Elhuyar Hiztegia (https://www.euskadi.eus/diccionario-elhuyar/) using Google Search to ensure authentic, grammatically correct Euskera.
        4. CRITICAL FOR ITALIAN (IT) AND GERMAN (DE) (as well as EN and FR):
           - NEVER leave IT or DE empty, partial, or with untranslated Spanish words (except proper nouns/brands/origins like Joselito, Kanala, Wagyu, Idiazabal, Josper, Navarra, Huelva, Angus, Burger).
           - Translate every ingredient, cooking method, and note naturally into idiomatic fine-dining Italian and German:
             * "a la brasa" -> IT: "alla brace", DE: "vom Holzkohlegrill" / "gegrillt"
             * "a baja temperatura" -> IT: "a bassa temperatura", DE: "bei Niedrigtemperatur gegart"
             * "arroz meloso" -> IT: "Riso cremoso", DE: "Cremiger Reis"
             * "sin gluten" -> IT: "(senza glutine)", DE: "(glutenfrei)"
             * "rebozada/o" -> IT: "impanato/a", DE: "paniert"
             * "ración" -> IT: "(Porzione)", DE: "(Portion)"
             * "kokotxas" -> IT: "Guance di nasello (Kokotxas)", DE: "Seehecht-Bäckchen (Kokotxas)"
             * "zamburiñas" -> IT: "Canestrelli", DE: "Kleine Jakobsmuscheln"
             * "piparras" -> IT: "peperoncini baschi (piparras)", DE: "baskische Peperoni (Piparras)"
             * "ajetes" -> IT: "aglietti freschi", DE: "junger Knoblauch"
           - Use proper Italian and German spelling and accents (e.g., "iberico", not "ibérico" in Italian).

        CRITICAL EU ALLERGEN RULES (Regulation EU 1169/2011):
        Detect ALL allergens present in the standard culinary recipe and the stated ingredients from this list ONLY: ${allergenList.join(', ')}.
        
        Detailed allergen detection guidelines:
        - GLUTEN: Wheat, barley, rye, oats, flour, batter ("rebozado", "empanado", "tempura"), bread, dough ("masa"), pasta, pizza, puff pastry ("hojaldre"), croutons, croustades, soy sauce ("salsa de soja"), roux, bechamel, beer.
        - CRUSTACEOS: Shrimps, prawns ("gambas", "langostinos"), lobster ("bogavante", "langosta"), crab ("buey de mar", "centollo", "nécora", "txangurro"), crayfish ("cigalas").
        - HUEVOS: Whole eggs, egg whites, yolks, mayonnaise ("mayonesa", "mahonesa"), aioli ("alioli"), tortillas, revueltos, omelettes, batters, fresh egg pasta, meringue, custard ("flan", "natillas"), pastries.
        - PESCADO: Any finfish (merluza, bacalao, atún, bonito, anchoas, salmón, lubina, rodaballo, etc.), fish fumet/broth, fish roe ("huevas"), anchovy dressing, worcestershire sauce.
        - CACAHUETES: Peanuts, peanut oil, satay sauce, peanut butter.
        - SOJA: Soy sauce ("soja"), edamame, tofu, miso, tamari, teriyaki sauce, soy lecithin.
        - LACTEOS: Milk, cream ("nata"), butter ("mantequilla"), cheese ("queso", "parmesano", "mozzarella", "idiazabal", "roquefort"), yogurt, bechamel, ice cream, dishes with milk-derived sauces.
        - FRUTOS_CASCARA: Tree nuts (walnuts "nueces", almonds "almendras", hazelnuts "avellanas", pine nuts "piñones", cashews "anacardos", pistachios "pistachos", pecans, macadamias), pesto sauce (traditional pesto has pine nuts), romesco, praliné.
        - APIO: Celery, celery salt, meat or vegetable broths/stocks made with celery.
        - MOSTAZA: Mustard, dijon mustard, mustard dressings, vinaigrettes with mustard.
        - SESAMO: Sesame seeds, tahini, burger buns with sesame, oriental dressings.
        - SULFITOS: Wine (red, white, sparkling) in reductions or sauces ("al vino", "al cava", "al txakoli"), vinegar, cider ("sidra"), dried fruits, sausages/cured meats with sulfites.
        - ALTRAMUCES: Lupin beans, lupin flour.
        - MOLUSCOS: Squid ("calamar", "chipirón", "rabas"), octopus ("pulpo"), cuttlefish ("sepia", "txoco"), clams ("almejas"), mussels ("mejillones"), oysters ("ostras"), cockles ("berberechos"), scallops ("zamburiñas", "vieiras"), snails.
        - MARISCO: If the dish refers generically to seafood ("marisco", "zarzuela", "paella de marisco"), include MARISCO and the specific ones (CRUSTACEOS/MOLUSCOS).
        - CALAMARES: If the dish contains squid, chipirón, rabas or sepia, include CALAMARES as well as MOLUSCOS.

        Return JSON ONLY.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: dishContext,
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
                            },
                            required: ["EU", "EN", "FR", "DE", "IT"]
                        },
                        allergens: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["translations", "allergens"]
                },
                tools: [{ googleSearch: {} }]
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        const result = JSON.parse(text);
        const translationsResult: Record<string, string> = { ...(result.translations || {}) };

        // Inyectar traducciones exactas del diccionario local oficial si existe coincidencia
        if (kanalaExactMatch) {
            if (kanalaExactMatch.plato_eu) translationsResult.EU = kanalaExactMatch.plato_eu;
            if (kanalaExactMatch.plato_en) translationsResult.EN = kanalaExactMatch.plato_en;
            if (kanalaExactMatch.plato_fr) translationsResult.FR = kanalaExactMatch.plato_fr;
        }

        // Red de seguridad: si algún idioma (especialmente IT o DE) vino vacío, traducirlo individualmente
        const langNames: Record<string, string> = { EU: 'Basque', EN: 'English', FR: 'French', DE: 'German', IT: 'Italian' };
        for (const code of ['EU', 'EN', 'FR', 'DE', 'IT']) {
            if (!translationsResult[code] || !translationsResult[code].trim()) {
                const fallback = await translateText(dishName, code, langNames[code]);
                if (fallback.text) translationsResult[code] = fallback.text;
            }
        }

        return {
            ok: true,
            translations: translationsResult,
            allergens: Array.isArray(result.allergens) ? result.allergens : [],
            sources: extractSources(response)
        };
    } catch (error) {
        console.error("Error analyzing dish:", error);
        return { ok: false, translations: {}, allergens: [], sources: [] };
    }
};

export const generateAppConfig = async (
    prompt: string,
    files: UploadedAppFile[] = [],
    restaurantName?: string
): Promise<{ slogan: string, initialPlatos: Plato[], customColors?: CustomThemeColors }> => {
    if (!apiKey) throw new Error("API Key missing");

    const roleLabels: Record<string, string> = {
        menu: 'Carta / Menú / Precios',
        logo: 'Logotipo oficial del local',
        palette: 'Tabla de colores / Guía de estilo visual',
        other: 'Documento o referencia adicional'
    };

    const hasPaletteOrVisual = files.some(f => f.role === 'palette' || f.role === 'logo') || /color|paleta|oscuro|dark|fondo|estilo|hex|#/i.test(prompt || '');

    const systemPrompt = `
        You are an expert hospitality app generator, certified EU food safety inspector, and multilingual gastronomic translator.
        You will receive one or MULTIPLE files (menu photos, PDFs, text/CSV lists, logos, color palettes, style references) plus the user's instructions for "${restaurantName || 'a restaurant/bar'}".

        CRITICAL EXTRACTION & COMPLETENESS RULES:
        1. Analyze EVERY SINGLE uploaded file thoroughly. Extract ALL dishes, tapas, pintxos, raciones, drinks/portions, menus, and prices visible across ALL menu files without skipping pages or items.
        2. For EVERY dish, generate COMPLETE, idiomatic translations in ALL FIVE languages (NEVER leave any language empty or with untranslated Spanish words except proper nouns/brands):
           - ES_Nombre: Original Spanish dish name
           - EU_Nombre: Authentic Basque (Euskera) following Elhuyar standards (https://www.euskadi.eus/diccionario-elhuyar/)
           - EN_Nombre: Natural restaurant English
           - FR_Nombre: Natural restaurant French
           - DE_Nombre: Natural restaurant German
           - IT_Nombre: Natural restaurant Italian
        3. For EVERY dish, detect ALL applicable EU mandatory allergens (Regulation EU 1169/2011) strictly from:
           GLUTEN, CRUSTACEOS, HUEVOS, PESCADO, CACAHUETES, SOJA, LACTEOS, FRUTOS_CASCARA, APIO, MOSTAZA, SESAMO, SULFITOS, ALTRAMUCES, MOLUSCOS.
        4. Categorize each dish accurately:
           - Categoria: "CARTA" (or "MENU" if it belongs to a Menú del Día, or "CARTA,MENU" if both)
           - Tipo: one of "ENTRANTE", "ENSALADA", "ARROZ", "MARISCO", "PESCADO", "CARNE", "POSTRE"
           - Es_Racion: true if it is a ración / tapa / pintxo / media ración, otherwise false
           - Rol_Menu: "PRIMERO", "SEGUNDO", "POSTRE", "RACION", or null
           - Precio: numeric price (e.g. 12.5), or 0 if not shown
           - Descripcion: brief Spanish description/ingredients if present on the menu (optional)
        5. ${hasPaletteOrVisual ? `COLOR PALETTE EXTRACTION: The user provided a color palette/logo or color instructions. Extract a harmonious, high-contrast, readable hex color palette in "customColors": { "background": "#...", "surface": "#...", "text": "#...", "accent": "#...", "isDark": true/false }. Ensure strong WCAG readability between "text" and "surface"/"background".` : `If the user did not request custom colors or upload a color table, omit "customColors" or set it to null.`}

        OUTPUT VALID JSON ONLY matching:
        {
          "slogan": "Short authentic tagline in Spanish",
          "customColors": { "background": "#...", "surface": "#...", "text": "#...", "accent": "#...", "isDark": false } | null,
          "initialPlatos": [
            {
              "ID_Plato": 1,
              "Precio": 12.5,
              "ES_Nombre": "...",
              "EU_Nombre": "...",
              "EN_Nombre": "...",
              "FR_Nombre": "...",
              "DE_Nombre": "...",
              "IT_Nombre": "...",
              "Descripcion": "",
              "Categoria": "CARTA",
              "Tipo": "ENTRANTE",
              "Activo_Dia": true,
              "Rol_Menu": null,
              "Es_Racion": false,
              "Alergenos": ["GLUTEN"]
            }
          ]
        }
    `;

    const parts: any[] = [];
    for (const file of files) {
        const label = `[Archivo adjunto: "${file.name}" — Tipo: ${roleLabels[file.role] || 'Referencia'}]`;
        parts.push({ text: label });
        const isBinary = file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf';
        if (isBinary) {
            parts.push({ inlineData: { mimeType: file.mimeType, data: file.data } });
        } else {
            parts.push({ text: file.data });
        }
    }

    parts.push({
        text: `Restaurante/Bar: ${restaurantName || 'Nuevo local'}\nInstrucciones del usuario: ${prompt || 'Extrae toda la carta, traduce a los 5 idiomas, detecta todos los alérgenos y adapta la estética según los archivos adjuntos.'}`
    });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: { parts },
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                tools: [{ googleSearch: {} }]
            }
        });

        const result = JSON.parse(response.text || '{}');
        const validHex = (v: any) => typeof v === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(v.trim());
        let customColors: CustomThemeColors | undefined = undefined;
        if (
            result.customColors &&
            validHex(result.customColors.background) &&
            validHex(result.customColors.surface) &&
            validHex(result.customColors.text) &&
            validHex(result.customColors.accent)
        ) {
            customColors = {
                background: result.customColors.background.trim(),
                surface: result.customColors.surface.trim(),
                text: result.customColors.text.trim(),
                accent: result.customColors.accent.trim(),
                isDark: Boolean(result.customColors.isDark)
            };
        }

        const validTypes = new Set(["ENTRANTE", "ENSALADA", "ARROZ", "MARISCO", "PESCADO", "CARNE", "POSTRE"]);
        return {
            slogan: result.slogan || "Cocina de Calidad",
            customColors,
            initialPlatos: (Array.isArray(result.initialPlatos) ? result.initialPlatos : []).map((p: any, idx: number) => ({
                ...p,
                ID_Plato: idx + 1,
                Precio: Number(p.Precio) || 0,
                ES_Nombre: String(p.ES_Nombre || '').trim(),
                EU_Nombre: String(p.EU_Nombre || p.ES_Nombre || '').trim(),
                EN_Nombre: String(p.EN_Nombre || p.ES_Nombre || '').trim(),
                FR_Nombre: String(p.FR_Nombre || p.ES_Nombre || '').trim(),
                DE_Nombre: String(p.DE_Nombre || p.ES_Nombre || '').trim(),
                IT_Nombre: String(p.IT_Nombre || p.ES_Nombre || '').trim(),
                Categoria: String(p.Categoria || 'CARTA').toUpperCase(),
                Tipo: validTypes.has(String(p.Tipo || '').toUpperCase()) ? String(p.Tipo).toUpperCase() : 'ENTRANTE',
                Activo_Dia: p.Activo_Dia !== false,
                Rol_Menu: p.Rol_Menu || null,
                Es_Racion: Boolean(p.Es_Racion),
                Alergenos: Array.isArray(p.Alergenos) ? p.Alergenos : []
            })).filter((p: any) => p.ES_Nombre)
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
    login: async (u: string, p: string, explicitAppId?: string) => {
        const appId = explicitAppId || _apiAppId || getActiveConfig().id;
        try {
            const snap = await getDoc(doc(db, 'restaurants', appId));
            if (snap.exists()) {
                const appData = snap.data();
                const expectedPass = String(appData.adminPassword || '1234').trim();
                if (u === 'admin' && p.trim() === expectedPass) return true;
            } else {
                if (u === 'admin' && p.trim() === '1234') return true;
            }
        } catch(e) {
            console.error('Login error:', e);
        }
        throw new Error('Contraseña incorrecta');
    }
};

