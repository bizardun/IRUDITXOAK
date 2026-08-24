const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

const oldSaveApp = `        const batch = writeBatch(db);
        app.initialPlatos.forEach(p => {
            const docRef = doc(collection(db, \`restaurants/\${app.id}/platos\`), p.ID_Plato.toString());
            batch.set(docRef, p);
        });
        await batch.commit();`;

const newSaveApp = `        if (app.initialPlatos && Array.isArray(app.initialPlatos)) {
            const batch = writeBatch(db);
            app.initialPlatos.forEach(p => {
                const docRef = doc(collection(db, \`restaurants/\${app.id}/platos\`), p.ID_Plato.toString());
                batch.set(docRef, p);
            });
            await batch.commit();
        }`;

content = content.replace(oldSaveApp, newSaveApp);
fs.writeFileSync('services/api.ts', content);
