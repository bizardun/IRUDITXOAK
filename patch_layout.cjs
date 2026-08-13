const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionCategoria.tsx', 'utf8');

content = content.replace(
    /className=\{\`\$\{mode === 'carta' \? 'w-\[35\%\]' : 'flex-grow'\} min-w-0 flex items-center gap-2 text-left\`\}/g,
    "className={`\\${(mode === 'carta' || mode === 'menu') ? 'w-[35%]' : 'flex-grow'} min-w-0 flex items-center gap-2 text-left`}"
);

content = content.replace(
    /className=\{\`\$\{mode === 'carta' \? 'w-\[35\%\]' : 'flex-grow'\} min-w-0\`\}/g,
    "className={`\\${(mode === 'carta' || mode === 'menu') ? 'w-[35%]' : 'flex-grow'} min-w-0`}"
);

fs.writeFileSync('components/gestion/GestionCategoria.tsx', content);
