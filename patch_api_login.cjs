const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

const oldLogin = `    login: async (u: string, p: string) => {
        if (u === 'admin' && p === '1234') return true;
        throw new Error('Credenciales incorrectas');
    }`;

const newLogin = `    login: async (u: string, p: string) => {
        const appId = _apiAppId || getActiveConfig().id;
        try {
            const snap = await getDoc(doc(db, 'restaurants', appId));
            if (snap.exists()) {
                const appData = snap.data();
                const expectedPass = appData.adminPassword || '1234';
                if (u === 'admin' && p === expectedPass) return true;
            } else {
                if (u === 'admin' && p === '1234') return true;
            }
        } catch(e) {
            console.error('Login error:', e);
        }
        throw new Error('Credenciales incorrectas');
    }`;

content = content.replace(oldLogin, newLogin);
fs.writeFileSync('services/api.ts', content);
