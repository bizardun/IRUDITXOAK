const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');
content = content.replace(
    /Cargando\.\.\./g,
    'Cargando Carta...'
);
fs.writeFileSync('components/cliente/ClienteApp.tsx', content);

let content2 = fs.readFileSync('components/gestion/GestionApp.tsx', 'utf8');
content2 = content2.replace(
    /Cargando\.\.\./g,
    'Cargando Gestión...'
);
fs.writeFileSync('components/gestion/GestionApp.tsx', content2);
