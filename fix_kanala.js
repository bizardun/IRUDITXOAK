const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

// Fix Logo logic
const badLogoString = `<header className="pt-6 sm:pt-10 pb-4 text-center">
                <h1 className="text-3xl sm:text-6xl font-bold mb-1 sm:mb-3 tracking-tight text-slate-900 leading-tight">{config.name}</h1>
                {config.slogan && <p className="text-slate-500 italic text-[11px] sm:text-base mb-2">{config.slogan}</p>}`;

const goodLogoString = `<header className="pt-6 sm:pt-10 pb-4 text-center">
                {config.name.toLowerCase().includes('kanala') ? (
                    <img src="https://www.kanalabeach.eus/wp-content/uploads/2024/06/kanala-logos_LOGO-HORIZONTAL-zuria.png" alt={config.name} className="h-16 sm:h-20 mx-auto object-contain mb-4 sm:mb-6" />
                ) : config.name.toLowerCase().includes('boliña') ? (
                    <img src="/logo boliña sin fondo.jfif" alt={config.name} className="h-24 sm:h-32 mx-auto object-contain mb-1 sm:mb-3 drop-shadow-md" />
                ) : (
                    <h1 className="text-4xl sm:text-6xl font-bold mb-1 sm:mb-3 tracking-tight text-slate-900 leading-tight">{config.name}</h1>
                )}
                {config.slogan && <p className="text-slate-500 italic text-[13px] sm:text-base mb-2">{config.slogan}</p>}`;

content = content.replace(badLogoString, goodLogoString);

// Fix Tabs logic
const badTabsString = `<div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 mb-4 sm:mb-10 shadow-inner max-w-lg mx-auto">
                    {[{ id: 'menu', label: t.menuDelDia, icon: IconMenu }, { id: 'carta', label: t.carta, icon: IconBook }, { id: 'raciones', label: t.raciones, icon: IconFood }].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setView(tab.id as any)} 
                            className={\`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all \${view === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                        >
                            <tab.icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" /> <span className="whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>`;

const goodTabsString = `{config.name.toLowerCase().includes('kanala') ? null : (
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
                )}`;

content = content.replace(badTabsString, goodTabsString);

// Also need to check if hover states in DishItem for Kanala are ok
// And group headers hover state

fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
console.log('App fixed');
