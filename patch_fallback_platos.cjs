const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

// We need to import bolinaConfig inside api.ts... actually, it imports getActiveConfig but does it import bolinaConfig?
content = content.replace(
    /let initialData = config\.initialPlatos \|\| \[\];/,
    `let initialData = config.initialPlatos && config.initialPlatos.length > 0 ? config.initialPlatos : getActiveConfig().initialPlatos; // Fallback so it's never empty`
);

fs.writeFileSync('services/api.ts', content);
