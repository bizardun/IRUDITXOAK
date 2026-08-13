const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionHome.tsx', 'utf8');

// Remove IconMonitor
content = content.replace(/const IconMonitor = \(\) => \([\s\S]*?<\/svg>\r?\n\);\r?\n\r?\n?/, '');

// Remove preview card
content = content.replace(/\s*\{\s*id:\s*'preview'[^}]+\},?/, '');

fs.writeFileSync('components/gestion/GestionHome.tsx', content);
