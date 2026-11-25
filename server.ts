import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Kanala local official dictionary safely (works in both tsx and native Node)
let kanalaDictionary: any[] = [];
try {
    const dictPath = path.resolve(__dirname, 'src', 'data', 'kanala_dictionary.json');
    if (fs.existsSync(dictPath)) {
        kanalaDictionary = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    }
} catch (err) {
    console.error('Could not load kanala_dictionary.json:', err);
}

const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured on the server.');
    }
    return new GoogleGenAI({
        apiKey,
        httpOptions: {
            headers: {
                'User-Agent': 'aistudio-build',
            },
        },
    });
};

const extractSources = (response: any) => {
    return (
        response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map((chunk: any) => ({
                title: chunk.web?.title || 'Fuente de información',
                uri: chunk.web?.uri,
            }))
            .filter((s: any) => s.uri) || []
    );
};

const sanitizePublicHttpUrl = (raw?: string): string => {
    if (!raw || typeof raw !== 'string') return '';
    try {
        const parsed = new URL(raw.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
        const host = parsed.hostname.toLowerCase();
        if (
            host === 'localhost' ||
            host === '127.0.0.1' ||
            host === '::1' ||
            host === '0.0.0.0' ||
            host === '169.254.169.254' ||
            host.startsWith('10.') ||
            host.startsWith('192.168.') ||
            /^172\.(1[6-9]|2\d|3[01])\./.test(host)
        ) {
            return '';
        }
        return parsed.toString().replace(/\/$/, '');
    } catch {
        return '';
    }
};

const ALLOWED_LANGS: Record<string, string> = {
    EU: 'Basque',
    EN: 'English',
    FR: 'French',
    DE: 'German',
    IT: 'Italian',
};

const ALLOWED_FILE_MIMES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'text/csv',
    'text/markdown',
    'application/json',
]);

