const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

const oldPrice = `        if (docSnap.exists() && docSnap.data().menuPrice !== undefined) {
            return parseFloat(docSnap.data().menuPrice);
        }
        // Fallback
        return 16.50;`;

const newPrice = `        if (docSnap.exists() && docSnap.data().menuPrice !== undefined) {
            return parseFloat(docSnap.data().menuPrice);
        }
        // Migration from LocalStorage
        let fallbackPrice = 16.50;
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = window.localStorage.getItem(\`\${getActiveConfig().id}_price\`);
            if (stored) fallbackPrice = parseFloat(stored);
        }
        // Save it to firebase
        await setDoc(doc(db, CONFIG_DOC), { menuPrice: fallbackPrice }, { merge: true });
        return fallbackPrice;`;

content = content.replace(oldPrice, newPrice);
fs.writeFileSync('services/api.ts', content);
