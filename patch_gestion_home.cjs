const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionHome.tsx', 'utf8');

const targetStr = `    const cards = isKanala ? [
        { id: 'carta', label: 'Carta Principal', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'qr', label: 'Descargar QR / Cartel', icon: IconQR, color: 'text-white/80 border-white/20 bg-white/5 hover:bg-white/10' },
    ] : [`;

const replaceStr = `    const cards = isKanala ? [
        { id: 'ENTRANTE', label: 'Entrantes', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'ENSALADA', label: 'Ensaladas', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'ARROZ', label: 'Arroces', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'MARISCO', label: 'Mariscos', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'PESCADO', label: 'Pescados', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'CARNE', label: 'Carnes', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'POSTRE', label: 'Postres', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'qr', label: 'Descargar QR / Cartel', icon: IconQR, color: 'text-white/80 border-white/20 bg-white/5 hover:bg-white/10' },
    ] : [`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync('components/gestion/GestionHome.tsx', content);
console.log('GestionHome patched!');
