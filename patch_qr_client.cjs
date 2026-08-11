const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

content = content.replace(
    /let baseUrl = window\.location\.origin \+ window\.location\.pathname;/,
    `let baseUrl = window.location.origin + window.location.pathname + "?client=true";`
);

fs.writeFileSync('components/gestion/GestionQR.tsx', content);
