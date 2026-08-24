const fs = require('fs');
let content = fs.readFileSync('types.ts', 'utf8');

content = content.replace(
    "    theme?: ThemeConfig;",
    "    theme?: ThemeConfig;\n    adminPassword?: string;"
);

fs.writeFileSync('types.ts', content);
