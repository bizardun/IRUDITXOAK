const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

// 1. Initial State
content = content.replace(
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ENTRANTE' : 'menu');",
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ALL' : 'menu');"
);

// 2. Remove Kanala tabs HTML
const searchStr = `{config.name.toLowerCase().includes('kanala') ? (
                    <div className="flex overflow-x-auto no-scrollbar gap-2 mb-4 sm:mb-8 px-1 pb-2 snap-x max-w-3xl mx-auto">
                        {[
                            
                            { id: 'ENTRANTE', label: t.tipos?.ENTRANTE || 'Entrantes' },
                            { id: 'ENSALADA', label: t.tipos?.ENSALADA || 'Ensaladas' },
                            { id: 'ARROZ', label: t.tipos?.ARROZ || 'Arroces' },
                            { id: 'MARISCO', label: t.tipos?.MARISCO || 'Mariscos' },
                            { id: 'PESCADO', label: t.tipos?.PESCADO || 'Pescados' },
                            { id: 'CARNE', label: t.tipos?.CARNE || 'Carnes' },
                            { id: 'POSTRE', label: t.tipos?.POSTRE || 'Postres' }
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setView(tab.id as any)} 
                                className={\`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all border snap-center \${view === tab.id ? 'bg-white text-black border-white shadow-md' : 'bg-transparent text-white/70 border-white/20 hover:bg-white/10 hover:text-white'}\`}
                            >
                                <span className="whitespace-nowrap uppercase tracking-wide">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                ) : (`;

const replaceStr = `{config.name.toLowerCase().includes('kanala') ? null : (`;

if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
    console.log('ClienteApp patched successfully.');
} else {
    console.log('Search string not found in ClienteApp.tsx');
    console.log(content.substring(content.indexOf('{config.name.toLowerCase().includes(\\'kanala\\') ? ('), content.indexOf('{config.name.toLowerCase().includes(\\'kanala\\') ? (') + 1000));
}
