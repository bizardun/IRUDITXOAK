const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDocs, collection, updateDoc } = require("firebase/firestore");
const { GoogleGenAI } = require("@google/genai");

const firebaseConfig = {
  apiKey: "AIzaSyCvxipZmbXASjjZ-NvdrfUYKaZHcjwiUOk",
  authDomain: "gen-lang-client-0960122101.firebaseapp.com",
  projectId: "gen-lang-client-0960122101",
  storageBucket: "gen-lang-client-0960122101.firebasestorage.app",
  messagingSenderId: "774356504936",
  appId: "1:774356504936:web:34416f05126a7f917786dd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d");

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

async function translateText(text, targetLang) {
    if (!text || text.trim() === '') return '';
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: `Translate "${text}" from Spanish to ${targetLang}. Respond ONLY with the translated text. Do not add any extra words, quotes or punctuation. Keep it culinary accurate.`,
        });
        return response.text.trim();
    } catch(e) {
        console.error("Translation error for", text, e);
        return text;
    }
}

async function run() {
    console.log("Starting translations for Kanala Beach...");
    const platosRef = collection(db, "restaurants/kanala-beach/platos");
    const snapshot = await getDocs(platosRef);
    
    let count = 0;
    const total = snapshot.docs.length;
    
    for (const d of snapshot.docs) {
        count++;
        const p = d.data();
        
        // We only translate if it's missing (e.g. EU_Nombre is empty)
        if (!p.EU_Nombre || p.EU_Nombre === "") {
            console.log(`Translating [${count}/${total}]: ${p.ES_Nombre}`);
            
            const updates = {};
            
            // Name translations
            updates.EU_Nombre = await translateText(p.ES_Nombre, 'Basque');
            updates.EN_Nombre = await translateText(p.ES_Nombre, 'English');
            updates.FR_Nombre = await translateText(p.ES_Nombre, 'French');
            updates.DE_Nombre = await translateText(p.ES_Nombre, 'German');
            updates.IT_Nombre = await translateText(p.ES_Nombre, 'Italian');
            
            // Description translations (if any)
            if (p.Descripcion) {
                updates.EU_Descripcion = await translateText(p.Descripcion, 'Basque');
                updates.EN_Descripcion = await translateText(p.Descripcion, 'English');
                updates.FR_Descripcion = await translateText(p.Descripcion, 'French');
                updates.DE_Descripcion = await translateText(p.Descripcion, 'German');
                updates.IT_Descripcion = await translateText(p.Descripcion, 'Italian');
            }
            
            await updateDoc(d.ref, updates);
            console.log(`Updated ${p.ES_Nombre} successfully.`);
            
            // Wait slightly to avoid API rate limits
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    
    console.log("All translations completed!");
    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
