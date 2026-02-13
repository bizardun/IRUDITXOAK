
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RestaurantConfig, ThemeConfig } from '../types';
import { bolinaConfig, getActiveConfig } from '../config/restaurant';
import api from '../services/api';

interface ConfigContextType {
    config: RestaurantConfig;
    isFactoryMode: boolean;
    availableApps: RestaurantConfig[];
    loadApp: (id: string) => void;
    createApp: (name: string, prompt: string, fileData: string | null, mimeType: string | null, theme: ThemeConfig) => Promise<void>;
    deleteApp: (id: string) => void;
    enterFactory: () => void;
    exitFactory: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const APPS_STORAGE_KEY = 'global_apps_registry';
const CURRENT_APP_KEY = 'current_active_app_id';

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Estado inicial seguro usando la configuración activa real
    const [config, setConfigState] = useState<RestaurantConfig>(getActiveConfig());
    
    // CAMBIO: Inicializamos en true para que el Dashboard sea la primera pantalla
    const [isFactoryMode, setIsFactoryMode] = useState(true);
    
    const [availableApps, setAvailableApps] = useState<RestaurantConfig[]>([bolinaConfig]);

    // Al montar, sincronizamos la lista de apps disponibles para el dashboard
    useEffect(() => {
        const loadRegistry = () => {
            try {
                const savedApps = localStorage.getItem(APPS_STORAGE_KEY);
                let apps = [bolinaConfig];
                
                if (savedApps) {
                    const parsed = JSON.parse(savedApps);
                    // Filtramos para evitar duplicados del master y aseguramos que el master siempre sea la versión de código (bolinaConfig)
                    const others = Array.isArray(parsed) 
                        ? parsed.filter((a: any) => a.id !== bolinaConfig.id)
                        : [];
                    apps = [bolinaConfig, ...others];
                }
                setAvailableApps(apps);
            } catch (e) {
                console.error("Error cargando registro de apps:", e);
                setAvailableApps([bolinaConfig]);
            }
        };
        loadRegistry();
    }, []);

    const loadApp = (id: string) => {
        try {
            // Persistir selección
            localStorage.setItem(CURRENT_APP_KEY, id);
            
            // Actualizar estado del contexto
            const selectedApp = availableApps.find(a => a.id === id) || bolinaConfig;
            setConfigState(selectedApp);
            
            // Salir del modo fábrica para mostrar la app
            setIsFactoryMode(false);
        } catch (e) {
            console.error("Error cambiando de app:", e);
            alert("Hubo un error al cambiar de aplicación.");
        }
    };

    const createApp = async (name: string, prompt: string, fileData: string | null, mimeType: string | null, theme: ThemeConfig) => {
        try {
            // 1. Generar ID único seguro
            const timestamp = Date.now();
            const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const newId = `${safeName}_${timestamp}`;

            // 2. Generar datos usando IA si hay prompt o archivo
            let newPlatos: any[] = [];
            let newSlogan = '';

            if (prompt || fileData) {
                try {
                   // Llamada libre a la IA, sin forzar lista maestra
                   const aiConfig = await api.generateAppConfig(prompt, fileData, mimeType);
                   newPlatos = aiConfig.initialPlatos;
                   newSlogan = aiConfig.slogan;
                } catch (err) {
                   console.error("Fallo IA en generación", err);
                   alert("La IA tuvo problemas generando el menú. Se creará una app vacía.");
                   newPlatos = [];
                }
            } else {
                newPlatos = [];
            }

            // 3. Crear nueva configuración
            const newApp: RestaurantConfig = {
                id: newId,
                name: name,
                slogan: newSlogan,
                theme: theme,
                initialPlatos: newPlatos
            };

            // 4. Actualizar lista de apps disponibles
            setAvailableApps(prev => {
                const updated = [...prev, newApp];
                // Guardar registro
                const registryToSave = updated.filter(a => a.id !== bolinaConfig.id);
                localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(registryToSave));
                return updated;
            });
            
            // 5. Establecer como activa y cargar
            localStorage.setItem(CURRENT_APP_KEY, newId);
            setConfigState(newApp);
            setIsFactoryMode(false);

        } catch (e) {
            console.error("Error creando app:", e);
            throw e; // Lanzar para que el UI lo maneje
        }
    };

    const deleteApp = useCallback((id: string) => {
        if (id === bolinaConfig.id) {
            alert("No se puede eliminar la aplicación Maestra.");
            return;
        }

        try {
            // 1. Actualización SÍNCRONA del LocalStorage (Fuente de Verdad)
            const savedAppsRaw = localStorage.getItem(APPS_STORAGE_KEY);
            const savedApps: RestaurantConfig[] = savedAppsRaw ? JSON.parse(savedAppsRaw) : [];
            
            // Filtramos la app a borrar
            const newSavedApps = savedApps.filter(a => a.id !== id);
            
            // Guardamos inmediatamente la nueva lista limpia
            localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(newSavedApps));

            // 2. Limpiamos datos específicos de la app
            localStorage.removeItem(id);
            localStorage.removeItem(`${id}_price`);

            // 3. Actualizamos el estado visual de React
            setAvailableApps(prev => prev.filter(a => a.id !== id));

            // 4. Si borramos la app que estaba activa, volvemos a la Master sin recargar página
            const currentActiveId = localStorage.getItem(CURRENT_APP_KEY);
            if (currentActiveId === id) {
                localStorage.setItem(CURRENT_APP_KEY, bolinaConfig.id);
                setConfigState(bolinaConfig);
            }

        } catch (e) {
            console.error("Error eliminando app:", e);
            alert("Error al eliminar la aplicación del almacenamiento.");
        }
    }, []);

    return (
        <ConfigContext.Provider value={{
            config,
            isFactoryMode,
            availableApps,
            loadApp,
            createApp,
            deleteApp,
            enterFactory: () => setIsFactoryMode(true),
            exitFactory: () => setIsFactoryMode(false)
        }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) throw new Error('useConfig must be used within ConfigProvider');
    return context;
};
