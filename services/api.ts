
import { GoogleGenAI } from "@google/genai";
import type { Plato, RestaurantConfig, Alergeno } from '../types';
import { getActiveConfig } from '../config/restaurant';

// --- CONFIG ---
const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY
  ? process.env.API_KEY
  : "";

const ai = new GoogleGenAI({ apiKey });

// Helper interno para obtener keys dinámicas usando la configuración activa
const getDbKey = () => {
    const config = getActiveConfig();
    return config ? config.id : 'bolina_viejo_v1';
};

const getPriceKey = () => `${getDbKey()}_price`;

export const translateText = async (text: string, targetLang: string, targetLangName: string): Promise<string> => {
    if (!text || !apiKey) return text;
    try {
        const systemPrompt = "You are a professional translator for a restaurant menu. Translate the text from Spanish to the target language. Keep it concise. No quotes.";
        const userQuery = `Translate "${text}" to ${targetLangName} (code: ${targetLang}).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userQuery,
            config: { systemInstruction: systemPrompt }
        });
        
        return response.text ? response.text.trim().replace(/^"(.*)"$/, '$1') : text;
    } catch (error) {
        console.error("Translation error:", error);
        return text;
    }
};

// NUEVA FUNCIÓN: Analiza un plato para devolver traducciones y alérgenos
export const analyzeDish = async (dishName: string): Promise<{ translations: Record<string, string>, allergens: Alergeno[] }> => {
    if (!dishName || !apiKey) return { translations: {}, allergens: [] };
    
    const allergenList = [
        "GLUTEN", "CRUSTACEOS", "HUEVOS", "PESCADO", "CACAHUETES", "SOJA", "LACTEOS", 
        "APIO", "MOSTAZA", "SESAMO", "SULFITOS", "ALTRAMUCES", "MOLUSCOS"
    ];

    const systemPrompt = `
        You are an expert Chef and Nutritionist. 
        Analyze the given Spanish Dish Name.
        
        Tasks:
        1. Translate the dish name to: Euskera (EU), English (EN), French (FR), German (DE), Italian (IT).
        2. Detect potential allergens STRICTLY based on the dish name and common culinary knowledge for that dish.
        3. Only select allergens from this list: ${allergenList.join(', ')}.

        Return JSON ONLY. Format:
        {
            "translations": { "EU": "...", "EN": "...", "FR": "...", "DE": "...", "IT": "..." },
            "allergens": ["GLUTEN", "LACTEOS", ...]
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Dish Name: "${dishName}"`,
            config: { 
                systemInstruction: systemPrompt,
                responseMimeType: "application/json"
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        const result = JSON.parse(text);
        return {
            translations: result.translations || {},
            allergens: result.allergens || []
        };
    } catch (error) {
        console.error("Error analyzing dish:", error);
        return { translations: {}, allergens: [] };
    }
};

// NUEVA FUNCIÓN: Genera platos nuevos basándose en el prompt
export const generateAppConfig = async (prompt: string, fileData: string | null, mimeType: string | null): Promise<{ slogan: string, initialPlatos: Plato[] }> => {
    if (!apiKey) throw new Error("API Key missing");

    const systemPrompt = `
        You are an AI Menu Digitizer & Generator. 
        Your goal is to CREATE a restaurant menu structure based on the User Prompt and/or User File.
        
        OUTPUT FORMAT (JSON ONLY):
        {
            "slogan": "A short, catchy slogan for the restaurant",
            "initialPlatos": [
                {
                    "ID_Plato": number (sequential starting from 1),
                    "ES_Nombre": "Name in Spanish",
                    "EU_Nombre": "Name in Basque (Translation)",
                    "EN_Nombre": "Name in English (Translation)",
                    "FR_Nombre": "Name in French (Translation)",
                    "DE_Nombre": "Name in German (Translation)",
                    "IT_Nombre": "Name in Italian (Translation)",
                    "Precio": number (e.g., 12.50),
                    "Tipo": "One of: ENTRANTE, ENSALADA, ARROZ, MARISCO, PESCADO, CARNE, POSTRE",
                    "Categoria": "CARTA",
                    "Activo_Dia": true,
                    "Es_Racion": boolean (true if it's a starter/tapa/sharing portion),
                    "Alergenos": ["List of allergens from: GLUTEN, CRUSTACEOS, HUEVOS, PESCADO, CACAHUETES, SOJA, LACTEOS, APIO, MOSTAZA, SESAMO, SULFITOS, ALTRAMUCES, MOLUSCOS"]
                }
            ]
        }

        INSTRUCTIONS:
        1. Extract dishes from the user input (Image, PDF, or Text) if provided.
        2. If the user input is a concept (e.g. "Sushi Bar"), GENERATE 20-30 appropriate dishes.
        3. Do NOT simply copy the existing "Boliña" menu unless explicitly asked.
        4. Estimate prices if missing.
        5. Translate names to the requested languages automatically.
        6. Categorize dishes (Tipo) correctly.
    `;

    // Construct message parts
    const parts: any[] = [];
    
    // Add file part if exists
    if (fileData && mimeType) {
        if (mimeType.startsWith('text/') || mimeType === 'application/json' || mimeType === 'text/csv') {
             parts.push({ text: `User File Content: \n${fileData}` });
        } else {
             parts.push({
                 inlineData: {
                     mimeType: mimeType,
                     data: fileData
                 }
             });
        }
    }

    // Add prompt part
    parts.push({ text: `User Instructions: ${prompt}` });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: { 
                systemInstruction: systemPrompt,
                responseMimeType: "application/json"
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        const result = JSON.parse(text);
        
        // Validación básica y sanitización
        const platos = (result.initialPlatos || []).map((p: any) => ({
            ...p,
            ID_Plato: Number(p.ID_Plato) || Math.floor(Math.random() * 1000),
            Precio: Number(p.Precio) || 0,
            Categoria: "CARTA", // Forzamos base
            Rol_Menu: null,
            Alergenos: Array.isArray(p.Alergenos) ? p.Alergenos : []
        }));

        return {
            slogan: result.slogan || "Cocina de Calidad",
            initialPlatos: platos
        };

    } catch (error) {
        console.error("Error generating app config:", error);
        throw error;
    }
};

const loadData = (): Plato[] => {
    const config = getActiveConfig();
    
    // Si la configuración no es válida, retornamos array vacío para evitar crash
    if (!config || !config.initialPlatos) return [];

    if (typeof localStorage === 'undefined') return config.initialPlatos;
    
    const key = config.id;
    const stored = localStorage.getItem(key);
    
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                if (parsed.length === 0 && config.initialPlatos.length > 0) {
                    console.warn("Datos locales vacíos detectados. Restaurando configuración inicial.");
                    return config.initialPlatos;
                }

                return parsed.map((p: any) => ({
                    ...p,
                    Es_Racion: p.Es_Racion ?? ['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO'].includes(p.Tipo),
                    Alergenos: p.Alergenos || []
                }));
            }
        } catch (e) {
            console.error("Error cargando datos locales, usando fallback", e);
        }
    }
    return config.initialPlatos;
};

const saveData = (platos: Plato[]) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(getDbKey(), JSON.stringify(platos));
    }
};

const loadPrice = (): number => {
    if (typeof localStorage === 'undefined') return 16.50;
    const stored = localStorage.getItem(getPriceKey());
    return stored ? parseFloat(stored) : 16.50;
};

const savePrice = (price: number) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(getPriceKey(), price.toString());
    }
};

export default {
    getPlatos: async (): Promise<Plato[]> => {
        const data = loadData();
        return new Promise(resolve => setTimeout(() => resolve(data), 50));
    },
    getMenuPrice: async (): Promise<number> => {
        const price = loadPrice();
        return new Promise(resolve => setTimeout(() => resolve(price), 50));
    },
    updatePlato: async (id: number, data: Partial<Plato>): Promise<void> => {
        const current = loadData();
        const updated = current.map(p => p.ID_Plato === id ? { ...p, ...data } : p);
        saveData(updated);
    },
    updatePlatosOrder: async (newOrder: Plato[]): Promise<void> => {
        saveData(newOrder);
    },
    addPlato: async (plato: Omit<Plato, 'ID_Plato'>): Promise<void> => {
        const current = loadData();
        const newId = Math.max(...current.map(p => p.ID_Plato), 0) + 1;
        const defaultRacionTypes = ['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO'];
        const newPlato = { 
            ...plato, 
            ID_Plato: newId, 
            Rol_Menu: null, 
            Activo_Dia: true,
            Es_Racion: plato.Es_Racion ?? defaultRacionTypes.includes(plato.Tipo as string),
            Alergenos: plato.Alergenos || []
        } as Plato;
        current.push(newPlato);
        saveData(current);
    },
    deletePlato: async (id: number): Promise<void> => {
        const current = loadData();
        const updated = current.filter(p => p.ID_Plato !== id);
        saveData(updated);
    },
    setMenuPrice: async (price: number): Promise<void> => {
        savePrice(price);
    },
    translateText,
    analyzeDish,
    generateAppConfig, 
    login: async (u: string, p: string) => {
        if (u === 'admin' && p === '1234') return true;
        throw new Error('Credenciales incorrectas');
    }
};
