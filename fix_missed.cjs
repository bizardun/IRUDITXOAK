const { initializeApp } = require("firebase/app");
const { getFirestore, getDocs, collection, updateDoc } = require("firebase/firestore");
const fs = require('fs');

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
const RESTAURANT_ID = 'kanala-beach';

async function main() {
  const dictionary = JSON.parse(fs.readFileSync('./src/data/kanala_dictionary.json', 'utf8'));
  const platosRef = collection(db, `restaurants/${RESTAURANT_ID}/platos`);
  const snapshot = await getDocs(platosRef);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const platoEs = data.ES_Nombre || "";
    
    // Normalize string by removing content in parentheses
    const strippedName = platoEs.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
    
    const match = dictionary.find(d => 
        (d.plato_es && d.plato_es.toLowerCase() === strippedName)
    );

    if (match) {
        let updates = {};
        let needsUpdate = false;
        
        const updateField = (field, newVal) => {
            if (newVal && data[field] !== newVal) {
                updates[field] = newVal;
                needsUpdate = true;
            }
        };

        if (match.plato_eu) updateField('EU_Nombre', match.plato_eu);
        if (match.plato_en) updateField('EN_Nombre', match.plato_en);
        if (match.plato_fr) updateField('FR_Nombre', match.plato_fr);

        const translations = data.translations || {};
        const updateTrans = (lang, newTitle, newDesc) => {
            if (!translations[lang]) translations[lang] = {};
            if (newTitle && translations[lang].nombre !== newTitle) {
                translations[lang].nombre = newTitle;
                needsUpdate = true;
            }
            if (newDesc && translations[lang].descripcion !== newDesc) {
                translations[lang].descripcion = newDesc;
                needsUpdate = true;
            }
        };

        if (match.plato_eu) updateTrans('EU', match.plato_eu, match.desc_eu);
        if (match.plato_en) updateTrans('EN', match.plato_en, match.desc_en);
        if (match.plato_fr) updateTrans('FR', match.plato_fr, match.desc_fr);
        
        if (needsUpdate) {
            updates.translations = translations;
            await updateDoc(docSnap.ref, updates);
            console.log(`Updated translations for: ${platoEs} (Matched as ${strippedName})`);
        }
    }
  }

  console.log(`Done.`);
  process.exit(0);
}

main().catch(console.error);
