const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

// In DishItem
content = content.replace(
    'const name = (p as any)[`${lang.toUpperCase()}_Nombre`] || (p as any)[`${lang}_Nombre`] || p.ES_Nombre;',
    `const { config } = useConfig();
    const isKanala = config?.name?.toLowerCase().includes('kanala') || false;
    const tc = isKanala ? {
        border: 'border-white/10',
        name: 'text-white',
        desc: 'text-neutral-400',
        price: 'text-white'
    } : {
        border: 'border-slate-50',
        name: 'text-slate-800',
        desc: 'text-slate-500',
        price: 'text-slate-900'
    };
    
    const name = (p as any)[\`\${lang.toUpperCase()}_Nombre\`] || (p as any)[\`\${lang}_Nombre\`] || p.ES_Nombre;`
);

content = content.replace(
    '<li className="list-none py-0.5 sm:py-2 border-b border-slate-50 last:border-0 animate-fade-in">',
    '<li className={`list-none py-0.5 sm:py-2 border-b ${tc.border} last:border-0 animate-fade-in`}>'
);

content = content.replace(
    'className={`font-sans text-[15px] sm:text-base font-medium truncate block leading-tight ${isRestricted ? \'text-slate-500 line-through decoration-slate-400\' : \'text-slate-800\'}`}',
    'className={`font-sans text-[15px] sm:text-base font-medium truncate block leading-tight ${isRestricted ? \'text-slate-500 line-through decoration-slate-400\' : tc.name}`}'
);

content = content.replace(
    'className={`text-xs sm:text-[13px] text-slate-500 mt-0.5 leading-snug ${isRestricted ? \'opacity-40\' : \'\'}`}',
    'className={`text-xs sm:text-[13px] mt-0.5 leading-snug ${tc.desc} ${isRestricted ? \'opacity-40\' : \'\'}`}'
);

content = content.replace(
    'className="text-[15px] sm:text-base font-bold text-slate-900 whitespace-nowrap leading-tight"',
    'className={`text-[15px] sm:text-base font-bold whitespace-nowrap leading-tight ${tc.price}`}'
);


// In ClienteApp renderGroup
content = content.replace(
    'const renderGroup = (items: any[], typeLabel: string, catKey: string, isMenuMode: boolean = false) => {',
    `const renderGroup = (items: any[], typeLabel: string, catKey: string, isMenuMode: boolean = false) => {
        const isKanala = config.name.toLowerCase().includes('kanala');
        const hc = isKanala ? {
            bg: 'bg-neutral-900',
            text: 'text-white',
            border: 'border-white/10',
            hover: 'hover:bg-white/5 active:bg-white/10'
        } : {
            bg: 'bg-white',
            text: 'text-slate-800',
            border: styles.border,
            hover: 'hover:bg-slate-50 active:bg-slate-100'
        };`
);

content = content.replace(
    'className={`w-full flex items-center justify-between text-[13px] sm:text-lg font-bold py-2 sm:py-4 px-1 capitalize transition-all border-b ${styles.border} ${!isMenuMode ? \'hover:bg-slate-50 active:bg-slate-100\' : \'cursor-default\'} sticky top-0 z-20 bg-white`}',
    'className={`w-full flex items-center justify-between text-[13px] sm:text-lg font-bold py-2 sm:py-4 px-1 capitalize transition-all border-b ${hc.border} ${!isMenuMode ? hc.hover : \'cursor-default\'} sticky top-0 z-20 ${hc.bg} ${hc.text}`}'
);


// In ClienteApp return
content = content.replace(
    '<main className="bg-white p-3 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 relative min-h-[500px]">',
    '<main className={`p-3 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border relative min-h-[500px] ${config.name.toLowerCase().includes(\'kanala\') ? \'bg-neutral-900 border-white/10\' : \'bg-white border-slate-100\'}`}>'
);

content = content.replace(
    '<footer className="mt-12 sm:mt-20 pt-6 border-t border-slate-50 text-center text-[11px] sm:text-[12px] text-slate-200 uppercase tracking-widest font-black">',
    '<footer className={`mt-12 sm:mt-20 pt-6 border-t text-center text-[11px] sm:text-[12px] uppercase tracking-widest font-black ${config.name.toLowerCase().includes(\'kanala\') ? \'border-white/10 text-white/20\' : \'border-slate-50 text-slate-200\'}`}>'
);

