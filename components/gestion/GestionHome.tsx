
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

const IconMonitor = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

export default function GestionHome({ setView }: { setView: (v: any) => void }) {
    const cards = [
        { id: 'menu', label: 'Menú del Día', icon: IconMenu, color: 'text-blue-600 border-blue-200 bg-blue-50' },
        { id: 'carta', label: 'Carta Principal', icon: IconBook, color: 'text-amber-600 border-amber-200 bg-amber-50' },
        { id: 'raciones', label: 'Raciones', icon: IconFood, color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
        { id: 'qr', label: 'Imprimir QR / Cartel', icon: IconQR, color: 'text-slate-600 border-slate-200 bg-slate-50' },
        { id: 'preview', label: 'Vista Previa Cliente', icon: IconMonitor, color: 'text-indigo-600 border-indigo-200 bg-indigo-50 col-span-full' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-slate-800 font-lora mb-2 text-center">Panel de Gestión</h1>
            <p className="text-slate-500 text-sm text-center mb-8">Administra tus platos y verifica la apariencia de tu carta</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map(c => (
                    <button 
                        key={c.id} 
                        onClick={() => setView(c.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 bg-white hover:shadow-md transition-all active:scale-95 group ${c.color} ${c.id === 'preview' ? 'md:col-span-2' : ''}`}
                    >
                        <div className="mb-3 transform group-hover:scale-110 transition-transform"><c.icon /></div>
                        <span className="font-bold text-slate-700 text-center leading-tight">{c.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
