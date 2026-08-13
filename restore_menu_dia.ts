import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import { bolinaConfig } from './config/restaurant';

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

const APP_ID = 'bolina_viejo_v1';

async function restore() {
    console.log("Restoring initial plates to MENU...");
    const batch = writeBatch(db);
    let count = 0;
    
    for (const plato of bolinaConfig.initialPlatos) {
        const docRef = doc(db, `restaurants/${APP_ID}/platos`, plato.ID_Plato.toString());
        // Modify category to MENU
        const newPlato = { ...plato, Categoria: "MENU" };
        batch.set(docRef, newPlato);
        count++;
    }
    
    await batch.commit();
    console.log(`Restored ${count} plates to MENU category.`);
    process.exit(0);
}

restore();
