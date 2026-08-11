const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCvxipZmbXASjjZ-NvdrfUYKaZHcjwiUOk",
  projectId: "gen-lang-client-0960122101",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d");

async function run() {
  const querySnapshot = await getDocs(collection(db, 'restaurants'));
  const apps = querySnapshot.docs.map(d => d.data());
  console.log("APPS IN DB:", apps.map(a => ({ id: a.id, name: a.name })));
  
  if (apps.length > 0) {
      for (const a of apps) {
          const pSnap = await getDocs(collection(db, `restaurants/${a.id}/platos`));
          console.log(`- ${a.id} (${a.name}) has ${pSnap.docs.length} platos`);
      }
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
