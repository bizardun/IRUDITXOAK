import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvxipZmbXASjjZ-NvdrfUYKaZHcjwiUOk",
  authDomain: "gen-lang-client-0960122101.firebaseapp.com",
  projectId: "gen-lang-client-0960122101",
  storageBucket: "gen-lang-client-0960122101.firebasestorage.app",
  messagingSenderId: "774356504936",
  appId: "1:774356504936:web:34416f05126a7f917786dd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d");
