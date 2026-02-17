
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
    const [groundingSources, setGroundingSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    
    const t = translations.ES.gestion!;
    const isEditing = !!platoToEdit;

    useEffect(() => {
        if (isOpen) {
            if (platoToEdit) {
                setData({ ES_Nombre: platoToEdit.ES_Nombre, Precio: platoToEdit.Precio.toString(), Tipo: platoToEdit.Tipo });
                const tr: Record<string, string> = {};
                languages.filter(l => l.code !== 'ES').forEach(l => {
                    tr[l.code] = (platoToEdit as any)[`${l.code}_Nombre`] || '';
                });
                setTranslationsData(tr);
                setSelectedAllergens(platoToEdit.Alergenos || []);
            } else {
                setData(initialData);
                setTranslationsData({});
                setSelectedAllergens([]);
            }
            setGroundingSources([]);
            setConfirmDelete(false);
        }
    }, [isOpen, platoToEdit]);

    const handleAnalyzeDish = async () => {
        if (!data.ES_Nombre) return;
        setLoading(true);
        try {
            const result = await api.analyzeDish(data.ES_Nombre);
            setTranslationsData(prev => ({ ...prev, ...result.translations }));
            if (result.allergens?.length > 0) {
                setSelectedAllergens(prev => Array.from(new Set([...prev, ...result.allergens])));
            }
            setGroundingSources(result.sources || []);
        } catch (error) {
            console.error("Analysis error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: any = { 
                ...data, 
                Precio: parseFloat(data.Precio) || 0,
                Alergenos: selectedAllergens,
                Categoria: platoToEdit?.Categoria || (mode === 'menu' ? 'MENU,CARTA' : 'CARTA')
            };
            Object.keys(translationsData).forEach(code => {
                payload[`${code}_Nombre`] = translationsData[code];
            });

            if (isEditing) await api.updatePlato(platoToEdit!.ID_Plato, payload);
            else await api.addPlato(payload);

            await refreshData();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up border border-slate-200 my-8">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold font-lora text-slate-800">{isEditing ? 'Editar Plato' : 'Añadir Plato'}</h3>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><IconX/></button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nombre (Español)</label>
                        <input required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500" value={data.ES_Nombre} onChange={e => setData({...data, ES_Nombre: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Tipo</label>
                            <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-semibold outline-none" value={data.Tipo} onChange={e => setData({...data, Tipo: e.target.value as any})}>
                                {Object.keys(translations.ES.tipos).map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Precio (€)</label>
                            <input required type="number" step="0.1" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 font-bold outline-none text-right" value={data.Precio} onChange={e => setData({...data, Precio: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Traducciones e IA</h4>
                            <button type="button" onClick={handleAnalyzeDish} disabled={loading || !data.ES_Nombre} className="text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
                                {loading ? 'Analizando...' : '✨ Traducir con Elhuyar'}
                            </button>
                        </div>
                        
                        {groundingSources.length > 0 && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-[11px]">
                                <p className="font-bold text-emerald-800 mb-1">Fuentes de validación lingüística:</p>
                                <ul className="space-y-1">
                                    {groundingSources.map((s, i) => (
                                        <li key={i}><a href={s.uri} target="_blank" rel="noreferrer" className="text-emerald-600 underline hover:text-emerald-800">{s.title}</a></li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {languages.filter(l => l.code !== 'ES').map(lang => (
                                <div key={lang.code}>
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1 uppercase">
                                        <div className="w-3 h-2 overflow-hidden rounded-sm"><lang.flag /></div> {lang.name}
                                    </label>
                                    <input type="text" value={translationsData[lang.code] || ''} onChange={e => setTranslationsData({...translationsData, [lang.code]: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-blue-500" placeholder={`Nombre en ${lang.name}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Alérgenos</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {ALLERGEN_LIST.map((alergeno) => {
                                const isSelected = selectedAllergens.includes(alergeno.id);
                                return (
                                    <button key={alergeno.id} type="button" onClick={() => setSelectedAllergens(prev => isSelected ? prev.filter(a => a !== alergeno.id) : [...prev, alergeno.id])} className={`flex items-center gap-2 p-2 rounded-lg border text-[10px] font-bold transition-all ${isSelected ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        <AllergenIcon type={alergeno.id} className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                                        {alergeno.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    {isEditing ? (
                        <button type="button" onClick={async () => { if(confirmDelete) { await api.deletePlato(platoToEdit!.ID_Plato); refreshData(); onClose(); } else setConfirmDelete(true); }} className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all ${confirmDelete ? 'bg-red-600 text-white border-red-600' : 'text-red-600 border-red-100 hover:bg-red-50'}`}>
                            {confirmDelete ? '¿Confirmar?' : 'Eliminar'}
                        </button>
                    ) : <div/>}
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-bold text-sm">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-md transition-all">
                            {loading ? '...' : t.guardar}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
