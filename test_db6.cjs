const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const app = initializeApp({
  apiKey: "AIzaSyCvxipZmbXASjjZ-NvdrfUYKaZHcjwiUOk",
  projectId: "gen-lang-client-0960122101",
});
const db = getFirestore(app, "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d");

async function run() {
  const querySnapshot = await getDocs(collection(db, 'restaurants'));
  querySnapshot.docs.forEach(d => console.log("DOC ID:", d.id, "DATA:", d.data().name));
  process.exit(0);
}
run();
