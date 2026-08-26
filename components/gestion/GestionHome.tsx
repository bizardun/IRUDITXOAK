import React from 'react';
import { IconMenu, IconBook, IconFood } from '../icons';

// Iconos adicionales
const IconQR = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <path d="M3 14h7v7H3z"></path>
  </svg>
);

import { useConfig } from '../../context/ConfigContext';

export default function GestionHome({ setView }: { setView: (v: any) => void }) {
    const { config } = useConfig();
    const isKanala = config.name.toLowerCase().includes('kanala');
    const cards = isKanala ? [
        { id: 'ENTRANTE', label: 'Entrantes', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'ENSALADA', label: 'Ensaladas', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'ARROZ', label: 'Arroces', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'MARISCO', label: 'Mariscos', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'PESCADO', label: 'Pescados', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'CARNE', label: 'Carnes', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'POSTRE', label: 'Postres', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'qr', label: 'Descargar QR / Cartel', icon: IconQR, color: 'text-white/80 border-white/20 bg-white/5 hover:bg-white/10' },
    ] : [
        { id: 'menu', label: 'Menú del Día', icon: IconMenu, color: 'text-blue-600 border-blue-200 bg-blue-50' },
        { id: 'carta', label: 'Carta Principal', icon: IconBook, color: 'text-amber-600 border-amber-200 bg-amber-50' },
        { id: 'raciones', label: 'Raciones', icon: IconFood, color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
        { id: 'qr', label: 'Descargar QR / Cartel', icon: IconQR, color: 'text-slate-600 border-slate-200 bg-slate-50' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className={`text-2xl font-bold font-lora mb-2 text-center ${isKanala ? 'text-white' : 'text-slate-800'}`}>Panel de Gestión</h1>
            <p className={`text-sm text-center mb-8 ${isKanala ? 'text-neutral-400' : 'text-slate-500'}`}>Administra tus platos y verifica la apariencia de tu carta</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map(c => (
                    <button 
                        key={c.id} 
                        onClick={() => setView(c.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 hover:shadow-md transition-all active:scale-95 group ${isKanala ? '' : 'bg-white'} ${c.color}`}
                    >
                        <div className="mb-3 transform group-hover:scale-110 transition-transform"><c.icon /></div>
                        <span className={`font-bold text-center leading-tight ${isKanala ? 'text-white' : 'text-slate-700'}`}>{c.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
