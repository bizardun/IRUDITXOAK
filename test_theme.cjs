const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

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

async function run() {
  const d = await getDoc(doc(db, 'restaurants/kanala-beach'));
  console.log(d.data().theme);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
