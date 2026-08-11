const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

content = content.replace(
    /<h1 className="text-lg font-bold text-slate-800 hidden sm:block">Generador de QR<\/h1>/,
    `<h1 className="text-lg font-bold text-slate-800 hidden sm:block">Generador de QR (v2)</h1>`
);

fs.writeFileSync('components/gestion/GestionQR.tsx', content);
