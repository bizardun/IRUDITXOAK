
import React, { useState, useEffect } from 'react';
import { languages, translations } from '../../constants';
import { IconX, IconTrash, AllergenIcon } from '../icons';
import api from '../../services/api';
import type { Plato, Alergeno } from '../../types';

interface AddPlatoModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'menu' | 'carta' | 'raciones';
    refreshData: () => Promise<void>;
    platoToEdit?: Plato | null;
}

const ALLERGEN_LIST: { id: Alergeno; label: string }[] = [
    { id: 'GLUTEN', label: 'Gluten' },
    { id: 'CRUSTACEOS', label: 'Crustáceos' },
    { id: 'HUEVOS', label: 'Huevos' },
    { id: 'PESCADO', label: 'Pescado' },
    { id: 'CACAHUETES', label: 'Cacahuetes' },
    { id: 'SOJA', label: 'Soja' },
    { id: 'LACTEOS', label: 'Lácteos' },
    { id: 'APIO', label: 'Apio' },
    { id: 'MOSTAZA', label: 'Mostaza' },
    { id: 'SESAMO', label: 'Sésamo' },
    { id: 'SULFITOS', label: 'Sulfitos' },
    { id: 'ALTRAMUCES', label: 'Altramuces' },
    { id: 'MOLUSCOS', label: 'Moluscos' },
];

