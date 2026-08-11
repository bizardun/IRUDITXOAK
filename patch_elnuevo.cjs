const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, setDoc } = require("firebase/firestore");

const app = initializeApp({
  apiKey: "AIzaSyCvxipZmbXASjjZ-NvdrfUYKaZHcjwiUOk",
  projectId: "gen-lang-client-0960122101",
});
const db = getFirestore(app, "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d");

async function run() {
  const newApp = {
    id: "el_nuevo_123",
    name: "El Nuevo",
    slogan: "Nueva Experiencia",
    theme: { style: "modern", font: "font-inter" },
    menuPrice: 16.50
  };
  await setDoc(doc(db, 'restaurants', 'el_nuevo_123'), newApp);
  console.log("Created El Nuevo");
  process.exit(0);
}
run();
