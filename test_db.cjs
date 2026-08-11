const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  projectId: "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'restaurants'));
  const apps = querySnapshot.docs.map(doc => doc.data());
  console.log(JSON.stringify(apps, null, 2));
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
