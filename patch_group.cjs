const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionCategoria.tsx', 'utf8');

content = content.replace(
    /const k = mode === 'menu' \? \(p\.Rol_Menu \|\| 'OTROS'\) : \(p\.Tipo \|\| 'OTROS'\);/g,
    "const k = mode === 'menu' ? (p.Rol_Menu && p.Rol_Menu !== 'NO' ? p.Rol_Menu : (p.Tipo || 'OTROS')) : (p.Tipo || 'OTROS');"
);

fs.writeFileSync('components/gestion/GestionCategoria.tsx', content);
