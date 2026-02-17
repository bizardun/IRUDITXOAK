
import React, { useState, useEffect, useRef } from 'react';
import ClienteApp from '../cliente/ClienteApp';
import { DataProvider } from '../../context/DataContext';
import { RestaurantConfig } from '../../types';

interface DevicePreviewProps {
    config: RestaurantConfig;
    onClose: () => void;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const IconMobile = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const IconTablet = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const IconMonitor = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function DevicePreview({ config, onClose }: DevicePreviewProps) {
    const [device, setDevice] = useState<DeviceType>('mobile');
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const deviceConfigs = {
        mobile: { width: 375, height: 667, radius: '40px', border: '12px' },
        tablet: { width: 768, height: 1024, radius: '30px', border: '16px' },
        desktop: { width: '100%', height: '100%', radius: '0px', border: '0px' }
    };

    const currentConfig = deviceConfigs[device];

    // Lógica de escalado para que el dispositivo simulado quepa en la pantalla física
    useEffect(() => {
        const handleResize = () => {
            if (device === 'desktop' || !containerRef.current) {
                setScale(1);
                return;
            }

            const padding = 40; // Margen de seguridad
            const availableWidth = containerRef.current.clientWidth - padding;
            const availableHeight = containerRef.current.clientHeight - padding;
            
            const deviceW = typeof currentConfig.width === 'number' ? currentConfig.width : availableWidth;
            const deviceH = typeof currentConfig.height === 'number' ? currentConfig.height : availableHeight;

            const scaleW = availableWidth / deviceW;
            const scaleH = availableHeight / deviceH;
            
            // Usamos el menor de los dos para asegurar que quepa tanto de ancho como de alto
            const newScale = Math.min(scaleW, scaleH, 1);
            setScale(newScale);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [device, currentConfig.width, currentConfig.height]);

    return (
        <div className="fixed inset-0 z-[150] bg-slate-950 flex flex-col animate-fade-in overflow-hidden">
            {/* Toolbar */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <h2 className="text-white font-bold text-sm">Vista Previa: <span className="text-emerald-400">{config.name}</span></h2>
                    </div>
                    
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                        <button 
                            onClick={() => setDevice('mobile')}
                            className={`p-2 rounded-md transition-all ${device === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            title="Móvil"
                        >
                            <IconMobile />
                        </button>
                        <button 
                            onClick={() => setDevice('tablet')}
                            className={`p-2 rounded-md transition-all ${device === 'tablet' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            title="Tablet"
                        >
                            <IconTablet />
                        </button>
                        <button 
                            onClick={() => setDevice('desktop')}
                            className={`p-2 rounded-md transition-all ${device === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            title="Escritorio"
                        >
                            <IconMonitor />
                        </button>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <IconX />
                </button>
            </div>

            {/* Sim Area */}
            <div ref={containerRef} className="flex-1 overflow-hidden bg-slate-900 flex items-center justify-center relative p-2">
                <div 
                    className={`bg-white shadow-2xl transition-all duration-300 ease-in-out relative flex flex-col overflow-hidden ${device !== 'desktop' ? 'border-slate-800 border-solid' : ''}`}
                    style={{
                        width: typeof currentConfig.width === 'number' ? `${currentConfig.width}px` : currentConfig.width,
                        height: typeof currentConfig.height === 'number' ? `${currentConfig.height}px` : currentConfig.height,
                        borderRadius: currentConfig.radius,
                        borderWidth: currentConfig.border,
                        transform: `scale(${scale})`,
                        transformOrigin: 'center center',
                        flexShrink: 0
                    }}
                >
                    {/* Speaker sim for mobile/tablet */}
                    {device !== 'desktop' && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-800 rounded-b-xl z-10 flex items-center justify-center">
                            <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FDFBF7]">
                        <DataProvider key={config.id}>
                            <ClienteApp />
                        </DataProvider>
                    </div>
                </div>
            </div>

            {/* Hint */}
            <div className="bg-slate-900 py-2 px-4 text-center text-[10px] text-slate-500 uppercase font-bold tracking-widest border-t border-slate-800 flex-shrink-0">
                Simulador de Entorno de Usuario • {device === 'mobile' ? 'Móvil' : device === 'tablet' ? 'Tablet' : 'Escritorio'}
            </div>
        </div>
    );
}
