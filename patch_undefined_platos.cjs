const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

content = content.replace(
    /let initialData = config\.initialPlatos;/,
    `let initialData = config.initialPlatos || [];`
);

content = content.replace(
    /platos = initialData;/,
    `platos = initialData || [];`
);

fs.writeFileSync('services/api.ts', content);
