const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const app = initializeApp({
  apiKey: "AIzaSyCvxipZmbXASjjZ-NvdrfUYKaZHcjwiUOk",
  projectId: "gen-lang-client-0960122101",
});
const db = getFirestore(app, "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d");

async function run() {
  const querySnapshot = await getDocs(collection(db, 'restaurants'));
  const apps = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data };
  }).filter(app => app.name); 

  console.log("Apps found:", apps.map(a => a.id));
  
  const targetId = 'el_nuevo_123';
  const found = apps.find(a => a.id === targetId);
  console.log("Found:", found ? "YES" : "NO");
  process.exit(0);
}
run();
