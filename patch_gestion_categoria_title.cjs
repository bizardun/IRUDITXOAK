const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionCategoria.tsx', 'utf8');

const targetStr = `mode === 'carta' ? 'Carta Principal' : (translations[config.idiomaPrincipal || 'ES']?.tipos as any)?.[mode] || mode`;
const replaceStr = `mode === 'carta' ? 'Carta Principal' : (translations['ES']?.tipos as any)?.[mode] || mode`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync('components/gestion/GestionCategoria.tsx', content);
console.log('GestionCategoria Title patched!');
