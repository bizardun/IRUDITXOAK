
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { translations } from '../../constants';
import { IconChevronLeft, IconPlus, IconEdit, IconSort, IconArrowDown, IconAllergy, IconX } from '../icons';
import { Switch } from '../ui/Switch';
import { EditablePrice } from '../ui/EditablePrice';
import api from '../../services/api';
import AddPlatoModal from './AddPlatoModal';
import type { Plato, TipoPlato } from '../../types';

const allergenColors: Record<string, string> = {
    GLUTEN: "bg-amber-950",           
    LACTEOS: "bg-sky-300",            
    HUEVOS: "bg-yellow-300",          
    PESCADO: "bg-blue-600",           
    MARISCO: "bg-fuchsia-500",          
    CRUSTACEOS: "bg-red-600",         
    MOLUSCOS: "bg-cyan-500",          
    SOJA: "bg-emerald-600",           
    CACAHUETES: "bg-orange-500",      
    MOSTAZA: "bg-amber-500",          
    SESAMO: "bg-stone-500",           
    SULFITOS: "bg-purple-600",        
    APIO: "bg-lime-500",              
    ALTRAMUCES: "bg-zinc-300",        
    CALAMARES: "bg-indigo-500"        
};

const GestionCategoria: React.FC<{ mode: 'menu' | 'carta' | 'raciones'; setView: (v: any) => void }> = ({ mode, setView }) => {
    const { platos, menuPrice, refreshData, updateLocalPlato, reorderPlatos } = useData();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlato, setEditingPlato] = useState<Plato | null>(null);
    const [saving, setSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [draggedItem, setDraggedItem] = useState<Plato | null>(null);
    const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
    const [showAllergens, setShowAllergens] = useState(false);
    const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
    const [confirmReanalyze, setConfirmReanalyze] = useState(false);
    const [isReanalyzing, setIsReanalyzing] = useState(false);
    const [reanalyzeProgress, setReanalyzeProgress] = useState(0);
    
    const t = translations.ES;

    const handleReanalyzeAllergens = async () => {
        if (!confirmReanalyze) {
            setConfirmReanalyze(true);
            setTimeout(() => setConfirmReanalyze(false), 3000);
            return;
        }
        
        setIsReanalyzing(true);
        setReanalyzeProgress(0);
        try {
            let count = 0;
            const concurrencyLimit = 5;
            
            for (let i = 0; i < platos.length; i += concurrencyLimit) {
                const chunk = platos.slice(i, i + concurrencyLimit);
                await Promise.all(chunk.map(async (plato) => {
                    try {
                        const analysis = await api.analyzeDish(plato.ES_Nombre);
                        if (analysis.allergens) {
                            await api.updatePlato(plato.ID_Plato, { Alergenos: analysis.allergens });
                        }
                    } catch (err) {
                        console.error("Error analizando:", plato.ES_Nombre, err);
                    }
                    count++;
                }));
                setReanalyzeProgress(Math.round((count / platos.length) * 100));
            }
            
            await refreshData();
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsReanalyzing(false);
            setConfirmReanalyze(false);
        }
    };

    useEffect(() => { 
        if (!showAllergens) setSelectedAllergens([]); 
    }, [showAllergens]);

    const groupedPlatos = useMemo(() => {
        const groups: Record<string, any[]> = {};
        const filtered = platos.filter(p => {
            if (mode === 'menu') {
                return p.Rol_Menu === 'PRIMERO' || p.Rol_Menu === 'SEGUNDO' || p.Rol_Menu === 'POSTRE';
            }
            return p.Categoria.includes('CARTA');
        });
        filtered.forEach(p => {
            const k = mode === 'menu' ? (p.Rol_Menu && p.Rol_Menu !== 'NO' ? p.Rol_Menu : (p.Tipo || 'OTROS')) : (p.Tipo || 'OTROS');
            if (!groups[k]) groups[k] = [];
            groups[k].push(p);
        });
        return groups;
    }, [platos, mode]);

    const sortedKeys = useMemo(() => {
        const order = ['PRIMERO', 'SEGUNDO', 'ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'];
        return Object.keys(groupedPlatos).sort((a, b) => {
            const ia = order.indexOf(a);
            const ib = order.indexOf(b);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });
    }, [groupedPlatos]);
    
    const toggleCat = (cat: string) => {
        setExpandedCats(prev => {
            const current = prev[cat] ?? true;
            return { ...prev, [cat]: !current };
        });
    };

    const toggleAll = (expand: boolean) => {
        const newState: Record<string, boolean> = {};
        sortedKeys.forEach(k => newState[k] = expand);
        setExpandedCats(newState);
    };

    const handleToggle = async (id: number, current: boolean) => {
        updateLocalPlato(id, { Activo_Dia: !current }); 
        await api.updatePlato(id, { Activo_Dia: !current });
        refreshData(); 
    };

    const handleRacionToggle = async (id: number, current: boolean) => {
        updateLocalPlato(id, { Es_Racion: !current }); 
        await api.updatePlato(id, { Es_Racion: !current });
        refreshData(); 
    };

    const handleRolChange = async (id: number, val: string) => {
        await api.updatePlato(id, { Rol_Menu: val === 'NO' ? null : val as any });
        refreshData();
    };

    const handleManualSave = async () => {
        setSaving(true);
        await refreshData();
        setTimeout(() => {
            setSaving(false);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 3000);
        }, 600);
    };

    const handleDragStart = (e: React.DragEvent, item: Plato) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        const ghost = document.createElement('div');
        ghost.textContent = item.ES_Nombre;
        ghost.style.position = 'absolute';
        ghost.style.top = '-1000px';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, targetItem: Plato) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.ID_Plato === targetItem.ID_Plato) return;

        const currentIndex = platos.findIndex(p => p.ID_Plato === draggedItem.ID_Plato);
        const targetIndex = platos.findIndex(p => p.ID_Plato === targetItem.ID_Plato);

        if (currentIndex === -1 || targetIndex === -1) return;

        const newPlatos = [...platos];
        const [removed] = newPlatos.splice(currentIndex, 1);
        newPlatos.splice(targetIndex, 0, removed);

        await reorderPlatos(newPlatos);
        setDraggedItem(null);
    };

    const openEditModal = (plato: Plato) => {
        setEditingPlato(plato);
        setModalOpen(true);
    };

    const openAddModal = () => {
        setEditingPlato(null);
        setModalOpen(true);
    };

    const renderAllergenLegend = () => {
        if (!showAllergens) return null;
        const allAllergens = Object.keys(allergenColors);
        
        return (
            <div className="sticky top-[68px] z-30 -mx-2 sm:-mx-4 mb-4 animate-fade-in">
                <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 border-b-4 border-b-slate-300 shadow-md py-2 px-4 sm:px-6">
                    <div className="max-w-5xl mx-auto flex flex-col gap-1">
                        <div className="flex justify-between items-center px-1 mb-1">
                            <p className="text-[9px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t.infoAlergenos}</p>
                            <div className="flex items-center gap-2">
                                {selectedAllergens.length > 0 && (
                                    <button onClick={() => setSelectedAllergens([])} className="text-[9px] bg-slate-800 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm hover:bg-slate-700 transition-colors">
                                        <IconX width={8} height={8}/> LIMPIAR
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowAllergens(false)} 
                                    className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"
                                    title={t.ocultarAlergenos}
                                >
                                    <IconX width={14} height={14} />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1.5 items-center">
                            {allAllergens.map(key => {
                                const isSelected = selectedAllergens.includes(key);
                                return (
                                    <button 
                                        key={key} 
                                        onClick={() => setSelectedAllergens(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
                                        className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${isSelected ? 'bg-white border-slate-800 shadow-sm ring-1 ring-slate-200 z-10' : 'bg-white/40 border-slate-100 hover:border-slate-300'}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${allergenColors[key] || 'bg-gray-400'}`}></span>
                                        <span className={`text-[9px] font-bold uppercase whitespace-nowrap tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{t.alergenos?.[key] || key}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const allCollapsed = sortedKeys.every(k => !expandedCats[k]);

    return (
        <div className="max-w-5xl mx-auto p-2 sm:p-4 pb-20 relative">
             {showSaved && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 font-bold animate-bounce-short flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    ¡Cambios publicados!
                </div>
            )}

            <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-md border border-slate-200 gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('home')} className="p-1.5 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600"><IconChevronLeft /></button>
                    <h2 className="text-xl font-bold font-lora text-slate-800 capitalize">{mode === 'raciones' ? 'Gestión Raciones' : mode}</h2>
                </div>

                {mode === 'menu' && (
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm order-last sm:order-none w-full sm:w-auto justify-center sm:justify-start">
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">{t.gestion!.precioMenu}:</span>
                        <EditablePrice 
                            price={menuPrice} 
                            onUpdate={refreshData}
                            onSave={async (val) => await api.setMenuPrice(val)}
                        />
                    </div>
                )}

                <div className="flex items-center gap-2 ml-auto sm:ml-0 flex-wrap justify-end">
                    <button 
                        onClick={handleReanalyzeAllergens} 
                        disabled={isReanalyzing} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-sm ${confirmReanalyze ? 'bg-red-600 text-white border-red-600' : isReanalyzing ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        title="Re-analizar todos los platos con IA"
                    >
                        {isReanalyzing ? `Analizando... ${reanalyzeProgress}%` : confirmReanalyze ? '¿Confirmar re-análisis?' : 'Re-analizar Alérgenos'}
                    </button>
                    <button onClick={() => setShowAllergens(!showAllergens)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-sm ${showAllergens ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                        <IconAllergy className="w-4 h-4" /> {showAllergens ? t.ocultarAlergenos : t.mostrarAlergenos}
                    </button>
                    <button 
                        onClick={() => toggleAll(allCollapsed)} 
                        className="text-[10px] font-black uppercase text-slate-400 border border-slate-200 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        {allCollapsed ? 'Expandir todo' : 'Colapsar todo'}
                    </button>
                    <button onClick={handleManualSave} disabled={saving} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow hover:bg-amber-600 transition-colors flex items-center gap-2">
                         {saving ? '...' : 'Guardar'}
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow hover:bg-emerald-700 transition-colors">
                        <IconPlus /> Añadir
                    </button>
                </div>
            </div>

            {renderAllergenLegend()}

            <div className="space-y-3">
                {sortedKeys.map(key => {
                    const isExpanded = expandedCats[key] ?? true;
                    return (
                        <div key={key} className="bg-white rounded-xl shadow-sm border border-slate-100 transition-all relative">
                            <div className="sticky top-[64px] sm:top-[68px] z-20 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 shadow-sm transition-colors hover:bg-slate-100/95 rounded-t-xl">
                                <button 
                                    onClick={() => toggleCat(key)}
                                    className="w-full flex items-center px-4 py-3 gap-2 group relative"
                                >
                                    <div className="p-1.5 w-[28px] flex-shrink-0"></div>
                                    <div className={`${mode === 'carta' || mode === 'menu' ? 'w-[35%]' : 'flex-grow'} min-w-0 flex items-center gap-2 text-left`}>
                                        <span className={`w-2 h-2 rounded-full transition-colors ${isExpanded ? 'bg-amber-400 shadow-sm' : 'bg-slate-300'}`}></span>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">
                                            {(t.tipos as any)[key] || (key === 'PRIMERO' ? t.primerosPlatos : key === 'SEGUNDO' ? t.segundosPlatos : key)}
                                            <span className="text-[10px] opacity-40 ml-1">({groupedPlatos[key].length})</span>
                                        </h3>
                                    </div>
                                    {(mode === 'carta' || mode === 'menu') && (
                                        <div className="flex-1 flex justify-center px-1">
                                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Añadir a Menú del Día</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 flex-shrink-0 justify-end opacity-0 pointer-events-none">
                                        {mode !== 'menu' && <div className="w-[68px]"></div>}
                                        <div className="w-[30px]"></div>
                                        {mode === 'raciones' ? <div className="w-[70px]"></div> : <div className="w-[44px]"></div>}
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <IconArrowDown className={`w-4 h-4 text-slate-700 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                            </div>
                            
                            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 invisible overflow-hidden'}`}>
                                <div className="divide-y divide-slate-50">
                                    {groupedPlatos[key].map((p) => {
                                        const allergensToDisplay = (() => {
                                            if (!p.Alergenos || !Array.isArray(p.Alergenos)) return [];
                                            if (selectedAllergens.length > 0) {
                                                const matching = p.Alergenos.filter((a: string) => selectedAllergens.includes(a));
                                                return matching.length > 0 ? matching : [];
                                            }
                                            return p.Alergenos;
                                        })();

                                        const isRestricted = (() => {
                                            if (selectedAllergens.length === 0) return false;
                                            if (!p.Alergenos || !Array.isArray(p.Alergenos)) return false;
                                            return p.Alergenos.some((a: string) => selectedAllergens.includes(a));
                                        })();

                                        const hasAllergens = allergensToDisplay.length > 0;

                                        return (
                                            <div 
                                                key={p.ID_Plato} 
                                                className={`flex items-center px-4 py-2.5 hover:bg-slate-50/50 transition-colors gap-2 group ${draggedItem?.ID_Plato === p.ID_Plato ? 'opacity-50 bg-blue-50' : ''} ${isRestricted ? 'opacity-50 grayscale' : ''}`}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, p)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, p)}
                                            >
                                                <div className="cursor-grab active:cursor-grabbing p-1.5 text-slate-700 hover:text-blue-600 rounded transition-colors">
                                                    <IconSort width={16} height={16} />
                                                </div>
                                                <div className={`${mode === 'carta' || mode === 'menu' ? 'w-[35%]' : 'flex-grow'} min-w-0`}>
                                                    <p className={`text-sm font-medium leading-snug truncate ${isRestricted ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'}`}>{p.ES_Nombre}</p>
                                                    {(showAllergens || isRestricted) && hasAllergens && (
                                                        <div className="flex flex-row items-center gap-1 mt-1">
                                                            {allergensToDisplay.map((a: any) => (
                                                                <div 
                                                                    key={a} 
                                                                    className={`w-2 h-2 rounded-full shadow-sm ${allergenColors[a] || 'bg-gray-400'} ${selectedAllergens.includes(a) ? 'ring-1 ring-slate-500 scale-110' : ''}`} 
                                                                    title={t.alergenos?.[a] || a}
                                                                ></div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {(mode === 'carta' || mode === 'menu') && (
                                                    <div className="flex-1 flex justify-center px-1">
                                                        <select 
                                                            value={p.Rol_Menu || "NO"} 
                                                            onChange={(e) => handleRolChange(p.ID_Plato, e.target.value)} 
                                                            className={`text-xs font-bold uppercase rounded-md py-1.5 px-2 border border-slate-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 cursor-pointer transition-all appearance-none text-center w-full max-w-[160px] truncate ${p.Rol_Menu ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 shadow-sm'}`}
                                                        >
                                                            <option value="NO">{(t.tipos as any)[p.Tipo]?.toUpperCase() || p.Tipo}</option>
                                                            <option value="PRIMERO">PRIMER PLATO</option>
                                                            <option value="SEGUNDO">SEGUNDO PLATO</option>
                                                            <option value="POSTRE">POSTRE MENÚ</option>
                                                        </select>
                                                    </div>
                                                )}
                                                <div className={`flex items-center gap-3 flex-shrink-0 justify-end`}>
                                                    {mode !== 'menu' && <EditablePrice price={p.Precio} id={p.ID_Plato} onUpdate={refreshData} />}
                                                    <button onClick={() => openEditModal(p)} className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><IconEdit width={18} height={18}/></button>
                                                    {mode === 'raciones' ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[9px] font-black uppercase tracking-tighter ${p.Es_Racion ? 'text-emerald-600' : 'text-slate-300'}`}>Ración</span>
                                                            <Switch checked={!!p.Es_Racion} onChange={() => handleRacionToggle(p.ID_Plato, !!p.Es_Racion)} />
                                                        </div>
                                                    ) : (
                                                        <Switch checked={p.Activo_Dia} onChange={() => handleToggle(p.ID_Plato, p.Activo_Dia)} />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AddPlatoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} mode={mode} refreshData={refreshData} platoToEdit={editingPlato} />
        </div>
    );
};

export default GestionCategoria;
