const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

const regex = /                    <div className="w-full flex justify-between items-end text-xs text-slate-400 border-t border-slate-100 pt-6 mt-8 font-mono">[\s\S]*?<\/div>\r?\n                    <\/div>/m;

content = content.replace(regex, '');
fs.writeFileSync('components/gestion/GestionQR.tsx', content);
