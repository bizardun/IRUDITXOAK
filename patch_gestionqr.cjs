const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

// Ensure GestionQR creates EXACTLY the same URL as FactoryDashboard
content = content.replace(
    /const baseUrl = originUrl \+ path \+ "\?app=" \+ config\.id \+ "&client=true";/,
    `// Forzamos la misma lógica exacta que en FactoryDashboard
        const baseUrlToUse = typeof window !== 'undefined' ? window.location.origin : 'https://tu-dominio.vercel.app';
        const baseUrl = baseUrlToUse + "/?app=" + config.id + "&client=true";`
);

fs.writeFileSync('components/gestion/GestionQR.tsx', content);
