
import { GoogleGenAI } from "@google/genai";

// This check is to prevent errors in environments where process.env is not defined.
const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY
  ? process.env.API_KEY
  : "";

if (!apiKey) {
    console.warn("API_KEY environment variable not found. Translation service will not work.");
}

const ai = new GoogleGenAI({ apiKey });

export const translateText = async (text: string, targetLang: string, targetLangName: string): Promise<string> => {
    if (!text || !apiKey) return text;
    try {
        const systemPrompt = "You are a professional translator for a high-end restaurant. Translate the following text from 'es' (Spanish) to the requested target language. Respond *only* with the translated text, without any explanation, quotes, or prefix. Maintain the original capitalization of the input text.";
        const userQuery = `Translate "${text}" to ${targetLangName} (code: ${targetLang}).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
            }
        });
        
        const translatedText = response.text;
        
        // Clean up potential markdown or quotes sometimes returned by the model
        return translatedText ? translatedText.trim().replace(/^"(.*)"$/, '$1') : text;
    } catch (error) {
        console.error("Error translating with Gemini:", error);
        return text; // Fallback to original text on error
    }
};