export default function AddPlatoModal({ isOpen, onClose, mode, refreshData, platoToEdit }: AddPlatoModalProps) {
    const initialData = { ES_Nombre: '', Precio: '', Tipo: 'ENTRANTE' };
    const [data, setData] = useState<any>(initialData);
    const [translationsData, setTranslationsData] = useState<Record<string, string>>({});
    const [selectedAllergens, setSelectedAllergens] = useState<Alergeno[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Estado para confirmar borrado (2 pasos)
    const [confirmDelete, setConfirmDelete] = useState(false);
    
    // We know ES translations have 'gestion'
    const t = translations.ES.gestion!;
    const isEditing = !!platoToEdit;

    useEffect(() => {
        if (isOpen && platoToEdit) {
            // Cargar datos del plato existente
            setData({
                ES_Nombre: platoToEdit.ES_Nombre,
                Precio: platoToEdit.Precio.toString(),
                Tipo: platoToEdit.Tipo
            });
            
            // Cargar traducciones existentes
            const tr: Record<string, string> = {};
            languages.filter(l => l.code !== 'ES').forEach(l => {
                tr[l.code] = (platoToEdit as any)[`${l.code}_Nombre`] || '';
            });
            setTranslationsData(tr);
            
            // Cargar Alérgenos (con fallback a array vacío)
            setSelectedAllergens(platoToEdit.Alergenos || []);
            setConfirmDelete(false); // Resetear estado de borrado

        } else if (isOpen && !platoToEdit) {
            // Resetear formulario para nuevo plato
            setData(initialData);
            setTranslationsData({});
            setSelectedAllergens([]);
            setConfirmDelete(false);
        }
    }, [isOpen, platoToEdit]);

    const toggleAllergen = (id: Alergeno) => {
        setSelectedAllergens(prev => 
            prev.includes(id) 
                ? prev.filter(a => a !== id) 
                : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const price = parseFloat(data.Precio);
            const commonPayload = {
                Precio: price,
                Tipo: data.Tipo,
                Alergenos: selectedAllergens
            };
            
            if (isEditing && platoToEdit) {
                // ACTUALIZAR
                const payload: Partial<Plato> = {
                    ES_Nombre: data.ES_Nombre,
                    ...commonPayload
                };
                
                // Añadir traducciones manuales
                Object.keys(translationsData).forEach(code => {
                    payload[`${code}_Nombre`] = translationsData[code];
                });

                await api.updatePlato(platoToEdit.ID_Plato, payload);
            } else {
                // CREAR
                const payload: any = { 
                    ...data, 
                    ...commonPayload,
                    Categoria: mode === 'menu' ? 'MENU,CARTA' : 'CARTA' 
                };
                
                // Si hay traducciones generadas, usarlas
                languages.filter(l => l.code !== 'ES').forEach(l => {
                    if (translationsData[l.code]) {
                        payload[`${l.code}_Nombre`] = translationsData[l.code];
                    }
                });

                // Si no se generaron traducciones antes de guardar y el usuario guarda directo,
                // intentamos una traducción rápida (fallback).
                // Pero idealmente el usuario habrá pulsado "Analizar" antes.
                if (Object.keys(translationsData).length === 0) {
                     await Promise.all(languages.filter(l => l.code !== 'ES').map(async (l) => {
                         payload[`${l.code}_Nombre`] = await api.translateText(data.ES_Nombre, l.code, l.name);
                     }));
                }

                await api.addPlato(payload);
            }

            await refreshData();
            onClose();
        } catch (error) {
            console.error("Error guardando plato", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeDish = async () => {
        if (!data.ES_Nombre) return;
        setLoading(true);
        try {
            // Usamos la nueva función que trae traducciones Y alérgenos
            const result = await api.analyzeDish(data.ES_Nombre);
            
            // 1. Actualizar traducciones
            const newTr = { ...translationsData, ...result.translations };
            setTranslationsData(newTr);

            // 2. Actualizar Alérgenos (Merge inteligente)
            // Añadimos los detectados a los que ya estuvieran seleccionados manualmente
            if (result.allergens && result.allergens.length > 0) {
                setSelectedAllergens(prev => {
                    const combined = new Set([...prev, ...result.allergens]);
                    return Array.from(combined);
                });
            }
        } catch (error) {
            console.error("Error analizando plato", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!platoToEdit) return;

        // Lógica de confirmación en 2 pasos para evitar window.confirm
        if (!confirmDelete) {
            setConfirmDelete(true);
            // Resetear a los 3 segundos si no confirma
            setTimeout(() => setConfirmDelete(false), 3000);
            return;
        }

        setLoading(true);
        try {
            await api.deletePlato(platoToEdit.ID_Plato);
            await refreshData();
            onClose();
        } catch (error) {
            console.error("Error eliminando plato", error);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up border border-slate-200 my-8">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold font-lora text-slate-800">
                        {isEditing ? 'Editar Plato y Detalles' : `${t.anadir} Plato`}
                    </h3>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 hover:bg-slate-200 transition-colors"><IconX/></button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
                    {/* Sección Datos Generales */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-1">Datos Generales</h4>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nombre del Plato (Español)</label>
                            <input 
                                required 
                                placeholder="Ej: Chuletón de buey..."
                                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-lg rounded-lg p-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
                                value={data.ES_Nombre} 
                                onChange={e => setData({...data, ES_Nombre: e.target.value})} 
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Categoría</label>
                                <div className="relative">
                                    <select 
                                        className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 font-semibold text-sm rounded-lg p-3 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all" 
                                        value={data.Tipo} 
                                        onChange={e => setData({...data, Tipo: e.target.value})}
                                    >
                                        {Object.keys(translations.ES.tipos).map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="w-32">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Precio (€)</label>
                                <input 
                                    required 
                                    type="number" 
                                    step="0.1" 
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-lg rounded-lg p-3 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-right transition-all shadow-sm" 
                                    value={data.Precio} 
                                    onChange={e => setData({...data, Precio: e.target.value})} 
                                    onFocus={e => e.target.select()}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección Traducciones - MOVIDO ARRIBA */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-1">Traducciones</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {languages.filter(l => l.code !== 'ES').map(lang => (
                                <div key={lang.code}>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1.5">
                                        <div className="w-4 h-3 rounded-sm overflow-hidden shadow-sm opacity-80">
                                            <lang.flag />
                                        </div>
                                        {lang.name}
                                    </label>
                                    <input 
                                        type="text"
                                        value={translationsData[lang.code] || ''}
                                        onChange={e => setTranslationsData({...translationsData, [lang.code]: e.target.value})}
                                        className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-300"
                                        placeholder={`Nombre en ${lang.name}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sección Alérgenos - MOVIDO ABAJO */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Alérgenos</h4>
                            {/* Botón Magico */}
                            <button 
                                type="button" 
                                onClick={handleAnalyzeDish}
                                disabled={loading || !data.ES_Nombre}
                                className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shadow-sm border border-indigo-100"
                                title="Traduce nombres y detecta alérgenos automáticamente"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <span>✨</span>
                                )}
                                Traducir y Detectar
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {ALLERGEN_LIST.map((alergeno) => {
                                const isSelected = selectedAllergens.includes(alergeno.id);
                                return (
                                    <button
                                        key={alergeno.id}
                                        type="button"
                                        onClick={() => toggleAllergen(alergeno.id)}
                                        className={`
                                            flex items-center gap-2 p-2 rounded-lg border text-xs font-bold transition-all
                                            ${isSelected 
                                                ? 'bg-rose-50 border-rose-200 text-rose-700 ring-1 ring-rose-200 shadow-sm' 
                                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                                            }
                                        `}
                                    >
                                        <AllergenIcon type={alergeno.id} className={`w-5 h-5 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                                        {alergeno.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    <div>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={handleDelete}
                                className={`
                                    px-4 py-2 border rounded-lg font-bold text-sm transition-all flex items-center gap-2
                                    ${confirmDelete 
                                        ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 animate-pulse' 
                                        : 'text-red-600 hover:bg-red-50 border-transparent hover:border-red-200'
                                    }
                                `}
                                title="Eliminar plato permanentemente"
                            >
                                {confirmDelete ? (
                                    <>¿CONFIRMAR?</>
                                ) : (
                                    <><IconTrash /> Eliminar</>
                                )}
                            </button>
                        )}
                    </div>
                    
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors">{t.volver}</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md transition-all transform active:scale-95 flex items-center gap-2">
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Guardando...
                                </>
                            ) : (
                                t.guardar
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
