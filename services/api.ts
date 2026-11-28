
import type { Plato, RestaurantConfig, Alergeno, UploadedAppFile, CustomThemeColors, DeliveryInfo } from '../types';
import { getActiveConfig, bolinaConfig } from '../config/restaurant';
import { db, OperationType, handleFirestoreError } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch, onSnapshot } from 'firebase/firestore';

const reportPermissionErrorIfNeeded = (error: unknown, op: OperationType, path: string) => {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
        handleFirestoreError(error, op, path);
    }
};

export const translateText = async (text: string, targetLang: string, targetLangName: string): Promise<{text: string, sources: any[]}> => {
    if (!text || !text.trim()) return { text, sources: [] };
    const currentConfig = getActiveConfig();

    try {
        const response = await fetch('/api/gemini/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                targetLang,
                targetLangName,
                officialWebsite: currentConfig.officialWebsite || ''
            })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status} traduciendo`);
        }
        return {
            text: data.text || text,
            sources: Array.isArray(data.sources) ? data.sources : []
        };
    } catch (error) {
        console.error("Translation error:", error);
        return { text, sources: [] };
    }
};

export const analyzeDish = async (dishName: string, dishDescription?: string): Promise<{ ok: boolean, translations: Record<string, string>, allergens: Alergeno[], sources: any[] }> => {
    if (!dishName || !dishName.trim()) return { ok: false, translations: {}, allergens: [], sources: [] };
    const currentConfig = getActiveConfig();

    try {
        const response = await fetch('/api/gemini/analyze-dish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dishName,
                dishDescription: dishDescription || '',
                restaurantName: currentConfig.name || '',
                officialWebsite: currentConfig.officialWebsite || ''
            })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status} analizando plato`);
        }
        return {
            ok: Boolean(data.ok),
            translations: data.translations || {},
            allergens: Array.isArray(data.allergens) ? data.allergens : [],
            sources: Array.isArray(data.sources) ? data.sources : []
        };
    } catch (error) {
        console.error("Error analyzing dish:", error);
        return { ok: false, translations: {}, allergens: [], sources: [] };
    }
};

export const generateAppConfig = async (
    prompt: string,
    files: UploadedAppFile[] = [],
    restaurantName?: string
): Promise<{
    slogan: string;
    initialPlatos: Plato[];
    customColors?: CustomThemeColors;
    sectionOrder?: string[];
    sectionTranslations?: Record<string, Record<string, string>>;
    sectionNotes?: Record<string, Record<string, string>>;
    deliveryInfo?: DeliveryInfo;
}> => {
    const payloadFiles = files.map(({ name, mimeType, data, role }) => ({
        name,
        mimeType,
        data,
        role
    }));

    const response = await fetch('/api/gemini/generate-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt,
            files: payloadFiles,
            restaurantName: restaurantName || ''
        })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || `Error ${response.status} generando la app con IA`);
    }

    return {
        slogan: data.slogan || 'Cocina de Calidad',
        customColors: data.customColors,
        initialPlatos: Array.isArray(data.initialPlatos) ? data.initialPlatos : [],
        sectionOrder: Array.isArray(data.sectionOrder) ? data.sectionOrder : undefined,
        sectionTranslations: data.sectionTranslations || undefined,
        sectionNotes: data.sectionNotes || undefined,
        deliveryInfo: data.deliveryInfo || undefined
    };
};


let _apiAppId = "";
export const setApiAppId = (id: string) => { _apiAppId = id; };
const getPlatosPath = () => `restaurants/${_apiAppId || getActiveConfig().id}/platos`;
const getConfigPath = () => `restaurants/${_apiAppId || getActiveConfig().id}`;

const getApps = async (): Promise<RestaurantConfig[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'restaurants'));
        const apps = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data } as RestaurantConfig;
        }).filter(app => app.name); // Only return apps that have a name (not just menuPrice stubs)
        return apps;
    } catch (e) {
        reportPermissionErrorIfNeeded(e, OperationType.LIST, 'restaurants');
        console.error("Error fetching apps from Firebase:", e);
        return [];
    }
};

