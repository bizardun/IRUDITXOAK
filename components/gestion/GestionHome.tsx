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
import { useData } from '../../context/DataContext';

export default function GestionHome({ setView }: { setView: (v: any) => void }) {
    const { config } = useConfig();
    const { platos } = useData();
    const isKanala = config.name.toLowerCase().includes('kanala');
    const isBolina = config.name.toLowerCase().includes('boliña') || config.id === 'bolina_viejo_v1';
    const isDarkCustom = !isKanala && !isBolina && Boolean(config.theme?.customColors?.isDark);
    const isDark = isKanala || isDarkCustom;
    const hasMenuDelDia = platos.some(p => p.Rol_Menu && p.Rol_Menu !== 'RACION');
    const isCartaOnly = isKanala || (!isBolina && !hasMenuDelDia);

    const cards = isCartaOnly ? [
        { id: 'ALL', label: 'Gestionar Carta', icon: IconBook, color: isDark ? 'text-white border-white/20 bg-white/5 hover:bg-white/10' : 'text-amber-600 border-amber-200 bg-amber-50' },
        { id: 'qr', label: 'Descargar QR / Cartel', icon: IconQR, color: isDark ? 'text-white/80 border-white/20 bg-white/5 hover:bg-white/10' : 'text-slate-600 border-slate-200 bg-slate-50' },
    ] : [
        { id: 'menu', label: 'Menú del Día', icon: IconMenu, color: 'text-blue-600 border-blue-200 bg-blue-50' },
        { id: 'carta', label: 'Carta Principal', icon: IconBook, color: 'text-amber-600 border-amber-200 bg-amber-50' },
        { id: 'raciones', label: 'Raciones', icon: IconFood, color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
        { id: 'qr', label: 'Descargar QR / Cartel', icon: IconQR, color: 'text-slate-600 border-slate-200 bg-slate-50' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {isBolina ? (
                <img
                    src="/logo-bolina.jpg"
                    alt={config.name}
                    className="h-20 sm:h-24 mx-auto object-contain mb-3 mix-blend-multiply"
                />
            ) : (!isKanala && config.logoUrl) ? (
                isDarkCustom ? (
                    <div className="flex justify-center mb-4">
                        <div className="bg-white rounded-2xl p-2 shadow-md border border-amber-400/50">
                            <img src={config.logoUrl} alt={config.name} className="h-20 sm:h-24 object-contain" />
                        </div>
                    </div>
                ) : (
                    <img
                        src={config.logoUrl}
                        alt={config.name}
                        className="h-20 sm:h-24 mx-auto object-contain mb-3"
                    />
                )
            ) : null}
            <h1 className={`text-2xl font-bold font-lora mb-2 text-center ${isDark ? 'text-white' : 'text-slate-800'}`}>Panel de Gestión</h1>
            <p className={`text-sm text-center mb-8 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>Administra tus platos y verifica la apariencia de tu carta</p>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${isCartaOnly ? 'md:grid-cols-2 max-w-xl mx-auto' : 'md:grid-cols-4'} gap-4`}>
                {cards.map(c => (
                    <button 
                        key={c.id} 
                        onClick={() => setView(c.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 hover:shadow-md transition-all active:scale-95 group ${isDark ? '' : 'bg-white'} ${c.color}`}
                    >
                        <div className="mb-3 transform group-hover:scale-110 transition-transform"><c.icon /></div>
                        <span className={`font-bold text-center leading-tight ${isDark ? 'text-white' : 'text-slate-700'}`}>{c.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
