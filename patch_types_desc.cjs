const fs = require('fs');
let content = fs.readFileSync('types.ts', 'utf8');

content = content.replace(
    "    Alergenos: Alergeno[];",
    "    Alergenos: Alergeno[];\n    Descripcion?: string;\n    EU_Descripcion?: string;\n    EN_Descripcion?: string;\n    FR_Descripcion?: string;\n    DE_Descripcion?: string;\n    IT_Descripcion?: string;"
);

fs.writeFileSync('types.ts', content);
