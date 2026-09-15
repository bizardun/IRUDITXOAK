import re

with open('context/ConfigContext.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add to ConfigContextType
c = c.replace(
    'loadApp: (id: string) => void;',
    'loadApp: (id: string) => void;\n    updateAppConfig: (updates: Partial<RestaurantConfig>) => Promise<void>;'
)

# Add implementation
update_fn = """
    const updateAppConfig = async (updates: Partial<RestaurantConfig>) => {
        try {
            const updated = { ...config, ...updates };
            await api.saveApp(updated, false);
            setConfigState(updated);
            setAvailableApps(prev => prev.map(a => a.id === updated.id ? updated : a));
        } catch (e) {
            console.error("Error updating config:", e);
        }
    };

    if (isInitializing && !isMasterAdmin)
"""

c = c.replace('if (isInitializing && !isMasterAdmin)', update_fn)

# Export in provider
c = c.replace(
    'loadApp,',
    'loadApp,\n            updateAppConfig,'
)

with open('context/ConfigContext.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

