const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

const newImports = `import { GoogleGenAI, Type } from "@google/genai";
import type { Plato, RestaurantConfig, Alergeno } from '../types';
import { getActiveConfig } from '../config/restaurant';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
`;

content = content.replace(/import \{ GoogleGenAI.*?'\.\.\/config\/restaurant';/s, newImports);

const newFirebaseLogic = `
const PLATOS_COLLECTION = 'platos';
const CONFIG_DOC = 'config/main';

const getPlatos = async (): Promise<Plato[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, PLATOS_COLLECTION));
        let platos = querySnapshot.docs.map(doc => doc.data() as Plato);
        
        if (platos.length === 0) {
            console.log('Seeding initial platos...');
            const config = getActiveConfig();
            platos = config.initialPlatos;
            const batch = writeBatch(db);
            platos.forEach(p => {
                const docRef = doc(collection(db, PLATOS_COLLECTION), p.ID_Plato.toString());
                batch.set(docRef, p);
            });
            await batch.commit();
        }
        
        // Sort by ID_Plato to keep order
        platos.sort((a, b) => a.ID_Plato - b.ID_Plato);
        return platos;
    } catch (e) {
        console.error("Error fetching platos from Firebase:", e);
        return getActiveConfig().initialPlatos;
    }
};

const getMenuPrice = async (): Promise<number> => {
    try {
        const docSnap = await getDoc(doc(db, CONFIG_DOC));
        if (docSnap.exists() && docSnap.data().menuPrice !== undefined) {
            return parseFloat(docSnap.data().menuPrice);
        }
        // Fallback
        return 16.50;
    } catch (e) {
        console.error("Error fetching menu price:", e);
        return 16.50;
    }
};

const updatePlato = async (id: number, data: Partial<Plato>) => {
    try {
        const docRef = doc(db, PLATOS_COLLECTION, id.toString());
        await updateDoc(docRef, data);
    } catch (e) {
        console.error("Error updating plato:", e);
    }
};

const updatePlatosOrder = async (newOrder: Plato[]) => {
    try {
        const batch = writeBatch(db);
        newOrder.forEach((p, index) => {
            const docRef = doc(db, PLATOS_COLLECTION, p.ID_Plato.toString());
            // Optionally, we could add an order field if we want custom ordering.
            // But since ID_Plato is preserved, we just update all if needed.
            batch.set(docRef, p, { merge: true }); 
        });
        await batch.commit();
    } catch (e) {
        console.error("Error updating order:", e);
    }
};

const addPlato = async (plato: any) => {
    try {
        const currentPlatos = await getPlatos();
        const newId = Math.max(...currentPlatos.map(p => p.ID_Plato), 0) + 1;
        const newPlato = { ...plato, ID_Plato: newId, Activo_Dia: true };
        await setDoc(doc(db, PLATOS_COLLECTION, newId.toString()), newPlato);
    } catch (e) {
        console.error("Error adding plato:", e);
    }
};

const deletePlato = async (id: number) => {
    try {
        await deleteDoc(doc(db, PLATOS_COLLECTION, id.toString()));
    } catch (e) {
        console.error("Error deleting plato:", e);
    }
};

const setMenuPrice = async (price: number) => {
    try {
        await setDoc(doc(db, CONFIG_DOC), { menuPrice: price }, { merge: true });
    } catch (e) {
        console.error("Error setting menu price:", e);
    }
};

export default {
    getPlatos,
    getMenuPrice,
    updatePlato,
    updatePlatosOrder,
    addPlato,
    deletePlato,
    setMenuPrice,
    translateText,
    analyzeDish,
    generateAppConfig, 
    login: async (u: string, p: string) => {
        if (u === 'admin' && p === '1234') return true;
        throw new Error('Credenciales incorrectas');
    }
};
`;

content = content.replace(/const loadData = \(\): Plato\[\] => \{.*?\};\n\nexport default \{.*?^\};/ms, newFirebaseLogic);

fs.writeFileSync('services/api.ts', content);
