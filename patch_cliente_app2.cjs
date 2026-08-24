const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

const oldDescLogic = `                            {lang === 'es' ? (p as any).Descripcion :
                             lang === 'eu' ? ((p as any).EU_Descripcion || (p as any).Descripcion) :
                             lang === 'en' ? ((p as any).EN_Descripcion || (p as any).Descripcion) :
                             lang === 'fr' ? ((p as any).FR_Descripcion || (p as any).Descripcion) :
                             lang === 'de' ? ((p as any).DE_Descripcion || (p as any).Descripcion) :
                             ((p as any).IT_Descripcion || (p as any).Descripcion)}`;

const newDescLogic = `                            {lang === 'es' ? (p as any).Descripcion :
                             lang === 'eu' ? ((p as any).EU_Descripcion || (p as any).eu_Descripcion || (p as any).Descripcion) :
                             lang === 'en' ? ((p as any).EN_Descripcion || (p as any).en_Descripcion || (p as any).Descripcion) :
                             lang === 'fr' ? ((p as any).FR_Descripcion || (p as any).fr_Descripcion || (p as any).Descripcion) :
                             lang === 'de' ? ((p as any).DE_Descripcion || (p as any).de_Descripcion || (p as any).Descripcion) :
                             ((p as any).IT_Descripcion || (p as any).it_Descripcion || (p as any).Descripcion)}`;

if (content.includes(oldDescLogic)) {
    content = content.replace(oldDescLogic, newDescLogic);
    fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
    console.log("Patched Desc Logic");
} else {
    console.log("Desc Logic Not found");
}
