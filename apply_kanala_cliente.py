import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

# 1. State view
content = content.replace(
    "const [view, setView] = useState<'menu' | 'carta' | 'raciones'>('menu');",
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ALL' : 'menu');"
)

# 2. Main div wrapper background
content = content.replace(
    '<div className="min-h-screen pb-16 px-4 sm:px-6 max-w-5xl mx-auto">',
    '<div className={`min-h-screen pb-16 px-4 sm:px-6 max-w-5xl mx-auto transition-colors duration-500 ${config.name.toLowerCase().includes(\'kanala\') ? \'bg-black text-white\' : \'\'}`}>\n            {config.name.toLowerCase().includes(\'kanala\') && <style>{`body { background-color: black; }`}</style>}'
)

# 3. Logo
content = content.replace(
    '''<header className="pt-6 sm:pt-10 pb-4 text-center">
                {config.name.toLowerCase().includes('boliña') ? (
                    <img src="/logo boliña sin fondo.jfif" alt={config.name} className="h-24 sm:h-32 mx-auto object-contain mb-1 sm:mb-3 drop-shadow-md" />
                ) : (
                    <h1 className="text-4xl sm:text-6xl font-bold mb-1 sm:mb-3 tracking-tight text-slate-900 leading-tight">{config.name}</h1>
                )}''',
    '''<header className="pt-6 sm:pt-10 pb-4 text-center">
                {config.name.toLowerCase().includes('kanala') ? (
                    <img src="https://www.kanalabeach.eus/wp-content/uploads/2024/06/kanala-logos_LOGO-HORIZONTAL-zuria.png" alt={config.name} className="h-16 sm:h-20 mx-auto object-contain mb-4 sm:mb-6" />
                ) : config.name.toLowerCase().includes('boliña') ? (
                    <img src="/logo boliña sin fondo.jfif" alt={config.name} className="h-24 sm:h-32 mx-auto object-contain mb-1 sm:mb-3 drop-shadow-md" />
                ) : (
                    <h1 className="text-4xl sm:text-6xl font-bold mb-1 sm:mb-3 tracking-tight text-slate-900 leading-tight">{config.name}</h1>
                )}'''
)

# 4. Tabs replacement - Only for Boliña
content = content.replace(
    '''<div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 mb-4 sm:mb-10 shadow-inner max-w-lg mx-auto">
                    {[{ id: 'menu', label: t.menuDelDia, icon: IconMenu }, { id: 'carta', label: t.carta, icon: IconBook }, { id: 'raciones', label: t.raciones, icon: IconFood }].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setView(tab.id as any)} 
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] sm:text-sm font-bold transition-all ${view === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <tab.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> <span className="whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>''',
    '''{config.name.toLowerCase().includes('kanala') ? null : (
                    <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 mb-4 sm:mb-10 shadow-inner max-w-lg mx-auto">
                        {[{ id: 'menu', label: t.menuDelDia, icon: IconMenu }, { id: 'carta', label: t.carta, icon: IconBook }, { id: 'raciones', label: t.raciones, icon: IconFood }].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setView(tab.id as any)} 
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] sm:text-sm font-bold transition-all ${view === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <tab.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}'''
)

# 5. Main Box Style
content = content.replace(
    '<main className="bg-white p-3 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 relative min-h-[500px]">',
    '<main className={`p-3 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border relative min-h-[500px] ${config.name.toLowerCase().includes(\'kanala\') ? \'bg-neutral-900 border-white/10\' : \'bg-white border-slate-100\'}`}>'
)

# 6. Render menu logic fix
content = content.replace(
    "{view === 'menu' ? renderMenu() : renderCartaOrRaciones()}",
    "{(!config.name.toLowerCase().includes('kanala') && view === 'menu') ? renderMenu() : renderCartaOrRaciones()}"
)

# 7. Render Kanala items without filtering 
content = content.replace(
    "const inCarta = p.Categoria.includes('CARTA');",
    "const inCarta = p.Categoria.includes('CARTA');\n            if (isKanala) return inCarta;"
)

