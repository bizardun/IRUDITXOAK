import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useConfig } from '../../context/ConfigContext';
import { languages, translations } from '../../constants';
import type { Language, TipoPlato, Plato, TranslationDictionary } from '../../types';
import { IconMenu, IconBook, IconFood, IconAllergy, IconX, IconArrowDown } from '../icons';

const allergenColors: Record<string, string> = {
    GLUTEN: "bg-amber-950",           
    CRUSTACEOS: "bg-red-500",         
    HUEVOS: "bg-yellow-400",          
    PESCADO: "bg-blue-600",           
    CACAHUETES: "bg-orange-700",      
    SOJA: "bg-green-600",             
    LACTEOS: "bg-sky-300",            
    APIO: "bg-lime-500",              
    MOSTAZA: "bg-yellow-600",         
    SESAMO: "bg-stone-400",           
    SULFITOS: "bg-purple-500",        
    ALTRAMUCES: "bg-yellow-200",      
    MOLUSCOS: "bg-teal-600"           
};

interface DishItemProps {
    p: Plato;
    lang: string;
    isMenuMode: boolean;
    styles: any;
    t: TranslationDictionary;
    showAllergens: boolean;
    selectedAllergens: string[];
    isKanala?: boolean;
}

const DishItem: React.FC<DishItemProps> = ({ 
    p, 
    lang, 
    isMenuMode, 
    styles,
    t,
    showAllergens,
    selectedAllergens,
    isKanala
}) => {
    const allergensToDisplay = useMemo(() => {
        if (!p.Alergenos) return [];
        if (selectedAllergens.length > 0) {
            // Mostramos los alérgenos que coinciden con la selección para indicar por qué se descarta
            const matching = p.Alergenos.filter(a => selectedAllergens.includes(a));
            return matching.length > 0 ? matching : [];
        }
        return p.Alergenos;
    }, [p.Alergenos, selectedAllergens]);

    const isRestricted = useMemo(() => {
        if (selectedAllergens.length === 0) return false;
        return p.Alergenos?.some(a => selectedAllergens.includes(a));
    }, [p.Alergenos, selectedAllergens]);

    const name = (p as any)[`${lang}_Nombre`] || p.ES_Nombre;
    const hasAllergens = allergensToDisplay.length > 0;

    return (
        <li className={`list-none py-1 sm:py-2 border-b last:border-0 animate-fade-in ${isKanala ? 'border-white/10' : 'border-slate-50'}`}>
            <div className="flex flex-row items-center justify-between gap-4 w-full overflow-hidden">
                <div className={`flex-grow min-w-0 transition-opacity duration-300 ${isRestricted ? 'opacity-40' : ''}`}>
                    <span className={`text-[13px] sm:text-base font-medium truncate block ${isRestricted ? (isKanala ? 'text-white/40 line-through decoration-white/40' : 'text-slate-500 line-through decoration-slate-400') : (isKanala ? 'text-white' : 'text-slate-800')}`}>
                        {name}
                    </span>
                </div>

                <div className="flex flex-row items-center gap-2.5 flex-shrink-0 ml-auto">
                    {(showAllergens || isRestricted) && hasAllergens && (
                        <div className="flex flex-row items-center gap-1.5 sm:gap-2">
                            {allergensToDisplay.map((a: any) => (
                                <div 
                                    key={a} 
                                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm ${allergenColors[a] || 'bg-gray-400'} ${selectedAllergens.includes(a) ? 'ring-1 ring-slate-500 scale-110' : ''}`} 
                                    title={t.alergenos[a] || a}
                                ></div>
                            ))}
                        </div>
                    )}

                    {!isMenuMode && p.Precio > 0 && (
                        <div className={`w-12 sm:w-16 text-right flex-shrink-0 transition-opacity duration-300 ${isRestricted ? 'opacity-40' : ''}`}>
                            <span className={`text-[13px] sm:text-base font-bold whitespace-nowrap ${isKanala ? 'text-white' : 'text-slate-900'}`}>
                                €{p.Precio.toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

const ClienteApp: React.FC = () => {
    const { platos, menuPrice, loading, refreshData } = useData();
    const { config } = useConfig();
    const [lang, setLang] = useState<Language['code']>('ES');
    const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ALL' : 'menu');
    const [showAllergens, setShowAllergens] = useState(false);
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

    useEffect(() => { 
        refreshData(); 
        const interval = setInterval(() => refreshData(), 5000); 
        return () => clearInterval(interval); 
    }, [refreshData]);

    useEffect(() => { 
        if (!showAllergens) setSelectedAllergens([]); 
    }, [showAllergens]);

    useEffect(() => {
        setExpandedCats({});
    }, [view]);

    const t = translations[lang];
    const activePlatos = useMemo(() => platos.filter(p => p.Activo_Dia), [platos]);
    
    const filteredPlatos = useMemo(() => {
        // No filtramos, mostramos todo. El filtrado visual se hace en DishItem.
        return activePlatos;
    }, [activePlatos]);

    const themeStyle = config.theme?.style || 'classic';
    const styles = {
        classic: { border: 'border-amber-200', buttonActive: 'border-amber-500 ring-amber-200', gradient: 'from-amber-200 via-amber-400 to-amber-200', accent: 'text-amber-700' },
        modern: { border: 'border-blue-200', buttonActive: 'border-blue-500 ring-blue-200', gradient: 'from-blue-200 via-blue-400 to-blue-200', accent: 'text-blue-700' },
        fresh: { border: 'border-emerald-200', buttonActive: 'border-emerald-500 ring-emerald-200', gradient: 'from-emerald-200 via-emerald-400 to-emerald-200', accent: 'text-emerald-700' }
    }[themeStyle];

    // Formateador de fecha localizado
    const formattedDate = useMemo(() => {
        const now = new Date();
        const localeMap: Record<string, string> = {
            'ES': 'es-ES',
            'EU': 'eu-ES',
            'EN': 'en-GB',
            'FR': 'fr-FR',
            'DE': 'de-DE',
            'IT': 'it-IT'
        };
        return new Intl.DateTimeFormat(localeMap[lang] || 'es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(now);
    }, [lang]);

    const visibleAllergensInView = useMemo(() => {
        if (!showAllergens) return [];
        const activeSet = new Set<string>();
        let contextItems: Plato[] = [];
        if (view === 'menu') {
            contextItems = activePlatos.filter(p => p.Rol_Menu && p.Rol_Menu !== 'RACION');
        } else {
            const isRaciones = view === 'raciones';
            contextItems = activePlatos.filter(p => {
                const inCarta = p.Categoria.includes('CARTA');
            if (config.name.toLowerCase().includes('kanala')) return inCarta;
                return isRaciones ? (inCarta && p.Es_Racion) : inCarta;
            });
        }
        contextItems.forEach(p => p.Alergenos?.forEach(a => activeSet.add(a)));
        return Array.from(activeSet).sort();
    }, [activePlatos, view, showAllergens]);

    const toggleCat = (cat: string) => {
        setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const renderGroup = (items: any[], typeLabel: string, catKey: string, isMenuMode: boolean = false) => {
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
        };
        if (items.length === 0) return null;
        const isExpanded = expandedCats[catKey] ?? (isMenuMode);

        return (
            <div key={catKey} className="mb-1 sm:mb-2 overflow-hidden">
                <button 
                    onClick={() => !isMenuMode && toggleCat(catKey)}
                    className={`w-full flex items-center justify-between text-[11px] sm:text-lg font-bold py-3 sm:py-4 px-1 capitalize transition-all border-b ${hc.border} ${hc.text} ${hc.bg} ${!isMenuMode ? hc.hover : 'cursor-default'}`}
                >
                    <div className="flex items-center gap-2">
                        {!isMenuMode && <span className={`w-1.5 h-1.5 rounded-full ${themeStyle === 'modern' ? 'bg-blue-500' : themeStyle === 'fresh' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>}
                        {typeLabel}
                        {!isMenuMode && <span className="text-[9px] opacity-40 ml-1 font-medium">({items.length})</span>}
                    </div>
                    {!isMenuMode && (
                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <IconArrowDown className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-300" />
                        </div>
                    )}
                </button>
                
                <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 py-1 sm:py-2' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-0.5">
                        {items.map(p => <DishItem key={p.ID_Plato} p={p} lang={lang} isMenuMode={isMenuMode} styles={styles} t={t} showAllergens={showAllergens} selectedAllergens={selectedAllergens} isKanala={isKanala} />)}
                    </ul>
                </div>
            </div>
        );
    };

    const renderAllergenLegend = () => {
        if (!showAllergens) return null;
        const allAllergens = Object.keys(allergenColors);
        
        return (
            <div className="sticky top-[60px] sm:top-[72px] z-30 -mx-4 sm:-mx-6 mb-4 animate-fade-in">
                <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 border-b-4 border-b-slate-300 shadow-md py-2 px-4 sm:px-6">
                    <div className="max-w-5xl mx-auto flex flex-col gap-1">
                        <div className="flex justify-between items-center px-1 mb-1">
                            <p className="text-[9px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t.infoAlergenos}</p>
                            {selectedAllergens.length > 0 && (
                                <button onClick={() => setSelectedAllergens([])} className="text-[9px] bg-slate-800 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm hover:bg-slate-700 transition-colors">
                                    <IconX width={8} height={8}/> {lang === 'ES' ? 'LIMPIAR' : 'CLEAR'}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1.5 items-center">
                            {allAllergens.map(key => {
                                const isSelected = selectedAllergens.includes(key);
                                return (
                                    <button 
                                        key={key} 
                                        onClick={() => setSelectedAllergens(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
                                        className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${config.name.toLowerCase().includes('kanala') ? (isSelected ? 'bg-neutral-800 border-white shadow-sm ring-1 ring-neutral-700 z-10 text-white' : 'bg-transparent border-white/10 hover:border-white/30 text-white/60') : (isSelected ? 'bg-white border-slate-800 shadow-sm ring-1 ring-slate-200 z-10' : 'bg-white/40 border-slate-100 hover:border-slate-300')}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${allergenColors[key] || 'bg-gray-400'}`}></span>
                                        <span className={`text-[9px] font-bold uppercase whitespace-nowrap tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{t.alergenos[key] || key}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderMenu = () => {
        const menuItems = filteredPlatos.filter(p => p.Rol_Menu && p.Rol_Menu !== 'RACION');
        const grouped = { PRIMERO: [] as any[], SEGUNDO: [] as any[], POSTRE: [] as any[] };
        menuItems.forEach(p => p.Rol_Menu && grouped[p.Rol_Menu as keyof typeof grouped]?.push(p));
        return (
            <div className="animate-fade-in max-w-2xl mx-auto">
                <div className="text-center mb-6 sm:mb-10">
                    <span className={`inline-block border-y-2 py-1 px-8 text-xl sm:text-2xl font-bold ${styles.border} text-slate-800 uppercase tracking-tight`}>
                        {t.menuDelDia}
                    </span>
                </div>
                <div className="space-y-4">
                    {grouped.PRIMERO.length > 0 && renderGroup(grouped.PRIMERO, t.primerosPlatos as string, "PRIMERO", true)}
                    {grouped.SEGUNDO.length > 0 && renderGroup(grouped.SEGUNDO, t.segundosPlatos as string, "SEGUNDO", true)}
                    {grouped.POSTRE.length > 0 && renderGroup(grouped.POSTRE, t.postres as string, "POSTRE", true)}
                    {menuItems.length === 0 && selectedAllergens.length > 0 && <div className="text-center py-8 text-slate-400 italic font-bold">Sin resultados</div>}
                </div>
                <div className={`mt-8 sm:mt-12 text-center border-t ${styles.border} pt-6 sm:pt-10`}>
                    <p className="text-sm sm:text-lg text-slate-600">{t.precioPersona}</p>
                    <p className={`text-2xl sm:text-4xl font-black ${styles.accent}`}>€{menuPrice.toFixed(2)}</p>
                </div>
            </div>
        );
    };

    const renderCartaOrRaciones = () => {
        const isRaciones = view === 'raciones';
        const filtered = filteredPlatos.filter(p => {
            const inCarta = p.Categoria.includes('CARTA');
            if (config.name.toLowerCase().includes('kanala')) return inCarta;
            if (isRaciones) return inCarta && p.Es_Racion;
            return inCarta;
        });
        const groups: Record<string, any[]> = {};
        filtered.forEach(p => {
            const k = p.Tipo || 'OTROS';
            if (!groups[k]) groups[k] = [];
            groups[k].push(p);
        });
        const order: TipoPlato[] = ['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'];
        const sortedKeys = Object.keys(groups).sort((a, b) => {
            const ia = order.indexOf(a as TipoPlato);
            const ib = order.indexOf(b as TipoPlato);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });
        if (filtered.length === 0 && selectedAllergens.length > 0) return <div className="text-center py-8 text-slate-400 italic font-bold uppercase">Sin resultados</div>;
        
        return (
            <div className="animate-fade-in max-w-3xl mx-auto space-y-0.5">
                {sortedKeys.map(k => renderGroup(groups[k], (t.tipos as any)[k] || k, k, false))}
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Cargando...</div>;

    return (
        <div className={`min-h-screen pb-16 px-4 sm:px-6 max-w-5xl mx-auto transition-colors duration-500 ${config.name.toLowerCase().includes('kanala') ? 'bg-black text-white' : ''}`}>
            {config.name.toLowerCase().includes('kanala') && <style>{`body { background-color: black; }`}</style>}
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
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-slate-200 pb-1">
                        {formattedDate}
                    </p>
                </div>

                <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-10 overflow-x-auto no-scrollbar py-1">
                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 w-9 h-6 sm:w-12 sm:h-8 rounded-lg border-2 transition-all ${lang === l.code ? `${styles.buttonActive} scale-110 shadow-md` : 'border-transparent opacity-40 hover:opacity-100'}`}
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
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] sm:text-sm font-bold transition-all ${view === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <tab.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex justify-center mb-1">
                    <button onClick={() => setShowAllergens(!showAllergens)} className={`text-[11px] sm:text-sm font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-sm border transition-all ${showAllergens ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                        <IconAllergy className="w-4 h-4 sm:w-6 sm:h-6" /> {showAllergens ? t.ocultarAlergenos : t.mostrarAlergenos}
                    </button>
                </div>
            </header>

            {renderAllergenLegend()}

            <main className={`p-3 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border relative min-h-[500px] ${config.name.toLowerCase().includes('kanala') ? 'bg-neutral-900 border-white/10' : 'bg-white border-slate-100'}`}>
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${styles.gradient} opacity-50`}></div>
                {(!config.name.toLowerCase().includes('kanala') && view === 'menu') ? renderMenu() : renderCartaOrRaciones()}
                <footer className={`mt-12 sm:mt-20 pt-6 border-t text-center text-[11px] sm:text-[12px] uppercase tracking-widest font-black ${config.name.toLowerCase().includes('kanala') ? 'border-white/10 text-white/20' : 'border-slate-50 text-slate-200'}`}>
                    I.V.A. INCLUIDO • DATOS EN TIEMPO REAL
                </footer>
            </main>
        </div>
    );
};
export default ClienteApp;
