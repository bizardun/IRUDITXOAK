const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

const oldNameLogic = `    const name = (p as any)[\`\${lang}_Nombre\`] || p.ES_Nombre;`;
const newNameLogic = `    const name = (p as any)[\`\${lang.toUpperCase()}_Nombre\`] || (p as any)[\`\${lang}_Nombre\`] || p.ES_Nombre;`;

if (content.includes(oldNameLogic)) {
    content = content.replace(oldNameLogic, newNameLogic);
    fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
    console.log("Patched Name Logic");
} else {
    console.log("Name Logic Not found");
}
