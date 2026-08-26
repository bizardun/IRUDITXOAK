const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

// 1. Update useState
content = content.replace(
    "const [view, setView] = useState<'menu' | 'carta' | 'raciones'>('menu');",
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ENTRANTE' : 'menu');"
);

// 2. Remove Carta tab
const targetTab = "{ id: 'menu', label: t.carta || 'Carta' },";
content = content.replace(targetTab, "");

fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
console.log('ClienteApp patched!');
