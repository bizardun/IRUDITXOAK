const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionCategoria.tsx', 'utf8');

if(!content.includes("useConfig")) {
    content = content.replace(
        "import { useData } from '../../context/DataContext';",
        "import { useData } from '../../context/DataContext';\nimport { useConfig } from '../../context/ConfigContext';"
    );
}

content = content.replace(
    "const GestionCategoria: React.FC<{ mode: 'menu' | 'carta' | 'raciones'; setView: (v: any) => void }> = ({ mode, setView }) => {",
    "const GestionCategoria: React.FC<{ mode: 'menu' | 'carta' | 'raciones'; setView: (v: any) => void }> = ({ mode, setView }) => {\n    const { config } = useConfig();\n    const isKanala = config.name.toLowerCase().includes('kanala');\n    const tc = isKanala ? {\n        bg: 'bg-neutral-900',\n        cardBg: 'bg-neutral-800',\n        text: 'text-white',\n        textMuted: 'text-neutral-400',\n        border: 'border-white/10',\n        headerBg: 'bg-neutral-900',\n        inputBg: 'bg-neutral-900',\n        hover: 'hover:bg-white/5'\n    } : {\n        bg: 'bg-slate-50',\n        cardBg: 'bg-white',\n        text: 'text-slate-800',\n        textMuted: 'text-slate-500',\n        border: 'border-slate-200',\n        headerBg: 'bg-white',\n        inputBg: 'bg-white',\n        hover: 'hover:bg-slate-50'\n    };"
);

// Header panel classes
content = content.replace(
    '<div className="sticky top-0 z-40 flex flex-wrap items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-md border border-slate-200 gap-3">',
    '<div className={`sticky top-0 z-40 flex flex-wrap items-center justify-between mb-4 p-3 rounded-lg shadow-md border gap-3 ${tc.headerBg} ${tc.border}`}>'
);

// Return wrapper
content = content.replace(
    '<div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24">',
    '<div className={`max-w-3xl mx-auto p-4 sm:p-6 pb-24 ${isKanala ? "text-white" : ""}`}>'
);

// Group card wrapper
content = content.replace(
    '<div key={key} className="bg-white rounded-xl shadow-sm border border-slate-100 transition-all relative">',
    '<div key={key} className={`rounded-xl shadow-sm border transition-all relative ${tc.cardBg} ${isKanala ? "border-white/10" : "border-slate-100"}`}>'
);

// Sticky group header
content = content.replace(
    '<div className="sticky top-[64px] sm:top-[68px] z-20 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 shadow-sm transition-colors hover:bg-slate-100/95 rounded-t-xl">',
    '<div className={`sticky top-[64px] sm:top-[68px] z-20 backdrop-blur-sm border-b shadow-sm transition-colors rounded-t-xl ${isKanala ? "bg-neutral-800/95 border-white/10 hover:bg-neutral-700/95" : "bg-slate-50/95 border-slate-200 hover:bg-slate-100/95"}`}>'
);

// List item
content = content.replace(
    'className={`flex items-center px-4 py-2.5 hover:bg-slate-50/50 transition-colors gap-2 group ${draggedItem?.ID_Plato === p.ID_Plato ? \'opacity-50 bg-blue-50\' : \'\'} ${isRestricted ? \'opacity-50 grayscale\' : \'\'}`}',
    'className={`flex items-center px-4 py-2.5 transition-colors gap-2 group ${isKanala ? "hover:bg-white/5" : "hover:bg-slate-50/50"} ${draggedItem?.ID_Plato === p.ID_Plato ? \'opacity-50 bg-blue-50\' : \'\'} ${isRestricted ? \'opacity-50 grayscale\' : \'\'}`}'
);

// Item name input
content = content.replace(
    'className={`text-xs font-bold uppercase rounded-md py-1.5 px-2 border border-slate-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 cursor-pointer transition-all appearance-none text-center w-full max-w-[160px] truncate ${p.Rol_Menu ? \'bg-blue-50 text-blue-700 border-blue-200 shadow-sm\' : \'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 shadow-sm\'}`}',
    'className={`text-xs font-bold uppercase rounded-md py-1.5 px-2 border focus:border-blue-400 focus:ring-1 focus:ring-blue-400 cursor-pointer transition-all appearance-none text-center w-full max-w-[160px] truncate shadow-sm ${p.Rol_Menu ? \'bg-blue-50 text-blue-700 border-blue-200\' : (isKanala ? \'bg-neutral-900 text-white border-white/20 hover:border-white/40\' : \'bg-white text-slate-600 border-slate-300 hover:text-slate-800 hover:bg-slate-50\')}`}'
);

// Price container for EditablePrice
// We might not need to patch it directly if it's inside `EditablePrice.tsx`
// Let's check `EditablePrice` later.

// Name container text
content = content.replace(
    '<span className="font-bold text-sm sm:text-base text-slate-800 flex-grow truncate">{p.ES_Nombre || p.EU_Nombre}</span>',
    '<span className={`font-bold text-sm sm:text-base flex-grow truncate ${isKanala ? "text-white" : "text-slate-800"}`}>{p.ES_Nombre || p.EU_Nombre}</span>'
);

// Button icons (Edit icon)
content = content.replace(
    '<button onClick={() => openEditModal(p)} className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><IconEdit width={18} height={18}/></button>',
    '<button onClick={() => openEditModal(p)} className={`p-1.5 rounded-full transition-colors ${isKanala ? "text-neutral-400 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"}`}><IconEdit width={18} height={18}/></button>'
);

// Group Title
content = content.replace(
    '<h2 className="text-base sm:text-lg font-bold text-slate-800 capitalize flex items-center gap-2">',
    '<h2 className={`text-base sm:text-lg font-bold capitalize flex items-center gap-2 ${isKanala ? "text-white" : "text-slate-800"}`}>'
);

// Chevron Icon wrapper (group title)
content = content.replace(
    '<div className={`transition-transform duration-300 text-slate-400 group-hover:text-slate-600 ${isExpanded ? \'rotate-90\' : \'\'}`}><IconChevronLeft /></div>',
    '<div className={`transition-transform duration-300 ${isExpanded ? \'rotate-90\' : \'\'} ${isKanala ? "text-neutral-500 group-hover:text-white" : "text-slate-400 group-hover:text-slate-600"}`}><IconChevronLeft /></div>'
);

fs.writeFileSync('components/gestion/GestionCategoria.tsx', content);
console.log("GestionCategoria patched!");
