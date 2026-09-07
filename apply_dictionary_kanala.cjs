const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDocs, collection, updateDoc } = require("firebase/firestore");
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
  console.log("Loaded dictionary with " + dictionary.length + " entries.");
  
  const platosRef = collection(db, `restaurants/${RESTAURANT_ID}/platos`);
  const snapshot = await getDocs(platosRef);
  console.log(`Found ${snapshot.size} platos in Firestore for Kanala.`);

  let updatedCount = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const platoEs = data.ES_Nombre || "";
    const descEs = data.Descripcion || "";
    
    // Find matching entry in dictionary
    const normalizedName = platoEs.trim().toLowerCase();
    
    const match = dictionary.find(d => 
        (d.plato_es && d.plato_es.toLowerCase() === normalizedName) || 
        (d.desc_es && descEs && d.desc_es.toLowerCase() === descEs.trim().toLowerCase())
    );

    if (match) {
        let updates = {};
        let needsUpdate = false;
        
        // Helper to check if we should update a top-level field
        const updateField = (field, newVal) => {
            if (newVal && data[field] !== newVal) {
                updates[field] = newVal;
                needsUpdate = true;
            }
        };

        if (match.plato_eu) updateField('EU_Nombre', match.plato_eu);
        if (match.plato_en) updateField('EN_Nombre', match.plato_en);
        if (match.plato_fr) updateField('FR_Nombre', match.plato_fr);

        // Update the translations object as well just in case they are used in some other contexts
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
            updatedCount++;
            console.log(`Updated translations for: ${platoEs}`);
        }
    } else {
        console.log(`No exact match in dictionary for: ${platoEs}`);
    }
  }

  console.log(`Finished updating ${updatedCount} platos.`);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
