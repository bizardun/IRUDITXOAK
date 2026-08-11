const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

content = content.replace(
    /let baseUrl = window\.location\.href;\s*baseUrl = baseUrl\.split\('\?'\)\[0\]\.split\('#'\)\[0\];/,
    `let baseUrl = window.location.origin + window.location.pathname;`
);

fs.writeFileSync('components/gestion/GestionQR.tsx', content);
