const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionCategoria.tsx', 'utf8');

// 1. Update filter to show MENU plates or plates with Rol_Menu
content = content.replace(
    /if \(mode === 'menu'\) return p\.Rol_Menu && p\.Rol_Menu !== 'RACION';/g,
    `if (mode === 'menu') return p.Categoria.includes('MENU') || (p.Rol_Menu && p.Rol_Menu !== 'RACION');`
);

// 2. Add "Añadir a Menú del Día" header in menu mode too
content = content.replace(
    /\{mode === 'carta' && \(/g,
    `{(mode === 'carta' || mode === 'menu') && (`
);

fs.writeFileSync('components/gestion/GestionCategoria.tsx', content);
