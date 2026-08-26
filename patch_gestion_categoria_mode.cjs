const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionCategoria.tsx', 'utf8');

// 1. Change the props definition to allow string mode
content = content.replace(
    "const GestionCategoria: React.FC<{ mode: 'menu' | 'carta' | 'raciones'; setView: (v: any) => void }> = ({ mode, setView }) => {",
    "const GestionCategoria: React.FC<{ mode: string; setView: (v: any) => void }> = ({ mode, setView }) => {"
);

// 2. Adjust the filter logic inside groupedPlatos
const oldFilter = `        const filtered = platos.filter(p => {
            if (mode === 'menu') {
                return p.Rol_Menu === 'PRIMERO' || p.Rol_Menu === 'SEGUNDO' || p.Rol_Menu === 'POSTRE';
            }
            return p.Categoria.includes('CARTA');
        });`;

const newFilter = `        const filtered = platos.filter(p => {
            if (mode === 'menu') {
                return p.Rol_Menu === 'PRIMERO' || p.Rol_Menu === 'SEGUNDO' || p.Rol_Menu === 'POSTRE';
            }
            if (mode === 'carta' || mode === 'raciones') {
                return p.Categoria.includes('CARTA');
            }
            // If it's a specific category view for Kanala
            return p.Categoria.includes('CARTA') && p.Tipo === mode;
        });`;

content = content.replace(oldFilter, newFilter);

// 3. Adjust the title rendered in the view
const oldTitle = `                        <h2 className="text-xl sm:text-2xl font-bold font-lora text-slate-800 group-hover:text-slate-900 capitalize transition-colors">
                            {mode === 'raciones' ? 'Gestión Raciones' : mode}
                        </h2>`;
const newTitle = `                        <h2 className={\`text-xl sm:text-2xl font-bold font-lora capitalize transition-colors \${isKanala ? 'text-white' : 'text-slate-800 group-hover:text-slate-900'}\`}>
                            {mode === 'raciones' ? 'Gestión Raciones' : mode === 'carta' ? 'Carta Principal' : (translations[config.idiomaPrincipal || 'ES']?.tipos as any)?.[mode] || mode}
                        </h2>`;
content = content.replace(oldTitle, newTitle);

fs.writeFileSync('components/gestion/GestionCategoria.tsx', content);
console.log('GestionCategoria mode logic patched!');
