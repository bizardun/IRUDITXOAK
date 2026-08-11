const fs = require('fs');
let content = fs.readFileSync('context/ConfigContext.tsx', 'utf8');

const regexUseEffect = /    \/\/ Al montar, sincronizamos la lista de apps.*    const loadApp = \(id: string\) => \{/s;

const newUseEffect = `    // Al montar, sincronizamos la lista de apps disponibles para el dashboard
    useEffect(() => {
        const loadRegistry = async () => {
            try {
                // First get from firebase
                let fbApps = await api.getApps();
                if (fbApps.length === 0) {
                   fbApps = [bolinaConfig];
                }
                
                // Keep local storage as fallback/migration or purely use firebase
                const savedApps = localStorage.getItem(APPS_STORAGE_KEY);
                let apps = [...fbApps];
                
                if (savedApps) {
                    const parsed = JSON.parse(savedApps);
                    const others = Array.isArray(parsed) 
                         ? parsed.filter((a: any) => a.id !== bolinaConfig.id && !fbApps.some(fba => fba.id === a.id))
                        : [];
                    // Migrate others to firebase
                    for (const a of others) {
                        await api.saveApp(a);
                        apps.push(a);
                    }
                    localStorage.removeItem(APPS_STORAGE_KEY);
                }
                
                // Ensure bolina is there
                if (!apps.some(a => a.id === bolinaConfig.id)) {
                    apps.unshift(bolinaConfig);
                }
                
                setAvailableApps(apps);

                // Si no somos admin master, forzamos cargar la última app usada o la que venga por URL
                if (!isMasterAdmin) {
                    const appIdParam = searchParams.get('app');
                    const lastAppId = appIdParam || localStorage.getItem(CURRENT_APP_KEY);
                    if (lastAppId) {
                        const app = apps.find(a => a.id === lastAppId);
                        if (app) {
                            setConfigState(app);
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

    const loadApp = (id: string) => {`;

content = content.replace(regexUseEffect, newUseEffect);

const regexCreateApp = /\/\/ 4\. Actualizar lista de apps disponibles.*?setConfigState\(newApp\);/s;
const newCreateApp = `// 4. Guardar en Firebase
            await api.saveApp(newApp);
            
            // 5. Actualizar lista de apps disponibles
            setAvailableApps(prev => [...prev, newApp]);
            
            // 6. Establecer como activa y cargar
            localStorage.setItem(CURRENT_APP_KEY, newId);
            setConfigState(newApp);`;
content = content.replace(regexCreateApp, newCreateApp);

const regexDeleteApp = /try \{.*?\/\/ 1\. Actualización.*?setAvailableApps\(prev => prev\.filter\(a => a\.id !== id\)\);/s;
const newDeleteApp = `try {
            // 1. Eliminar de Firebase
            api.deleteAppFromDb(id);
            
            // 2. Limpiamos datos específicos de la app
            localStorage.removeItem(id);
            localStorage.removeItem(\`\${id}_price\`);
            
            // 3. Actualizamos el estado visual de React
            setAvailableApps(prev => prev.filter(a => a.id !== id));`;
content = content.replace(regexDeleteApp, newDeleteApp);

fs.writeFileSync('context/ConfigContext.tsx', content);
