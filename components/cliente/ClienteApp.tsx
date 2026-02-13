
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useConfig } from '../../context/ConfigContext';
import { languages, translations } from '../../constants';
import type { Language, TipoPlato, Plato, Alergeno, TranslationDictionary } from '../../types';
import { IconMenu, IconBook, IconFood, IconAllergy } from '../icons';

// Mapeo de colores para los círculos
const allergenColors: Record<string, string> = {
    GLUTEN: "bg-amber-950",           // Trigo/Pan (Marrón muy oscuro para diferenciar)
    CRUSTACEOS: "bg-red-500",         // Rojo intenso
    HUEVOS: "bg-yellow-400",          // Yema
    PESCADO: "bg-blue-600",           // Mar azul oscuro
    CACAHUETES: "bg-orange-700",      // Marrón cacahuete
    SOJA: "bg-green-600",             // Verde soja
    LACTEOS: "bg-sky-300",            // Azul leche/cielo
    APIO: "bg-lime-500",              // Verde apio
    MOSTAZA: "bg-yellow-600",         // Mostaza oscuro
    SESAMO: "bg-stone-400",           // Gris semilla
    SULFITOS: "bg-purple-500",        // Vino
    ALTRAMUCES: "bg-yellow-200",      // Amarillo pálido
    MOLUSCOS: "bg-teal-600"           // Teal oscuro (antes rosa) para diferenciar de crustáceos
};

interface DishItemProps {
    p: Plato;
    lang: string;
    isMenuMode: boolean;
    styles: any;
    t: TranslationDictionary;
    showAllergens: boolean; // Prop para controlar visibilidad
}

