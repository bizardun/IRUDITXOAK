const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

const regex = /const PLATOS_COLLECTION = 'platos';.*?export default \{/s;

const newLogic = `const getPlatosPath = () => \`restaurants/\${getActiveConfig().id}/platos\`;
const getConfigPath = () => \`restaurants/\${getActiveConfig().id}\`;

const getApps = async (): Promise<RestaurantConfig[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        const apps = querySnapshot.docs.map(doc => doc.data() as RestaurantConfig);
        return apps;
    } catch (e) {
        console.error("Error fetching apps from Firebase:", e);
        return [];
    }
};

const saveApp = async (app: RestaurantConfig) => {
    try {
        await setDoc(doc(db, 'restaurants', app.id), app);
        // Also save initial platos
        const batch = writeBatch(db);
        app.initialPlatos.forEach(p => {
            const docRef = doc(collection(db, \`restaurants/\${app.id}/platos\`), p.ID_Plato.toString());
            batch.set(docRef, p);
        });
        await batch.commit();
    } catch (e) {
        console.error("Error saving app:", e);
    }
};

const deleteAppFromDb = async (id: string) => {
    try {
        // In a real app we'd delete subcollections first. For this scale, it's fine.
        await deleteDoc(doc(db, 'restaurants', id));
    } catch (e) {
        console.error("Error deleting app:", e);
    }
};

const getPlatos = async (): Promise<Plato[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, getPlatosPath()));
        let platos = querySnapshot.docs.map(doc => doc.data() as Plato);
        
        if (platos.length === 0) {
            console.log('Seeding initial platos...');
            const config = getActiveConfig();
            let initialData = config.initialPlatos;
            if (typeof window !== 'undefined' && window.localStorage) {
                try {
                    const stored = window.localStorage.getItem(config.id);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            initialData = parsed;
                            console.log('Migrated data from LocalStorage to Firebase');
                        }
                    }
                } catch(e) {}
            }
            platos = initialData;
            
            const batch = writeBatch(db);
            platos.forEach(p => {
                const docRef = doc(collection(db, getPlatosPath()), p.ID_Plato.toString());
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
        const docSnap = await getDoc(doc(db, getConfigPath()));
        if (docSnap.exists() && docSnap.data().menuPrice !== undefined) {
            return parseFloat(docSnap.data().menuPrice);
        }
        // Migration from LocalStorage
        let fallbackPrice = 16.50;
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = window.localStorage.getItem(\`\${getActiveConfig().id}_price\`);
            if (stored) fallbackPrice = parseFloat(stored);
        }
        // Save it to firebase
        await setDoc(doc(db, getConfigPath()), { menuPrice: fallbackPrice }, { merge: true });
        return fallbackPrice;
    } catch (e) {
        console.error("Error fetching menu price:", e);
        return 16.50;
    }
};

const updatePlato = async (id: number, data: Partial<Plato>) => {
    try {
        const docRef = doc(db, getPlatosPath(), id.toString());
        await updateDoc(docRef, data);
    } catch (e) {
        console.error("Error updating plato:", e);
    }
};

const updatePlatosOrder = async (newOrder: Plato[]) => {
    try {
        const batch = writeBatch(db);
        newOrder.forEach((p, index) => {
            const docRef = doc(db, getPlatosPath(), p.ID_Plato.toString());
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
        await setDoc(doc(db, getPlatosPath(), newId.toString()), newPlato);
    } catch (e) {
        console.error("Error adding plato:", e);
    }
};

const deletePlato = async (id: number) => {
    try {
        await deleteDoc(doc(db, getPlatosPath(), id.toString()));
    } catch (e) {
        console.error("Error deleting plato:", e);
    }
};

const setMenuPrice = async (price: number) => {
    try {
        await setDoc(doc(db, getConfigPath()), { menuPrice: price }, { merge: true });
    } catch (e) {
        console.error("Error setting menu price:", e);
    }
};

export default {
    getApps,
    saveApp,
    deleteAppFromDb,
`;

content = content.replace(regex, newLogic);
fs.writeFileSync('services/api.ts', content);
