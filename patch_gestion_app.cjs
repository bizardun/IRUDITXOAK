const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionApp.tsx', 'utf8');

content = content.replace(
    "const [view, setView] = useState<'home' | 'menu' | 'carta' | 'raciones' | 'qr' | 'preview'>('home');",
    "const [view, setView] = useState<string>('home');"
);

fs.writeFileSync('components/gestion/GestionApp.tsx', content);
console.log('GestionApp patched!');
