import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

# 1. Update DishItemProps to include isKanala
content = content.replace(
    "selectedAllergens: string[];\n}",
    "selectedAllergens: string[];\n    isKanala?: boolean;\n}"
)

# 2. Update DishItem signature
content = content.replace(
    "selectedAllergens\n}) => {",
    "selectedAllergens,\n    isKanala\n}) => {"
)

# 3. Update DishItem border
content = content.replace(
    '<li className="list-none py-1 sm:py-2 border-b border-slate-50 last:border-0 animate-fade-in">',
    '<li className={`list-none py-1 sm:py-2 border-b last:border-0 animate-fade-in ${isKanala ? \'border-white/10\' : \'border-slate-50\'}`}>'
)

# 4. Update DishItem text name
content = content.replace(
    '<span className={`text-[13px] sm:text-base font-medium truncate block ${isRestricted ? \'text-slate-500 line-through decoration-slate-400\' : \'text-slate-800\'}`}>',
    '<span className={`text-[13px] sm:text-base font-medium truncate block ${isRestricted ? (isKanala ? \'text-white/40 line-through decoration-white/40\' : \'text-slate-500 line-through decoration-slate-400\') : (isKanala ? \'text-white\' : \'text-slate-800\')}`}>'
)

# 5. Update DishItem price text
content = content.replace(
    '<span className="text-[13px] sm:text-base font-bold text-slate-900 whitespace-nowrap">',
    '<span className={`text-[13px] sm:text-base font-bold whitespace-nowrap ${isKanala ? \'text-white\' : \'text-slate-900\'}`}>'
)

# 6. Pass isKanala in ClienteApp renderGroup
content = content.replace(
    '<DishItem key={p.ID_Plato} p={p} lang={lang} isMenuMode={isMenuMode} styles={styles} t={t} showAllergens={showAllergens} selectedAllergens={selectedAllergens} />',
    '<DishItem key={p.ID_Plato} p={p} lang={lang} isMenuMode={isMenuMode} styles={styles} t={t} showAllergens={showAllergens} selectedAllergens={selectedAllergens} isKanala={isKanala} />'
)

# 7. Update renderGroup button class
content = content.replace(
    "className={`w-full flex items-center justify-between text-[11px] sm:text-lg font-bold py-3 sm:py-4 px-1 capitalize transition-all border-b ${styles.border} ${!isMenuMode ? 'hover:bg-slate-50 active:bg-slate-100' : 'cursor-default'}`}",
    "className={`w-full flex items-center justify-between text-[11px] sm:text-lg font-bold py-3 sm:py-4 px-1 capitalize transition-all border-b ${hc.border} ${hc.text} ${hc.bg} ${!isMenuMode ? hc.hover : 'cursor-default'}`}"
)

# 8. Fix Logo
content = content.replace(
    '''<header className="pt-6 sm:pt-10 pb-4 text-center">
                <h1 className="text-3xl sm:text-6xl font-bold mb-1 sm:mb-3 tracking-tight text-slate-900 leading-tight">{config.name}</h1>
                {config.slogan && <p className="text-slate-500 italic text-[11px] sm:text-base mb-2">{config.slogan}</p>}''',
    '''<header className="pt-6 sm:pt-10 pb-4 text-center">
                {config.name.toLowerCase().includes('kanala') ? (
                    <img src="https://www.kanalabeach.eus/wp-content/uploads/2024/06/kanala-logos_LOGO-HORIZONTAL-zuria.png" alt={config.name} className="h-16 sm:h-20 mx-auto object-contain mb-4 sm:mb-6" />
                ) : config.name.toLowerCase().includes('boliña') ? (
                    <img src="/logo boliña sin fondo.jfif" alt={config.name} className="h-24 sm:h-32 mx-auto object-contain mb-1 sm:mb-3 drop-shadow-md" />
                ) : (
                    <h1 className="text-4xl sm:text-6xl font-bold mb-1 sm:mb-3 tracking-tight text-slate-900 leading-tight">{config.name}</h1>
                )}
                {config.slogan && <p className="text-slate-500 italic text-[13px] sm:text-base mb-2">{config.slogan}</p>}'''
)

# 9. Fix Tabs
content = content.replace(
    '''<div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 mb-4 sm:mb-10 shadow-inner max-w-lg mx-auto">
                    {[{ id: 'menu', label: t.menuDelDia, icon: IconMenu }, { id: 'carta', label: t.carta, icon: IconBook }, { id: 'raciones', label: t.raciones, icon: IconFood }].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setView(tab.id as any)} 
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all ${view === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <tab.icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" /> <span className="whitespace-nowrap">{tab.label}</span>
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

with open('components/cliente/ClienteApp.tsx', 'w') as f:
    f.write(content)
print("Fix script completed.")
