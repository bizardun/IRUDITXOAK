const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

const oldSeed = `            const config = getActiveConfig();
            platos = config.initialPlatos;`;

const newSeed = `            const config = getActiveConfig();
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
            platos = initialData;`;

content = content.replace(oldSeed, newSeed);
fs.writeFileSync('services/api.ts', content);
