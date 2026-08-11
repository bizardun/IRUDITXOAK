const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, getDoc } = require("firebase/firestore");

const firebaseConfig = {
  projectId: "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'restaurants'));
  const apps = querySnapshot.docs.map(d => d.id);
  console.log("APPS IN DB:", apps);
  
  if (apps.length > 0) {
      for (const appId of apps) {
          const pSnap = await getDocs(collection(db, `restaurants/${appId}/platos`));
          console.log(`- ${appId} has ${pSnap.docs.length} platos`);
      }
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