// Sub-componente para mostrar los círculos de colores
const DishItem: React.FC<DishItemProps> = ({ 
    p, 
    lang, 
    isMenuMode, 
    styles,
    t,
    showAllergens
}) => {
    const hasAllergens = p.Alergenos && p.Alergenos.length > 0;

    return (
        <li className="group relative">
            <div className={`flex items-start justify-between gap-2 ${isMenuMode ? 'flex-col sm:flex-row sm:items-center' : ''}`}>
                
                {/* Nombre del Plato */}
                <div className={`flex-grow min-w-0 ${isMenuMode ? 'w-full text-center sm:text-left' : ''}`}>
                    <span className="leading-tight font-medium break-words">
                        {(p as any)[`${lang}_Nombre`] || p.ES_Nombre}
                    </span>
                </div>

                {/* Contenedor Derecho: Línea punteada (solo carta), Alérgenos y Precio */}
                <div className={`flex items-center gap-3 flex-shrink-0 ${isMenuMode ? 'w-full justify-center sm:w-auto sm:justify-end mt-1 sm:mt-0' : 'justify-end'}`}>
                    
                    {!isMenuMode && (
                        <div className="hidden sm:block flex-grow w-8 border-b border-dotted border-slate-300 opacity-30 mx-1"></div>
                    )}

                    {/* SECCIÓN ALÉRGENOS (Círculos de Colores) - VISIBILIDAD CONDICIONAL */}
                    {showAllergens && hasAllergens && (
                        <div className="flex items-center gap-1.5 animate-fade-in">
                            {p.Alergenos.map((a: any) => (
                                <div 
                                    key={a} 
                                    className={`w-3 h-3 rounded-full shadow-sm ring-1 ring-white/50 ${allergenColors[a] || 'bg-gray-400'}`} 
                                    title={t.alergenos[a] || a}
                                ></div>
                            ))}
                        </div>
                    )}

                    {/* Precio */}
                    {!isMenuMode && p.Precio > 0 && (
                        <span className="font-bold whitespace-nowrap text-base ml-6">
                            €{p.Precio.toFixed(2)}
                        </span>
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
    
    // Estado para mostrar/ocultar alérgenos (Por defecto False)
    const [showAllergens, setShowAllergens] = useState(false);

    useEffect(() => {
        refreshData();
        const interval = setInterval(() => {
            refreshData();
        }, 2000);
        return () => clearInterval(interval);
    }, [refreshData]);

    const t = translations[lang];
    const activePlatos = useMemo(() => platos.filter(p => p.Activo_Dia), [platos]);
    
    // Dynamic Styles based on Theme
    const themeStyle = config.theme?.style || 'classic';
    const styles = {
        classic: {
            accent: 'text-amber-700',
            bgAccent: 'bg-amber-50',
            border: 'border-amber-200',
            buttonActive: 'border-amber-500 ring-amber-200',
            badge: 'bg-amber-100 text-amber-800 border-amber-200',
            gradient: 'from-amber-200 via-amber-400 to-amber-200'
        },
        modern: {
            accent: 'text-blue-700',
            bgAccent: 'bg-blue-50',
            border: 'border-blue-200',
            buttonActive: 'border-blue-500 ring-blue-200',
            badge: 'bg-blue-100 text-blue-800 border-blue-200',
            gradient: 'from-blue-200 via-blue-400 to-blue-200'
        },
        fresh: {
            accent: 'text-emerald-700',
            bgAccent: 'bg-emerald-50',
            border: 'border-emerald-200',
            buttonActive: 'border-emerald-500 ring-emerald-200',
            badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            gradient: 'from-emerald-200 via-emerald-400 to-emerald-200'
        }
    }[themeStyle];

    const renderGroup = (items: any[], typeLabel: string, isMenuMode: boolean = false) => {
        if (items.length === 0) return null;
        return (
            <div key={typeLabel} className="mb-6 break-inside-avoid">
                <h3 className={`text-lg font-bold mb-3 capitalize flex items-center gap-2 ${isMenuMode ? 'justify-center' : `border-b ${styles.border} pb-0.5`}`}>
                    {!isMenuMode && <span className={`w-1.5 h-1.5 rounded-full ${themeStyle === 'modern' ? 'bg-blue-500' : themeStyle === 'fresh' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>}
                    {isMenuMode ? <span className="opacity-80">— {typeLabel} —</span> : typeLabel}
                </h3>
                <ul className="space-y-4 px-1">
                    {items.map(p => (
                        <DishItem 
                            key={p.ID_Plato} 
                            p={p} 
                            lang={lang} 
                            isMenuMode={isMenuMode} 
                            styles={styles} 
                            t={t}
                            showAllergens={showAllergens}
                        />
                    ))}
                </ul>
            </div>
        );
    };

    // Calcular qué alérgenos están presentes en los platos VISIBLES actualmente
    const visibleAllergens = useMemo(() => {
        if (!showAllergens) return []; // Si está oculto, no calculamos nada

        const activeSet = new Set<string>();
        let currentItems: Plato[] = [];

        if (view === 'menu') {
            currentItems = activePlatos.filter(p => p.Rol_Menu && p.Rol_Menu !== 'RACION');
        } else {
            const isRaciones = view === 'raciones';
            currentItems = activePlatos.filter(p => {
                const inCarta = p.Categoria.includes('CARTA');
                return isRaciones ? (inCarta && p.Es_Racion) : inCarta;
            });
        }

        currentItems.forEach(p => {
            if (p.Alergenos) {
                p.Alergenos.forEach(a => activeSet.add(a));
            }
        });

        return Array.from(activeSet).sort();
    }, [activePlatos, view, showAllergens]);

    const renderAllergenLegend = () => {
        if (!showAllergens || visibleAllergens.length === 0) return null;

        return (
            <div className="mt-4 px-2 max-w-3xl mx-auto animate-fade-in bg-white/50 rounded-lg p-2 border border-slate-100/50">
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.infoAlergenos}</p>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 py-2">
                    {visibleAllergens.map(key => (
                        <div key={key} className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full ${allergenColors[key] || 'bg-gray-400'} shadow-sm ring-1 ring-black/5`}></span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{t.alergenos[key] || key}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderMenu = () => {
        const menuItems = activePlatos.filter(p => p.Rol_Menu && p.Rol_Menu !== 'RACION');
        
        const grouped = { PRIMERO: [] as any[], SEGUNDO: [] as any[], POSTRE: [] as any[] };
        menuItems.forEach(p => p.Rol_Menu && grouped[p.Rol_Menu as keyof typeof grouped]?.push(p));

        return (
            <div className="animate-fade-in">
                <div className="text-center mb-6 relative">
                    <span className={`bg-white px-6 py-1 text-2xl font-bold border-y-2 shadow-sm ${styles.border}`}>{t.menuDelDia}</span>
                </div>
                <div className="space-y-6">
                    {grouped.PRIMERO.length > 0 && renderGroup(grouped.PRIMERO, t.primerosPlatos as string, true)}
                    {grouped.SEGUNDO.length > 0 && renderGroup(grouped.SEGUNDO, t.segundosPlatos as string, true)}
                    {grouped.POSTRE.length > 0 && renderGroup(grouped.POSTRE, t.postres as string, true)}
                </div>
                
                <div className={`mt-10 text-center border-t ${styles.border} pt-6 mb-2`}>
                    <p className="text-lg">
                        {t.precioPersona}: <span className={`font-bold text-xl ${styles.accent}`}>€{menuPrice.toFixed(2)}</span>
                    </p>
                </div>
            </div>
        );
    };

    const renderCartaOrRaciones = () => {
        const isRaciones = view === 'raciones';
        const filtered = activePlatos.filter(p => {
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

        return (
            <div className="animate-fade-in columns-1 md:columns-2 gap-8 space-y-6">
                {sortedKeys.map(k => renderGroup(groups[k], (t.tipos as any)[k] || k, false))}
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Cargando...</div>;

    return (
        <div className="min-h-screen pb-12 px-2 sm:px-4">
            <header className="pt-6 pb-4 text-center">
                <h1 className="text-3xl font-bold mb-2">{config.name}</h1>
                {config.slogan && <p className="text-slate-500 italic text-sm mb-6">{config.slogan}</p>}
                
                <div className="max-w-md mx-auto flex gap-2 mb-4 px-1 w-full">
                    {languages.map(l => (
                        <button key={l.code} onClick={() => setLang(l.code)} 
                            className={`flex-1 aspect-[3/2] flex items-center justify-center p-0.5 rounded-lg border-2 transition-all duration-200 ${lang === l.code ? `${styles.buttonActive} scale-110 z-10 shadow-md bg-white` : 'border-transparent bg-slate-100/50 opacity-70 hover:opacity-100 hover:bg-white hover:scale-105 hover:shadow-sm'}`}
                            title={l.name}
                        >
                            <l.flag />
                        </button>
                    ))}
                </div>

                <div className="max-w-md mx-auto bg-slate-100/80 p-1 rounded-xl flex gap-1 overflow-x-auto no-scrollbar whitespace-nowrap shadow-inner border border-slate-200/60 mb-4">
                    {[
                        { id: 'menu', label: t.menuDelDia, icon: IconMenu },
                        { id: 'carta', label: t.carta, icon: IconBook },
                        { id: 'raciones', label: t.raciones, icon: IconFood }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setView(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${view === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            <tab.icon /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* BOTÓN TOGGLE ALÉRGENOS */}
                <div className="flex justify-center mb-2">
                    <button 
                        onClick={() => setShowAllergens(!showAllergens)}
                        className={`
                            text-sm sm:text-base font-bold px-5 py-2 rounded-full flex items-center gap-2 transition-all shadow-sm border
                            ${showAllergens 
                                ? 'bg-slate-700 text-white border-slate-700' 
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                            }
                        `}
                    >
                        <IconAllergy className="w-[22px] h-[22px]" />
                        {showAllergens ? t.ocultarAlergenos : t.mostrarAlergenos}
                    </button>
                </div>

                {/* LEYENDA DE ALÉRGENOS - AHORA CONDICIONAL */}
                {renderAllergenLegend()}
            </header>

            <main className="max-w-3xl mx-auto bg-white min-h-[60vh] p-4 sm:p-8 rounded-2xl shadow-xl border border-slate-100/50 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${styles.gradient} opacity-60`}></div>
                
                {view === 'menu' ? renderMenu() : renderCartaOrRaciones()}

                <footer className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 italic">
                    Precios con IVA incluido
                </footer>
            </main>
        </div>
    );
};

export default ClienteApp;
