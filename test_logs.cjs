const fs = require('fs');
let content = fs.readFileSync('context/ConfigContext.tsx', 'utf8');

content = content.replace(
    /console\.error\("Error cargando registro de apps:", e\);/,
    `console.error("Error cargando registro de apps:", e);`
);

fs.writeFileSync('context/ConfigContext.tsx', content);