async function translateTextServer(
    text: string,
    targetLang: string,
    targetLangName: string,
    officialWebsite?: string
): Promise<{ text: string; sources: any[] }> {
    const cleanText = text.trim();
    if (!cleanText) return { text: cleanText, sources: [] };

    const safeWebsite = sanitizePublicHttpUrl(officialWebsite);
    if (safeWebsite && safeWebsite.includes('kanalabeach')) {
        const normalizedText = cleanText.toLowerCase();
        const strippedText = normalizedText.replace(/\s*\(.*?\)\s*/g, '').trim();

        const match = kanalaDictionary.find(
            (d: any) =>
                (d.desc_es && d.desc_es.toLowerCase() === normalizedText) ||
                (d.plato_es && d.plato_es.toLowerCase() === normalizedText) ||
                (d.plato_es && d.plato_es.toLowerCase() === strippedText)
        );

        if (match) {
            let directTranslation: string | null = null;
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

    const ai = getAiClient();
    const isBasque = targetLang === 'EU';
    const systemPrompt = `You are a professional restaurant translator and culinary expert.
    Translate the Spanish dish name or culinary text completely into natural, idiomatic ${targetLangName}.
    CRITICAL RULES:
    - NEVER leave Spanish words untranslated (except proper nouns/brands/places like Joselito, Kanala, Wagyu, Idiazabal, Josper, Navarra, Huelva).
    - Use authentic restaurant menu terminology in ${targetLangName} (for Italian and German, write natural fine-dining menu names that native Italian/German diners immediately understand).
    - Preserve dietary notes like "(sin gluten)" translated properly ("(senza glutine)" in Italian, "(glutenfrei)" in German, "(gluten-free)" in English, "(sans gluten)" in French).
    ${isBasque ? 'CRITICAL: For Basque (EU) translations, you MUST verify terminology using the Elhuyar Dictionary (https://www.euskadi.eus/diccionario-elhuyar/) to ensure academic correctness.' : ''}
    Respond ONLY with the translated text, no quotes or commentary.`;

    const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Translate this Spanish menu item into ${targetLangName}: "${cleanText}"`,
        config: {
            systemInstruction: systemPrompt,
            tools: isBasque ? [{ googleSearch: {} }] : undefined,
        },
    });

    return {
        text: response.text ? response.text.trim().replace(/^"(.*)"$/, '$1') : cleanText,
        sources: extractSources(response),
    };
}

const app = express();
app.use(express.json({ limit: '35mb' }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
});

// 1. Translate single text
app.post('/api/gemini/translate', async (req: Request, res: Response) => {
    try {
        const { text, targetLang, targetLangName, officialWebsite } = req.body || {};
        if (typeof text !== 'string' || !text.trim() || text.length > 4000) {
            res.status(400).json({ error: 'Texto inválido para traducir.' });
            return;
        }
        const normalizedLang = typeof targetLang === 'string' ? targetLang.trim().toUpperCase() : '';
        if (!ALLOWED_LANGS[normalizedLang]) {
            res.status(400).json({ error: 'Idioma de destino no soportado.' });
            return;
        }
        const langName =
            typeof targetLangName === 'string' && targetLangName.trim()
                ? targetLangName.trim().slice(0, 40)
                : ALLOWED_LANGS[normalizedLang];

        const result = await translateTextServer(text, normalizedLang, langName, officialWebsite);
        res.json(result);
    } catch (error: any) {
        console.error('Server translate error:', error);
        const status = Number(error?.status) >= 400 && Number(error?.status) < 600 ? Number(error.status) : 500;
        res.status(status).json({ error: error?.message || 'Error traduciendo con IA.' });
    }
});

// 2. Analyze dish (5-language translations + 14 EU allergens + Kanala dictionary + Elhuyar)
app.post('/api/gemini/analyze-dish', async (req: Request, res: Response) => {
    try {
        const { dishName, dishDescription, restaurantName, officialWebsite } = req.body || {};
        if (typeof dishName !== 'string' || !dishName.trim() || dishName.length > 500) {
            res.status(400).json({ error: 'Nombre del plato inválido.' });
            return;
        }
        const cleanDishName = dishName.trim();
        const cleanDescription = typeof dishDescription === 'string' ? dishDescription.trim().slice(0, 2000) : '';
        const safeRestaurantName = typeof restaurantName === 'string' && restaurantName.trim() ? restaurantName.trim().slice(0, 120) : 'Restaurante';
        const baseUrl = sanitizePublicHttpUrl(officialWebsite);

        const allergenList = [
            'GLUTEN', 'CRUSTACEOS', 'HUEVOS', 'PESCADO', 'CACAHUETES', 'SOJA', 'LACTEOS',
            'FRUTOS_CASCARA', 'APIO', 'MOSTAZA', 'SESAMO', 'SULFITOS', 'ALTRAMUCES', 'MOLUSCOS',
            'CALAMARES', 'MARISCO',
        ];

        let websiteSearchRule = '';
        let kanalaExactMatch: any = null;
        if (baseUrl) {
            let exactMatchStr = '';
            if (baseUrl.includes('kanalabeach')) {
                const normalizedDishName = cleanDishName.toLowerCase();
                const strippedDishName = normalizedDishName.replace(/\s*\(.*?\)\s*/g, '').trim();
                const match = kanalaDictionary.find(
                    (d: any) =>
                        d.plato_es &&
                        (d.plato_es.toLowerCase() === normalizedDishName || d.plato_es.toLowerCase() === strippedDishName)
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

            websiteSearchRule = `2. CRITICAL - DO NOT INVENT TRANSLATIONS: The active restaurant (${safeRestaurantName}) has an official website at ${baseUrl}. ${
                exactMatchStr
                    ? exactMatchStr
                    : `You MUST use Google Search to inspect the official website (${baseUrl}) and identify whether this dish or equivalent appears on their multilingual pages.
        - For Basque (EU), check: ${baseUrl}/eu/ or Basque menu sections
        - For English (EN), check: ${baseUrl}/en/ or English menu sections
        - For French (FR), check: ${baseUrl}/fr/ or French menu sections
        If found on the official website, you MUST return EXACTLY what is written there without changing a single letter. Only generate a translation if the dish is absent from the official website.`
            }`;
        } else {
            websiteSearchRule = `2. (No official website configured for restaurant "${safeRestaurantName}", generate standard authentic culinary translations).`;
        }

        const dishContext = cleanDescription
            ? `Dish Name: "${cleanDishName}". Description / Ingredients: "${cleanDescription}"`
            : `Dish Name: "${cleanDishName}"`;

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

        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: dishContext,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: 'application/json',
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
                                IT: { type: Type.STRING },
                            },
                            required: ["EU", "EN", "FR", "DE", "IT"],
                        },
                        allergens: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                    },
                    required: ["translations", "allergens"],
                },
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        if (!text) throw new Error('No response from AI');

        const result = JSON.parse(text);
        const translationsResult: Record<string, string> = { ...(result.translations || {}) };

        if (kanalaExactMatch) {
            if (kanalaExactMatch.plato_eu) translationsResult.EU = kanalaExactMatch.plato_eu;
            if (kanalaExactMatch.plato_en) translationsResult.EN = kanalaExactMatch.plato_en;
            if (kanalaExactMatch.plato_fr) translationsResult.FR = kanalaExactMatch.plato_fr;
        }

        for (const code of ['EU', 'EN', 'FR', 'DE', 'IT']) {
            if (!translationsResult[code] || !String(translationsResult[code]).trim()) {
                const fallback = await translateTextServer(cleanDishName, code, ALLOWED_LANGS[code], baseUrl);
                if (fallback.text) translationsResult[code] = fallback.text;
            }
        }

        res.json({
            ok: true,
            translations: translationsResult,
            allergens: Array.isArray(result.allergens) ? result.allergens : [],
            sources: extractSources(response),
        });
    } catch (error: any) {
        console.error('Server analyze-dish error:', error);
        const status = Number(error?.status) >= 400 && Number(error?.status) < 600 ? Number(error.status) : 500;
        res.status(status).json({ ok: false, error: error?.message || 'Error analizando el plato con IA.' });
    }
});

// 3. Generate restaurant app from multiple uploaded files + instructions
app.post('/api/gemini/generate-app', async (req: Request, res: Response) => {
    try {
        const { prompt, files, restaurantName } = req.body || {};
        const cleanPrompt = typeof prompt === 'string' ? prompt.slice(0, 12000) : '';
        const cleanName = typeof restaurantName === 'string' ? restaurantName.trim().slice(0, 120) : 'Nuevo local';
        const incomingFiles = Array.isArray(files) ? files.slice(0, 20) : [];

        const roleLabels: Record<string, string> = {
            menu: 'Carta / Menú / Precios',
            logo: 'Logotipo oficial del local',
            palette: 'Tabla de colores / Guía de estilo visual',
            other: 'Documento o referencia adicional',
        };

        const validFiles = incomingFiles.filter(
            (f: any) =>
                f &&
                typeof f.name === 'string' &&
                typeof f.mimeType === 'string' &&
                typeof f.data === 'string' &&
                (ALLOWED_FILE_MIMES.has(f.mimeType.toLowerCase()) || f.mimeType.startsWith('text/'))
        );

        const hasPaletteOrVisual =
            validFiles.some((f: any) => f.role === 'palette' || f.role === 'logo' || f.mimeType.startsWith('image/')) ||
            /color|paleta|oscuro|dark|fondo|estilo|formato|copia|hex|#/i.test(cleanPrompt);

        const systemPrompt = `
        You are an expert hospitality app generator, certified EU food safety inspector, and multilingual gastronomic translator.
        You will receive one or MULTIPLE files (menu photos, PDFs, text/CSV lists, logos, color palettes, style references) plus the user's instructions for "${cleanName}".

        CRITICAL EXTRACTION & COMPLETENESS RULES:
        1. Analyze EVERY SINGLE uploaded file thoroughly (even if photos are rotated sideways or upside-down!). Extract ALL dishes, pizzas, bocadillos/bokatas, burritos, salads, tapas, pintxos, raciones, desserts, and prices visible across ALL menu files without skipping pages or items.
        2. Preserve the restaurant's EXACT printed sections in "Tipo" (uppercase short section names like "EUSKAL PIZZA", "ESPECIALES DE LA CASA", "BOKATAS", "SUPER BURRITOS", "ENSALADAS", "RACIONES PATATAS", or standard ones like "ENTRANTE", "ENSALADA", "PESCADO", "CARNE", "POSTRE"). Also return:
           - "sectionOrder": ordered array of the exact section keys matching "Tipo"
           - "sectionTranslations": object mapping each section key to { "ES": "...", "EU": "...", "EN": "...", "FR": "...", "DE": "...", "IT": "..." }
           - "sectionNotes": optional object mapping any section key with special menu notes (e.g., sauces list, supplement prices, dough description) to { "ES": "...", "EU": "...", "EN": "...", "FR": "...", "DE": "...", "IT": "..." }
        3. For EVERY dish, generate COMPLETE, idiomatic translations in ALL FIVE languages (NEVER leave any language empty or with untranslated Spanish words except proper nouns/brands/place names):
           - ES_Nombre: Exact Spanish dish name (keep item codes like P1, K1, B1, E1 if printed on the menu)
           - EU_Nombre: If Basque (Euskera) is already printed on the menu photo, COPY IT EXACTLY without altering it. Otherwise translate into authentic Basque following Elhuyar standards.
           - EN_Nombre: Natural restaurant English
           - FR_Nombre: Natural restaurant French
           - DE_Nombre: Natural restaurant German
           - IT_Nombre: Natural restaurant Italian
        4. For EVERY dish, detect ALL applicable EU mandatory allergens (Regulation EU 1169/2011) strictly from:
           GLUTEN, CRUSTACEOS, HUEVOS, PESCADO, CACAHUETES, SOJA, LACTEOS, FRUTOS_CASCARA, APIO, MOSTAZA, SESAMO, SULFITOS, ALTRAMUCES, MOLUSCOS.
        5. Categorize each dish accurately:
           - Categoria: "CARTA" (or "MENU" ONLY if the menu explicitly has a Menú del Día, or "CARTA,MENU" if both)
           - Tipo: exact uppercase section name matching an entry in "sectionOrder"
           - Es_Racion: true if it is a ración / tapa / pintxo / patatas / compartir, otherwise false
           - Rol_Menu: "PRIMERO", "SEGUNDO", "POSTRE", "RACION", or null (use null for standard Carta items)
           - Precio: numeric price (e.g. 16 or 6.5), OR string if dual price is printed (e.g. "6,50€ / 9€"), or 0 if not shown
           - Descripcion: brief Spanish description if helpful (optional)
        6. ${
            hasPaletteOrVisual
                ? `COLOR PALETTE & VISUAL IDENTITY EXTRACTION: Inspect the uploaded menu photos, logo, or palette carefully. Extract the exact visual palette (e.g., chalkboard dark slate background "#1A1A1C", dark card surface "#232326", crisp white text "#F8FAFC", warm gold/amber or brand accent "#F4B859", "isDark": true for dark menus; or clean light palette with "isDark": false for light menus) in "customColors": { "background": "#...", "surface": "#...", "text": "#...", "accent": "#...", "isDark": true/false }. Ensure strong WCAG readability between "text" and "surface"/"background".`
                : `If the user did not request custom colors or upload visual images, omit "customColors" or set it to null.`
        }
        7. If delivery/contact information (phone numbers, address, delivery zones) appears on the menu, extract it into "deliveryInfo": { "title": "...", "titleEU": "...", "phones": ["..."], "address": "...", "zones": "..." }. Otherwise set "deliveryInfo": null.

        OUTPUT VALID JSON ONLY (no markdown fences, no commentary) matching:
        {
          "slogan": "Short authentic tagline in Spanish",
          "customColors": { "background": "#...", "surface": "#...", "text": "#...", "accent": "#...", "isDark": false } | null,
          "sectionOrder": ["SECTION_1", "SECTION_2"],
          "sectionTranslations": { "SECTION_1": { "ES": "...", "EU": "...", "EN": "...", "FR": "...", "DE": "...", "IT": "..." } },
          "sectionNotes": {},
          "deliveryInfo": null,
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
              "Tipo": "SECTION_1",
              "Activo_Dia": true,
              "Rol_Menu": null,
              "Es_Racion": false,
              "Alergenos": ["GLUTEN"]
            }
          ]
        }
    `;

        const parts: any[] = [];
        for (const file of validFiles) {
            const safeFileName = String(file.name).slice(0, 150);
            const label = `[Archivo adjunto: "${safeFileName}" — Tipo: ${roleLabels[file.role] || 'Referencia'}]`;
            parts.push({ text: label });
            const isBinary = file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf';
            if (isBinary) {
                parts.push({ inlineData: { mimeType: file.mimeType, data: file.data } });
            } else {
                parts.push({ text: String(file.data).slice(0, 100000) });
            }
        }

        parts.push({
            text: `Restaurante/Bar: ${cleanName}\nInstrucciones del usuario: ${cleanPrompt || 'Extrae toda la carta completa sin omitir ningún plato, respeta las secciones reales, traduce a los 5 idiomas, detecta todos los alérgenos y adapta la estética y colores según los archivos adjuntos.'}`,
        });

        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: { parts },
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: 'application/json',
            },
        });

        const rawText = (response.text || '').trim();
        const cleanedJson = rawText
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();

        let result: any = {};
        try {
            result = JSON.parse(cleanedJson || '{}');
        } catch (parseErr) {
            console.error('Failed to parse generate-app JSON:', rawText.slice(0, 500));
            throw new Error('La IA devolvió un formato incompleto al analizar los archivos. Intenta de nuevo o sube menos fotos a la vez.');
        }

        const validHex = (v: any) => typeof v === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(v.trim());
        let customColors: any = undefined;
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
                isDark: Boolean(result.customColors.isDark),
            };
        }

        const parsePrice = (raw: any): number | string => {
            if (typeof raw === 'number' && !isNaN(raw)) return raw;
            if (typeof raw === 'string') {
                const trimmed = raw.trim();
                if (!trimmed) return 0;
                if (trimmed.includes('/')) return trimmed;
                const numeric = parseFloat(trimmed.replace(/€/g, '').replace(',', '.').trim());
                return !isNaN(numeric) ? numeric : trimmed;
            }
            return 0;
        };

        const initialPlatos = (Array.isArray(result.initialPlatos) ? result.initialPlatos : [])
            .map((p: any, idx: number) => ({
                ...p,
                ID_Plato: idx + 1,
                Precio: parsePrice(p.Precio),
                ES_Nombre: String(p.ES_Nombre || '').trim(),
                EU_Nombre: String(p.EU_Nombre || p.ES_Nombre || '').trim(),
                EN_Nombre: String(p.EN_Nombre || p.ES_Nombre || '').trim(),
                FR_Nombre: String(p.FR_Nombre || p.ES_Nombre || '').trim(),
                DE_Nombre: String(p.DE_Nombre || p.ES_Nombre || '').trim(),
                IT_Nombre: String(p.IT_Nombre || p.ES_Nombre || '').trim(),
                Categoria: String(p.Categoria || 'CARTA').toUpperCase(),
                Tipo: String(p.Tipo || 'ENTRANTE').trim().toUpperCase(),
                Activo_Dia: p.Activo_Dia !== false,
                Rol_Menu: p.Rol_Menu || null,
                Es_Racion: Boolean(p.Es_Racion),
                Alergenos: Array.isArray(p.Alergenos) ? p.Alergenos : [],
            }))
            .filter((p: any) => p.ES_Nombre);

        if (initialPlatos.length === 0 && validFiles.some((f: any) => f.role === 'menu')) {
            res.status(422).json({
                error: 'No se pudieron reconocer los platos de las imágenes subidas. Asegúrate de que las fotos sean legibles e inténtalo de nuevo.',
            });
            return;
        }

        const derivedOrder: string[] = [];
        const rawOrder = Array.isArray(result.sectionOrder) ? result.sectionOrder : [];
        rawOrder.forEach((s: any) => {
            const clean = String(s || '').trim().toUpperCase();
            if (clean && !derivedOrder.includes(clean)) derivedOrder.push(clean);
        });
        initialPlatos.forEach((p: any) => {
            if (p.Tipo && !derivedOrder.includes(p.Tipo)) derivedOrder.push(p.Tipo);
        });

        res.json({
            slogan: result.slogan || 'Cocina de Calidad',
            customColors,
            sectionOrder: derivedOrder.length > 0 ? derivedOrder : undefined,
            sectionTranslations: result.sectionTranslations && typeof result.sectionTranslations === 'object' ? result.sectionTranslations : undefined,
            sectionNotes: result.sectionNotes && typeof result.sectionNotes === 'object' ? result.sectionNotes : undefined,
            deliveryInfo: result.deliveryInfo && typeof result.deliveryInfo === 'object' ? result.deliveryInfo : undefined,
            initialPlatos,
        });
    } catch (error: any) {
        console.error('Server generate-app error:', error);
        const status = Number(error?.status) >= 400 && Number(error?.status) < 600 ? Number(error.status) : 500;
        res.status(status).json({ error: error?.message || 'Error generando el restaurante con IA.' });
    }
});

async function startServer() {
    const port = Number(process.env.PORT) || 3000;

    if (process.env.NODE_ENV !== 'production') {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        const distDir = path.resolve(__dirname, 'dist');
        app.use(express.static(distDir));
        app.use((_req: Request, res: Response) => {
            res.sendFile(path.join(distDir, 'index.html'));
        });
    }

    app.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on http://0.0.0.0:${port}`);
    });
}

startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
