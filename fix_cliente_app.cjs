const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

// I know that the corruption started precisely at:
// className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${config.name.toLowerCase().includes('kanala') ? null : (

// The original line was:
const goodAllergenClass = "className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${config.name.toLowerCase().includes('kanala') ? (isSelected ? 'bg-neutral-800 border-white shadow-sm ring-1 ring-neutral-700 z-10 text-white' : 'bg-transparent border-white/10 hover:border-white/30 text-white/60') : (isSelected ? 'bg-white border-slate-800 shadow-sm ring-1 ring-slate-200 z-10' : 'bg-white/40 border-slate-100 hover:border-slate-300')}`}";

const corruptedStart = "className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${config.name.toLowerCase().includes('kanala') ? null : (";

const exactCorruptedString = `className={\`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border \${config.name.toLowerCase().includes('kanala') ? null : (
                    <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 mb-4 sm:mb-10 shadow-inner max-w-lg mx-auto">
                        {[{ id: 'menu', label: t.menuDelDia, icon: IconMenu }, { id: 'carta', label: t.carta, icon: IconBook }, { id: 'raciones', label: t.raciones, icon: IconFood }].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setView(tab.id as any)} 
                                className={\`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] sm:text-sm font-bold transition-all \${view === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                            >
                                <tab.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex justify-center mb-1">`;

const fixedString = goodAllergenClass + `>
                                        <span className={\`w-2 h-2 rounded-full flex-shrink-0 \${allergenColors[key] || 'bg-gray-400'}\`}></span>
                                        <span className={\`text-[9px] font-bold uppercase tracking-wide \${isSelected ? (config.name.toLowerCase().includes('kanala') ? 'text-white' : 'text-slate-900') : 'text-slate-500'}\`}>
                                            {(t.alergenos as any)[key] || key}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Cargando Carta...</div>;

    return (
        <div className={\`min-h-screen pb-16 px-4 sm:px-6 max-w-5xl mx-auto transition-colors duration-500 \${config.name.toLowerCase().includes('kanala') ? 'bg-black text-white' : ''}\`}>
            {config.name.toLowerCase().includes('kanala') && <style>{\`body { background-color: black; }\`}</style>}
            <header className="pt-6 sm:pt-10 pb-4 text-center">
                {config.name.toLowerCase().includes('kanala') ? (
                    <img src="https://www.kanalabeach.eus/wp-content/uploads/2024/06/kanala-logos_LOGO-HORIZONTAL-zuria.png" alt={config.name} className="h-16 sm:h-20 mx-auto object-contain mb-4 sm:mb-6" />
                ) : config.name.toLowerCase().includes('boliña') ? (
                    <img src="/logo boliña sin fondo.jfif" alt={config.name} className="h-24 sm:h-32 mx-auto object-contain mb-1 sm:mb-3 drop-shadow-md" />
                ) : (
                    <h1 className="text-4xl sm:text-6xl font-bold mb-1 sm:mb-3 tracking-tight text-slate-900 leading-tight">{config.name}</h1>
                )}
                {config.slogan && <p className="text-slate-500 italic text-[13px] sm:text-base mb-2">{config.slogan}</p>}
                
                {/* Fecha Actual Localizada */}
                <div className="flex items-center justify-center gap-2 mb-4 sm:mb-8 opacity-60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[12px] sm:text-sm font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-slate-200 pb-1">
                        {formattedDate}
                    </p>
                </div>

                <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-10 overflow-x-auto no-scrollbar py-1">
                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={\`flex-shrink-0 w-9 h-6 sm:w-12 sm:h-8 rounded-lg border-2 transition-all \${lang === l.code ? \`\${styles.buttonActive} scale-110 shadow-md\` : 'border-transparent opacity-40 hover:opacity-100'}\`}
                        >
                            <l.flag />
                        </button>
                    ))}
                </div>

                {config.name.toLowerCase().includes('kanala') ? null : (
                    <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 mb-4 sm:mb-10 shadow-inner max-w-lg mx-auto">
                        {[{ id: 'menu', label: t.menuDelDia, icon: IconMenu }, { id: 'carta', label: t.carta, icon: IconBook }, { id: 'raciones', label: t.raciones, icon: IconFood }].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setView(tab.id as any)} 
                                className={\`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] sm:text-sm font-bold transition-all \${view === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                            >
                                <tab.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex justify-center mb-1">`;

content = content.replace(exactCorruptedString, fixedString);
fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
console.log("Restored App!");
