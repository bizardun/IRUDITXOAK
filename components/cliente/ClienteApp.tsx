
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useConfig } from '../../context/ConfigContext';
import { languages, translations } from '../../constants';
import type { Language, TipoPlato, Plato, TranslationDictionary } from '../../types';
import { IconMenu, IconBook, IconFood, IconAllergy, IconX } from '../icons';

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
    selectedAllergen: string | null;
}

const DishItem: React.FC<DishItemProps> = ({ 
    p, 
    lang, 
    isMenuMode, 
    styles,
    t,
    showAllergens,
    selectedAllergen
}) => {
    const allergensToDisplay = useMemo(() => {
        if (!p.Alergenos) return [];
        if (selectedAllergen) {
            return p.Alergenos.includes(selectedAllergen as any) ? [selectedAllergen] : [];
        }
        return p.Alergenos;
    }, [p.Alergenos, selectedAllergen]);

    const name = (p as any)[`${lang}_Nombre`] || p.ES_Nombre;
    const hasAllergens = allergensToDisplay.length > 0;

    return (
        <li className="list-none py-1.5 sm:py-2 border-b border-slate-50 last:border-0 animate-fade-in">
            <div className="flex flex-row items-center justify-between gap-4 w-full overflow-hidden">
                {/* Nombre del plato: UNA SOLA LÍNEA con truncado estricto */}
                <div className="flex-grow min-w-0">
                    <span className="text-[13px] sm:text-base font-medium text-slate-800 truncate block">
                        {name}
                    </span>
                </div>

                {/* Bloque Derecha: Alérgenos + Precio en la misma línea */}
                <div className="flex flex-row items-center gap-2.5 flex-shrink-0 ml-auto">
                    {showAllergens && hasAllergens && (
                        <div className="flex flex-row items-center gap-0.5">
                            {allergensToDisplay.map((a: any) => (
                                <div 
                                    key={a} 
                                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-sm ring-1 ring-white/50 ${allergenColors[a] || 'bg-gray-400'} ${selectedAllergen === a ? 'ring-2 ring-slate-800 scale-110' : ''}`} 
                                    title={t.alergenos[a] || a}
                                ></div>
                            ))}
                        </div>
                    )}

                    {!isMenuMode && p.Precio > 0 && (
                        <div className="w-12 sm:w-16 text-right flex-shrink-0">
                            <span className="text-[13px] sm:text-base font-bold text-slate-900 whitespace-nowrap">
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
    const [view, setView] = useState<'menu' | 'carta' | 'raciones'>('menu');
    const [showAllergens, setShowAllergens] = useState(false);
    const [selectedAllergen, setSelectedAllergen] = useState<string | null>(null);

    useEffect(() => { 
        refreshData(); 
        const interval = setInterval(() => refreshData(), 5000); 
        return () => clearInterval(interval); 
    }, [refreshData]);

    useEffect(() => { 
        if (!showAllergens) setSelectedAllergen(null); 
    }, [showAllergens]);

    const t = translations[lang];
    const activePlatos = useMemo(() => platos.filter(p => p.Activo_Dia), [platos]);
    
    const filteredPlatos = useMemo(() => {
        if (!selectedAllergen) return activePlatos;
        return activePlatos.filter(p => p.Alergenos && p.Alergenos.includes(selectedAllergen as any));
    }, [activePlatos, selectedAllergen]);

    const themeStyle = config.theme?.style || 'classic';
    const styles = {
        classic: { border: 'border-amber-200', buttonActive: 'border-amber-500 ring-amber-200', gradient: 'from-amber-200 via-amber-400 to-amber-200', accent: 'text-amber-700' },
        modern: { border: 'border-blue-200', buttonActive: 'border-blue-500 ring-blue-200', gradient: 'from-blue-200 via-blue-400 to-blue-200', accent: 'text-blue-700' },
        fresh: { border: 'border-emerald-200', buttonActive: 'border-emerald-500 ring-emerald-200', gradient: 'from-emerald-200 via-emerald-400 to-emerald-200', accent: 'text-emerald-700' }
    }[themeStyle];

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
                return isRaciones ? (inCarta && p.Es_Racion) : inCarta;
            });
        }
        contextItems.forEach(p => p.Alergenos?.forEach(a => activeSet.add(a)));
        return Array.from(activeSet).sort();
    }, [activePlatos, view, showAllergens]);

    const renderGroup = (items: any[], typeLabel: string, isMenuMode: boolean = false) => {
        if (items.length === 0) return null;
        return (
            <div key={typeLabel} className="mb-8 sm:mb-12">
                <h3 className={`text-[11px] sm:text-lg font-bold mb-3 sm:mb-4 capitalize flex items-center gap-2 ${isMenuMode ? 'justify-center opacity-80' : `border-b ${styles.border} pb-1.5`}`}>
                    {!isMenuMode && <span className={`w-1.5 h-1.5 rounded-full ${themeStyle === 'modern' ? 'bg-blue-500' : themeStyle === 'fresh' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>}
                    {typeLabel}
                </h3>
                <ul className="space-y-0.5 sm:space-y-1">
                    {items.map(p => <DishItem key={p.ID_Plato} p={p} lang={lang} isMenuMode={isMenuMode} styles={styles} t={t} showAllergens={showAllergens} selectedAllergen={selectedAllergen} />)}
                </ul>
            </div>
        );
    };

    const renderAllergenLegend = () => {
        if (!showAllergens || visibleAllergensInView.length === 0) return null;
        return (
            <div className="mt-4 px-1 max-w-2xl mx-auto animate-fade-in bg-white/90 rounded-2xl p-2.5 border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-2 px-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.infoAlergenos}</p>
                    {selectedAllergen && (
                        <button onClick={() => setSelectedAllergen(null)} className="text-[8px] bg-slate-800 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                            <IconX width={7} height={7}/> {lang === 'ES' ? 'LIMPIAR FILTRO' : 'CLEAR FILTER'}
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-1.5">
                    {visibleAllergensInView.map(key => {
                        const isSelected = selectedAllergen === key;
                        return (
                            <button 
                                key={key} 
                                onClick={() => setSelectedAllergen(isSelected ? null : key)}
                                className={`flex items-center gap-1.5 transition-all duration-200 rounded-full px-2 py-0.5 border ${isSelected ? 'bg-white border-slate-400 shadow-sm scale-105 z-10' : 'bg-white/40 border-slate-100'}`}
                            >
                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${allergenColors[key] || 'bg-gray-400'} shadow-sm`}></span>
                                <span className={`text-[8px] font-bold uppercase whitespace-nowrap tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{t.alergenos[key] || key}</span>
                            </button>
                        );
                    })}
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
                <div className="text-center mb-8 sm:mb-12">
                    <span className={`inline-block border-y-2 py-1.5 px-10 text-xl sm:text-2xl font-bold ${styles.border} text-slate-800 uppercase tracking-tight`}>
                        {t.menuDelDia}
                    </span>
                </div>
                <div className="space-y-6 sm:space-y-10">
                    {grouped.PRIMERO.length > 0 && renderGroup(grouped.PRIMERO, t.primerosPlatos as string, true)}
                    {grouped.SEGUNDO.length > 0 && renderGroup(grouped.SEGUNDO, t.segundosPlatos as string, true)}
                    {grouped.POSTRE.length > 0 && renderGroup(grouped.POSTRE, t.postres as string, true)}
                    {menuItems.length === 0 && selectedAllergen && <div className="text-center py-12 text-slate-400 italic font-bold">Sin resultados para este filtro</div>}
                </div>
                <div className={`mt-12 sm:mt-16 text-center border-t ${styles.border} pt-8 sm:pt-10`}>
                    <p className="text-sm sm:text-lg text-slate-600">{t.precioPersona}</p>
                    <p className={`text-3xl sm:text-4xl font-black ${styles.accent}`}>€{menuPrice.toFixed(2)}</p>
                </div>
            </div>
        );
    };

    const renderCartaOrRaciones = () => {
        const isRaciones = view === 'raciones';
        const filtered = filteredPlatos.filter(p => {
            const inCarta = p.Categoria.includes('CARTA');
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
        if (filtered.length === 0 && selectedAllergen) return <div className="text-center py-12 text-slate-400 italic font-bold uppercase">No hay platos disponibles</div>;
        
        return (
            <div className="animate-fade-in max-w-3xl mx-auto space-y-4">
                {sortedKeys.map(k => renderGroup(groups[k], (t.tipos as any)[k] || k, false))}
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Cargando experiencia gastronómica...</div>;

    return (
        <div className="min-h-screen pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
            <header className="pt-10 sm:pt-12 pb-10 sm:pb-12 text-center">
                <h1 className="text-4xl sm:text-6xl font-bold mb-2 sm:mb-3 tracking-tight text-slate-900 leading-tight">{config.name}</h1>
                {config.slogan && <p className="text-slate-500 italic text-[12px] sm:text-base mb-10 sm:mb-12">{config.slogan}</p>}
                
                <div className="flex justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 overflow-x-auto no-scrollbar py-2">
                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 w-12 h-8 rounded-lg border-2 transition-all ${lang === l.code ? `${styles.buttonActive} scale-110 shadow-md` : 'border-transparent opacity-40 hover:opacity-100'}`}
                        >
                            <l.flag />
                        </button>
                    ))}
                </div>

                <div className="bg-slate-100/80 p-1.5 rounded-2xl flex gap-1 mb-10 sm:mb-12 shadow-inner max-w-lg mx-auto">
                    {[{ id: 'menu', label: t.menuDelDia, icon: IconMenu }, { id: 'carta', label: t.carta, icon: IconBook }, { id: 'raciones', label: t.raciones, icon: IconFood }].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setView(tab.id as any)} 
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${view === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <tab.icon className="w-4.5 h-4.5" /> <span className="whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button onClick={() => setShowAllergens(!showAllergens)} className={`text-xs sm:text-sm font-bold px-8 py-3 rounded-full flex items-center gap-2.5 shadow-sm border transition-all ${showAllergens ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                        <IconAllergy className="w-5 h-5 sm:w-6 sm:h-6" /> {showAllergens ? t.ocultarAlergenos : t.mostrarAlergenos}
                    </button>
                </div>
                {renderAllergenLegend()}
            </header>

            <main className="bg-white p-6 sm:p-16 rounded-[2.5rem] shadow-2xl border border-slate-100 relative min-h-[600px]">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${styles.gradient} opacity-50`}></div>
                {view === 'menu' ? renderMenu() : renderCartaOrRaciones()}
                <footer className="mt-20 sm:mt-24 pt-10 sm:pt-12 border-t border-slate-50 text-center text-[10px] sm:text-[12px] text-slate-200 uppercase tracking-widest font-black">
                    Servicio con I.V.A. INCLUIDO • DATOS EN TIEMPO REAL
                </footer>
            </main>
        </div>
    );
};
export default ClienteApp;