const saveApp = async (app: RestaurantConfig, isNewApp: boolean = false) => {
    try {
        await setDoc(doc(db, 'restaurants', app.id), app, { merge: true });
        // Also save initial platos only if it's a new app to prevent overwriting existing edited plates
        if (isNewApp && app.initialPlatos && Array.isArray(app.initialPlatos)) {
            const batch = writeBatch(db);
            app.initialPlatos.forEach(p => {
                const docRef = doc(collection(db, `restaurants/${app.id}/platos`), p.ID_Plato.toString());
                batch.set(docRef, p);
            });
            await batch.commit();
        }
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
            const config = getActiveConfig();
            const defaultFallback = config.id === bolinaConfig.id ? bolinaConfig.initialPlatos : [];
            let initialData = config.initialPlatos && config.initialPlatos.length > 0 ? config.initialPlatos : defaultFallback;
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
            platos = initialData || [];
            
            if (platos.length > 0) {
                console.log('Seeding initial platos...');
                const batch = writeBatch(db);
                platos.forEach(p => {
                    const docRef = doc(collection(db, getPlatosPath()), p.ID_Plato.toString());
                    batch.set(docRef, p);
                });
                await batch.commit();
            }
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
            const stored = window.localStorage.getItem(`${getActiveConfig().id}_price`);
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

const subscribeToPlatos = (callback: (platos: Plato[]) => void) => {
    const path = getPlatosPath();
    return onSnapshot(collection(db, path), (querySnapshot) => {
        const platos = querySnapshot.docs.map(doc => doc.data() as Plato);
        
        if (platos.length > 0) {
            platos.sort((a, b) => a.ID_Plato - b.ID_Plato);
            callback(platos);
        } else {
            // If cache is empty or server is empty, show initial data immediately (never clone Boliña for other apps)
            const activeCfg = getActiveConfig();
            const fallbackPlatos = activeCfg.id === bolinaConfig.id ? bolinaConfig.initialPlatos : [];
            const initialPlatos = activeCfg.initialPlatos && activeCfg.initialPlatos.length > 0 ? activeCfg.initialPlatos : fallbackPlatos;
            callback(initialPlatos);
            
            // Only seed if we confirmed with the server that it's actually empty and there is real initial data
            if (!querySnapshot.metadata.fromCache && initialPlatos.length > 0) {
                getPlatos().catch(e => console.error("Error seeding platos:", e));
            }
        }
    }, (error) => {
        console.error("Error in platos subscription:", error);
        const activeCfg = getActiveConfig();
        const fallbackPlatos = activeCfg.id === bolinaConfig.id ? bolinaConfig.initialPlatos : [];
        callback(activeCfg.initialPlatos && activeCfg.initialPlatos.length > 0 ? activeCfg.initialPlatos : fallbackPlatos);
        reportPermissionErrorIfNeeded(error, OperationType.LIST, path);
    });
};

const subscribeToMenuPrice = (callback: (price: number) => void) => {
    const path = getConfigPath();
    return onSnapshot(doc(db, path), (docSnap) => {
        if (docSnap.exists() && docSnap.data().menuPrice !== undefined) {
            callback(parseFloat(docSnap.data().menuPrice));
        } else {
            callback(16.50); // Fallback until seeded
            if (!docSnap.metadata.fromCache) {
                getMenuPrice().catch(e => console.error("Error seeding price:", e));
            }
        }
    }, (error) => {
        console.error("Error in menu price subscription:", error);
        callback(16.50);
        reportPermissionErrorIfNeeded(error, OperationType.GET, path);
    });
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
    setApiAppId,
    getApps,
    saveApp,
    deleteAppFromDb,

    getPlatos,
    getMenuPrice,
    subscribeToPlatos,
    subscribeToMenuPrice,
    updatePlato,
    updatePlatosOrder,
    addPlato,
    deletePlato,
    setMenuPrice,
    translateText,
    analyzeDish,
    generateAppConfig, 
    login: async (u: string, p: string, explicitAppId?: string) => {
        const appId = explicitAppId || _apiAppId || getActiveConfig().id;
        try {
            const snap = await getDoc(doc(db, 'restaurants', appId));
            if (snap.exists()) {
                const appData = snap.data();
                const expectedPass = String(appData.adminPassword || '1234').trim();
                if (u === 'admin' && p.trim() === expectedPass) return true;
            } else {
                if (u === 'admin' && p.trim() === '1234') return true;
            }
        } catch(e) {
            console.error('Login error:', e);
        }
        throw new Error('Contraseña incorrecta');
    }
};

