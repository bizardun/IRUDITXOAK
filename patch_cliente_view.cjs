const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

const oldTabs = `                    {[
                        { id: 'ALL', label: t.carta || 'Carta' },
                        { id: 'ENTRANTE', label: t.tipos?.ENTRANTE || 'Entrantes' },
                        { id: 'ARROZ', label: t.tipos?.ARROZ || 'Arroces' },
                        { id: 'MARISCO', label: t.tipos?.MARISCO || 'Mariscos' },
                        { id: 'PESCADO', label: t.tipos?.PESCADO || 'Pescados' },
                        { id: 'CARNE', label: t.tipos?.CARNE || 'Carnes' },
                        { id: 'POSTRE', label: t.tipos?.POSTRE || 'Postres' }
                    ].map(tab => (`;

const newTabs = `                    {[
                        { id: 'ALL', label: t.carta || 'Carta' },
                        { id: 'ENTRANTE', label: t.tipos?.ENTRANTE || 'Entrantes' },
                        { id: 'ENSALADA', label: t.tipos?.ENSALADA || 'Ensaladas' },
                        { id: 'ARROZ', label: t.tipos?.ARROZ || 'Arroces' },
                        { id: 'MARISCO', label: t.tipos?.MARISCO || 'Mariscos' },
                        { id: 'PESCADO', label: t.tipos?.PESCADO || 'Pescados' },
                        { id: 'CARNE', label: t.tipos?.CARNE || 'Carnes' },
                        { id: 'POSTRE', label: t.tipos?.POSTRE || 'Postres' }
                    ].map(tab => (`;

if (content.includes(oldTabs)) {
    content = content.replace(oldTabs, newTabs);
    fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
    console.log("Ensalada Patched");
} else {
    console.log("Not found tabs");
}
