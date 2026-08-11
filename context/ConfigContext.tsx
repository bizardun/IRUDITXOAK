import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RestaurantConfig, ThemeConfig } from '../types';
import { bolinaConfig, getActiveConfig } from '../config/restaurant';
import api from '../services/api';

interface ConfigContextType {
    config: RestaurantConfig;
    isFactoryMode: boolean;
    showMasterPanelButton: boolean;
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
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const isClientUrl = searchParams.get('client') === 'true';
    const isOwnerUrl = searchParams.get('admin') === 'true';
    const isMasterAdmin = !isClientUrl && !isOwnerUrl;

    const [config, setConfigState] = useState<RestaurantConfig>(() => {
        const init = getActiveConfig();
        api.setApiAppId(init.id);
        return init;
    });
    const [isFactoryMode, setIsFactoryMode] = useState(isMasterAdmin);
    const [showMasterPanelButton, setShowMasterPanelButton] = useState(isMasterAdmin);
    const [availableApps, setAvailableApps] = useState<RestaurantConfig[]>([bolinaConfig]);

    useEffect(() => {
        const loadRegistry = async () => {
            try {
                let fbApps = await api.getApps();
                if (fbApps.length === 0) {
                   fbApps = [bolinaConfig];
                }
                
                const savedApps = localStorage.getItem(APPS_STORAGE_KEY);
                let apps = [...fbApps];
                
                if (savedApps) {
                    const parsed = JSON.parse(savedApps);
                    const others = Array.isArray(parsed) 
                         ? parsed.filter((a: any) => a.id !== bolinaConfig.id && !fbApps.some(fba => fba.id === a.id))
                        : [];
                    for (const a of others) {
                        await api.saveApp(a);
                        apps.push(a);
                    }
                    localStorage.removeItem(APPS_STORAGE_KEY);
                }
                
                if (!apps.some(a => a.id === bolinaConfig.id)) {
                    apps.unshift(bolinaConfig);
                }
                
                setAvailableApps(apps);

                if (!isMasterAdmin) {
                    const appIdParam = searchParams.get('app');
                    const lastAppId = appIdParam || localStorage.getItem(CURRENT_APP_KEY);
                    if (lastAppId) {
                        const app = apps.find(a => a.id === lastAppId);
                        if (app) {
                            api.setApiAppId(app.id); setConfigState(app);
                        }
                    }
                    setIsFactoryMode(false);
                }
            } catch (e) {
                console.error("Error cargando registro de apps:", e);
                setAvailableApps([bolinaConfig]);
            }
        };
        loadRegistry();
    }, [isMasterAdmin]);

    const loadApp = (id: string) => {
        try {
            localStorage.setItem(CURRENT_APP_KEY, id);
            const selectedApp = availableApps.find(a => a.id === id) || bolinaConfig;
            api.setApiAppId(selectedApp.id); setConfigState(selectedApp);
            setIsFactoryMode(false);
        } catch (e) {
            console.error("Error cambiando de app:", e);
            alert("Hubo un error al cambiar de aplicación.");
        }
    };

    const createApp = async (name: string, prompt: string, fileData: string | null, mimeType: string | null, theme: ThemeConfig) => {
        try {
            const timestamp = Date.now();
            const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const newId = `${safeName}_${timestamp}`;

            let newPlatos: any[] = [];
            let newSlogan = '';

            if (prompt || fileData) {
                try {
                   const aiConfig = await api.generateAppConfig(prompt, fileData, mimeType);
                   newPlatos = aiConfig.initialPlatos;
                   newSlogan = aiConfig.slogan;
                } catch (err) {
                   console.error("Fallo IA en generación", err);
                   alert("La IA tuvo problemas generando el menú. Se creará una app vacía.");
                   newPlatos = [];
                }
            }

            const newApp: RestaurantConfig = {
                id: newId,
                name: name,
                slogan: newSlogan,
                theme: theme,
                initialPlatos: newPlatos
            };

            await api.saveApp(newApp);
            
            setAvailableApps(prev => [...prev, newApp]);
            
            localStorage.setItem(CURRENT_APP_KEY, newId);
            setConfigState(newApp);
            setIsFactoryMode(false);
        } catch (e) {
            console.error("Error creando app:", e);
            throw e;
        }
    };

    const deleteApp = useCallback(async (id: string) => {
        if (id === bolinaConfig.id) {
            alert("No se puede eliminar la aplicación Maestra.");
            return;
        }
        try {
            await api.deleteAppFromDb(id);
            
            localStorage.removeItem(id);
            localStorage.removeItem(`${id}_price`);
            
            setAvailableApps(prev => prev.filter(a => a.id !== id));
            
            const currentActiveId = localStorage.getItem(CURRENT_APP_KEY);
            if (currentActiveId === id) {
                localStorage.setItem(CURRENT_APP_KEY, bolinaConfig.id);
                setConfigState(bolinaConfig);
            }
        } catch (e) {
            console.error("Error eliminando app:", e);
            alert("Error al eliminar la aplicación.");
        }
    }, []);

    return (
        <ConfigContext.Provider value={{
            config,
            isFactoryMode,
            showMasterPanelButton,
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