# 8. Groups styling
content = content.replace(
    "const renderGroup = (items: any[], typeLabel: string, catKey: string, isMenuMode: boolean = false) => {",
    """const renderGroup = (items: any[], typeLabel: string, catKey: string, isMenuMode: boolean = false) => {
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
        };"""
)

content = content.replace(
    'className={`w-full flex items-center justify-between text-[13px] sm:text-lg font-bold py-2 sm:py-4 px-1 capitalize transition-all border-b ${styles.border} ${!isMenuMode ? \'hover:bg-slate-50 active:bg-slate-100\' : \'cursor-default\'} sticky top-0 bg-white z-20 text-slate-800`}',
    'className={`w-full flex items-center justify-between text-[13px] sm:text-lg font-bold py-2 sm:py-4 px-1 capitalize transition-all border-b ${hc.border} ${!isMenuMode ? hc.hover : \'cursor-default\'} sticky top-0 z-20 ${hc.bg} ${hc.text}`}'
)

# 9. Allergen legend
content = content.replace(
    'className="backdrop-blur-md bg-white/95 border-t border-b-4 border-slate-200 border-b-slate-300 shadow-md py-1 sm:py-2 px-2 sm:px-6"',
    'className={`backdrop-blur-md border-t border-b-4 shadow-md py-1 sm:py-2 px-2 sm:px-6 ${config.name.toLowerCase().includes(\'kanala\') ? \'bg-neutral-950/95 border-white/10 border-b-neutral-800\' : \'bg-white/95 border-slate-200 border-b-slate-300\'}`}'
)

content = content.replace(
    'className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${isSelected ? \'bg-white border-slate-800 shadow-sm ring-1 ring-slate-200 z-10\' : \'bg-white/40 border-slate-100 hover:border-slate-300\'}`}',
    'className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${config.name.toLowerCase().includes(\'kanala\') ? (isSelected ? \'bg-neutral-800 border-white shadow-sm ring-1 ring-neutral-700 z-10 text-white\' : \'bg-transparent border-white/10 hover:border-white/30 text-white/60\') : (isSelected ? \'bg-white border-slate-800 shadow-sm ring-1 ring-slate-200 z-10\' : \'bg-white/40 border-slate-100 hover:border-slate-300\')}`}'
)

content = content.replace(
    '<span className={`text-[9px] font-bold uppercase tracking-wide ${isSelected ? \'text-slate-900\' : \'text-slate-500\'}`}>',
    '<span className={`text-[9px] font-bold uppercase tracking-wide ${isSelected ? (config.name.toLowerCase().includes(\'kanala\') ? \'text-white\' : \'text-slate-900\') : \'text-slate-500\'}`}>'
)

content = content.replace(
    '<button onClick={() => setShowAllergens(!showAllergens)} className={`text-[13px] sm:text-sm font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-sm border transition-all ${showAllergens ? \'bg-slate-800 text-white border-slate-800\' : \'bg-white text-slate-600 border-slate-200 hover:bg-slate-50\'}`}>',
    '<button onClick={() => setShowAllergens(!showAllergens)} className={`text-[13px] sm:text-sm font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-sm border transition-all ${config.name.toLowerCase().includes(\'kanala\') ? (showAllergens ? \'bg-white text-black border-white\' : \'bg-transparent text-white/80 border-white/20 hover:bg-white/10\') : (showAllergens ? \'bg-slate-800 text-white border-slate-800\' : \'bg-white text-slate-600 border-slate-200 hover:bg-slate-50\')}`}>'
)

# 10. Footer text
content = content.replace(
    '<footer className="mt-12 sm:mt-20 pt-6 border-t border-slate-50 text-center text-[9px] sm:text-[12px] text-slate-200 uppercase tracking-widest font-black">',
    '<footer className={`mt-12 sm:mt-20 pt-6 border-t text-center text-[11px] sm:text-[12px] uppercase tracking-widest font-black ${config.name.toLowerCase().includes(\'kanala\') ? \'border-white/10 text-white/20\' : \'border-slate-50 text-slate-200\'}`}>'
)

with open('components/cliente/ClienteApp.tsx', 'w') as f:
    f.write(content)
print("Done!")
