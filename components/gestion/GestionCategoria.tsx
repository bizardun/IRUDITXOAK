
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { translations } from '../../constants';
import { IconChevronLeft, IconPlus, IconEdit, IconSort } from '../icons';
import { Switch } from '../ui/Switch';
import { EditablePrice } from '../ui/EditablePrice';
import api from '../../services/api';
import AddPlatoModal from './AddPlatoModal';
import type { Plato } from '../../types';

const GestionCategoria: React.FC<{ mode: 'menu' | 'carta' | 'raciones'; setView: (v: any) => void }> = ({ mode, setView }) => {
    const { platos, menuPrice, refreshData, updateLocalPlato, reorderPlatos } = useData();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlato, setEditingPlato] = useState<Plato | null>(null);
    const [saving, setSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [draggedItem, setDraggedItem] = useState<Plato | null>(null);
    
    const t = translations.ES;
    
    // Toggle para 'Activo_Dia'
    const handleToggle = async (id: number, current: boolean) => {
        updateLocalPlato(id, { Activo_Dia: !current }); // Optimistic
        await api.updatePlato(id, { Activo_Dia: !current });
        refreshData(); // Sync
    };

    // Toggle para 'Es_Racion'
    const handleRacionToggle = async (id: number, current: boolean) => {
        updateLocalPlato(id, { Es_Racion: !current }); // Optimistic
        await api.updatePlato(id, { Es_Racion: !current });
        refreshData(); // Sync
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

    // --- LÓGICA DRAG & DROP ---
    const handleDragStart = (e: React.DragEvent, item: Plato) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        // Hack para imagen fantasma en algunos navegadores
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

        // Reorder logic: Mover draggedItem a la posición de targetItem en la lista global
        const currentIndex = platos.findIndex(p => p.ID_Plato === draggedItem.ID_Plato);
        const targetIndex = platos.findIndex(p => p.ID_Plato === targetItem.ID_Plato);

        if (currentIndex === -1 || targetIndex === -1) return;

        const newPlatos = [...platos];
        // Remove dragged item
        const [removed] = newPlatos.splice(currentIndex, 1);
        // Insert at target index
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

    // Robust Grouping Logic
    const groupedPlatos = useMemo(() => {
        const groups: Record<string, any[]> = {};
        
        // Filter based on mode
        const filtered = platos.filter(p => {
            // EN MENU: Solo mostramos lo que está asignado al menú (rol existe y no es RACION)
            if (mode === 'menu') return p.Rol_Menu && p.Rol_Menu !== 'RACION';
            // EN CARTA Y RACIONES: Mostramos TODO lo que sea de la carta para poder gestionarlo
            return p.Categoria.includes('CARTA');
        });

        filtered.forEach(p => {
            // Group by Role in Menu Mode, else by Type
            const k = mode === 'menu' ? (p.Rol_Menu || 'OTROS') : (p.Tipo || 'OTROS');
            if (!groups[k]) groups[k] = [];
            groups[k].push(p);
        });
        
        return groups;
    }, [platos, mode]);

    // Ensure consistent sorting of keys
    const sortedKeys = Object.keys(groupedPlatos).sort((a, b) => {
        const order = ['PRIMERO', 'SEGUNDO', 'ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'];
        return (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b));
    });

    return (
        <div className="max-w-5xl mx-auto p-2 sm:p-4 pb-20 relative">
             {/* Toast de Guardado */}
             {showSaved && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 font-bold animate-bounce-short flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    ¡Cambios publicados!
                </div>
            )}

            {/* Header Compacto - STICKY */}
            <div className="sticky top-20 z-40 flex flex-wrap items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-md border border-slate-200 gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('home')} className="p-1.5 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600"><IconChevronLeft /></button>
                    <h2 className="text-xl font-bold font-lora text-slate-800 capitalize">{mode === 'raciones' ? 'Gestión Raciones' : mode}</h2>
                </div>

                {/* Menu Price Control - Integrated into Sticky Header */}
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

                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <button onClick={handleManualSave} disabled={saving} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow hover:bg-amber-600 transition-colors flex items-center gap-2">
                         {saving ? '...' : (
                             <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                Guardar
                             </>
                         )}
                    </button>
                    <button onClick={openAddModal} className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow hover:bg-emerald-700 transition-colors">
                        <IconPlus /> Añadir
                    </button>
                </div>
            </div>

            {/* Header explicativo para Raciones */}
            {mode === 'raciones' && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 text-sm text-blue-800 flex items-center gap-2">
                    <span className="bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded-full text-xs">INFO</span>
                    Activa el interruptor para mostrar el plato en la pestaña "Raciones" del cliente. Se muestran todos los platos de la carta.
                </div>
            )}

            {/* Lista Compacta */}
            <div className="space-y-4">
                {sortedKeys.map(key => (
                    <div key={key} className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-50/80 px-4 py-1.5 border-b border-slate-100">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                                {(t.tipos as any)[key] || (key === 'PRIMERO' ? t.primerosPlatos : key === 'SEGUNDO' ? t.segundosPlatos : key)}
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {groupedPlatos[key].map((p, index) => (
                                <div 
                                    key={p.ID_Plato} 
                                    className={`flex items-center px-4 py-2 hover:bg-slate-50 transition-colors gap-2 group ${draggedItem?.ID_Plato === p.ID_Plato ? 'opacity-50 bg-blue-50' : ''}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, p)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, p)}
                                >
                                    {/* Icono de Reordenar (Drag Handle) */}
                                    <div className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-blue-500 rounded hover:bg-blue-50 transition-colors" title="Arrastrar para mover">
                                        <IconSort width={18} height={18} />
                                    </div>

                                    {/* Nombre del plato */}
                                    <div className={`${mode === 'carta' ? 'w-[30%]' : 'flex-grow'} min-w-0`}>
                                        <p className="text-sm font-medium text-slate-800 leading-snug truncate">{p.ES_Nombre}</p>
                                    </div>
                                    
                                    {/* Selector de Rol de Menú: SOLO EN CARTA */}
                                    {mode === 'carta' && (
                                        <div className="flex-1 flex justify-center px-1">
                                            <select 
                                                value={p.Rol_Menu || "NO"} 
                                                onChange={(e) => handleRolChange(p.ID_Plato, e.target.value)} 
                                                className={`
                                                    text-xs sm:text-sm font-bold uppercase rounded-md py-1.5 px-2 
                                                    border-none focus:ring-0 cursor-pointer transition-all appearance-none text-center
                                                    w-full sm:w-auto max-w-[180px] truncate
                                                    ${p.Rol_Menu 
                                                        ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300 shadow-sm' 
                                                        : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                                    }
                                                `}
                                                title="Asignar a Menú del Día"
                                            >
                                                <option value="NO">{(t.tipos as any)[p.Tipo]?.toUpperCase() || p.Tipo}</option>
                                                <option value="PRIMERO">PRIMER PLATO</option>
                                                <option value="SEGUNDO">SEGUNDO PLATO</option>
                                                <option value="POSTRE">POSTRE MENÚ</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Controles derechos: Precio, Editar y Switch */}
                                    <div className={`flex items-center gap-3 flex-shrink-0 justify-end ${mode === 'carta' ? 'w-auto' : ''}`}>
                                        {mode !== 'menu' && <EditablePrice price={p.Precio} id={p.ID_Plato} onUpdate={refreshData} />}
                                        
                                        {/* Botón de Edición */}
                                        <button 
                                            onClick={() => openEditModal(p)}
                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Editar detalles y traducciones"
                                        >
                                            <IconEdit />
                                        </button>

                                        {mode === 'raciones' ? (
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold uppercase ${p.Es_Racion ? 'text-emerald-600' : 'text-slate-300'}`}>Ración</span>
                                                <Switch checked={!!p.Es_Racion} onChange={() => handleRacionToggle(p.ID_Plato, !!p.Es_Racion)} />
                                            </div>
                                        ) : (
                                            <Switch checked={p.Activo_Dia} onChange={() => handleToggle(p.ID_Plato, p.Activo_Dia)} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <AddPlatoModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                mode={mode} 
                refreshData={refreshData} 
                platoToEdit={editingPlato}
            />
        </div>
    );
};

export default GestionCategoria;
