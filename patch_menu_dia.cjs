const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionCategoria.tsx', 'utf8');

const search = '<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Añadir a Menú del Día</span>';
const replace = '<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Menú día</span>';

content = content.replace(search, replace);
fs.writeFileSync('components/gestion/GestionCategoria.tsx', content);
