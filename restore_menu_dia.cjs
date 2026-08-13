const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const firebaseConfig = require('./firebase-applet-config.json');

const app = initializeApp({
  projectId: firebaseConfig.projectId,
});
const db = getFirestore(app, "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d");

const APP_ID = 'bolina_viejo_v1';
const { bolinaConfig } = require('./dist/config/restaurant.cjs'); // wait, can I require ts? No. I'll just copy the array or read it from config.

