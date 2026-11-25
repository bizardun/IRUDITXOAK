export const translateText = async (text: string, targetLang: string, targetLangName: string): Promise<string> => {
    if (!text || !text.trim()) return text;
    try {
        const response = await fetch('/api/gemini/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, targetLang, targetLangName }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status}`);
        }
        return data.text ? String(data.text).trim().replace(/^"(.*)"$/, '$1') : text;
    } catch (error) {
        console.error('Error translating via server:', error);
        return text;
    }
};