// Kanala Tabs
content = content.replace(
    'className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all border snap-center ${view === tab.id ? \'bg-slate-900 text-white border-slate-900 shadow-md\' : \'bg-white text-slate-600 border-slate-200 hover:bg-slate-50\'}`}',
    'className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all border snap-center ${view === tab.id ? \'bg-white text-black border-white shadow-md\' : \'bg-transparent text-white/70 border-white/20 hover:bg-white/10 hover:text-white\'}`}'
);

// Kanala Logo Invert
content = content.replace(
    '<img src="https://www.kanalabeach.eus/wp-content/uploads/2024/06/kanala-logos_LOGO-HORIZONTAL-zuria.png" alt={config.name} style={{filter: \'invert(1)\'}} className="h-16 sm:h-20 mx-auto object-contain mb-4 sm:mb-6" />',
    '<img src="https://www.kanalabeach.eus/wp-content/uploads/2024/06/kanala-logos_LOGO-HORIZONTAL-zuria.png" alt={config.name} className="h-16 sm:h-20 mx-auto object-contain mb-4 sm:mb-6" />'
);

// Allergen button for Kanala
content = content.replace(
    '<button onClick={() => setShowAllergens(!showAllergens)} className={`text-[13px] sm:text-sm font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-sm border transition-all ${showAllergens ? \'bg-slate-800 text-white border-slate-800\' : \'bg-white text-slate-600 border-slate-200 hover:bg-slate-50\'}`}>',
    '<button onClick={() => setShowAllergens(!showAllergens)} className={`text-[13px] sm:text-sm font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-sm border transition-all ${config.name.toLowerCase().includes(\'kanala\') ? (showAllergens ? \'bg-white text-black border-white\' : \'bg-transparent text-white/80 border-white/20 hover:bg-white/10\') : (showAllergens ? \'bg-slate-800 text-white border-slate-800\' : \'bg-white text-slate-600 border-slate-200 hover:bg-slate-50\')}`}>'
);

// Lang Select
content = content.replace(
    '<div className="bg-white/95 backdrop-blur-md border-t border-slate-200 border-b-4 border-b-slate-300 shadow-md py-1 sm:py-2 px-2 sm:px-6">',
    '<div className={`backdrop-blur-md border-t border-b-4 shadow-md py-1 sm:py-2 px-2 sm:px-6 ${config.name.toLowerCase().includes(\'kanala\') ? \'bg-neutral-950/95 border-white/10 border-b-neutral-800\' : \'bg-white/95 border-slate-200 border-b-slate-300\'}`}>'
);

content = content.replace(
    'className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${isSelected ? \'bg-white border-slate-800 shadow-sm ring-1 ring-slate-200 z-10\' : \'bg-white/40 border-slate-100 hover:border-slate-300\'}`}',
    'className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${config.name.toLowerCase().includes(\'kanala\') ? (isSelected ? \'bg-neutral-800 border-white shadow-sm ring-1 ring-neutral-700 z-10 text-white\' : \'bg-transparent border-white/10 hover:border-white/30 text-white/60\') : (isSelected ? \'bg-white border-slate-800 shadow-sm ring-1 ring-slate-200 z-10\' : \'bg-white/40 border-slate-100 hover:border-slate-300\')}`}'
);

// Body background override in MainLayout.
// Instead of messing with App.tsx immediately, we can inject a style tag in ClienteApp for Kanala
content = content.replace(
    '<div className="min-h-screen pb-16 px-4 sm:px-6 max-w-5xl mx-auto">',
    '<div className={`min-h-screen pb-16 px-4 sm:px-6 max-w-5xl mx-auto transition-colors duration-500 ${config.name.toLowerCase().includes(\'kanala\') ? \'bg-black text-white\' : \'\'}`}>\n            {config.name.toLowerCase().includes(\'kanala\') && <style>{`body { background-color: black; }`}</style>}'
);


fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
console.log("Patched Theme Logic");
