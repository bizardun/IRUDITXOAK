const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

// Replace the URL generation logic
content = content.replace(
    /const originUrl = typeof window !== 'undefined' \? window\.location\.origin : '';\n\s*const path = typeof window !== 'undefined' \? window\.location\.pathname : '';\n\s*const baseUrl = originUrl \+ path \+ "\?app=" \+ config\.id \+ "&client=true";/,
    `const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tu-dominio.vercel.app';
        const baseUrl = originUrl + "/?app=" + config.id + "&client=true";`
);

fs.writeFileSync('components/gestion/GestionQR.tsx', content);
