
import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import ClienteApp from './components/cliente/ClienteApp';
import GestionApp from './components/gestion/GestionApp';
import FactoryDashboard from './components/factory/FactoryDashboard';

// Iconos para la barra de navegación
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

const MainLayout = () => {
    const { config, isFactoryMode } = useConfig();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        document.title = `${config.name} - Carta Digital`;
    }, [config]);

    // Apply Fonts and Themes dynamically
    const fontClass = config.theme?.font || 'font-lora';
    const themeStyle = config.theme?.style || 'classic';
    
    // Theme colors mapping
    const themeColors = {
        classic: 'bg-[#FDFBF7] text-slate-800',
        modern: 'bg-slate-50 text-slate-900',
        fresh: 'bg-emerald-50/30 text-emerald-950'
    };

    if (isFactoryMode) {
        return <FactoryDashboard />;
    }

    return (
        <DataProvider key={config.id}>
            <div className={`min-h-screen leading-tight ${fontClass} ${themeColors[themeStyle]}`}>
                {/* Navbar */}
                <div className="print:hidden sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3 px-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-end">
                        
                        <div className="flex bg-slate-100 p-1 rounded-full shadow-inner border border-slate-200">
                            <button 
                                onClick={() => setIsAdmin(false)} 
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                                    !isAdmin 
                                    ? 'bg-amber-500 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                <IconUser /> <span className="hidden sm:inline">Cliente</span>
                            </button>
                            
                            <button 
                                onClick={() => setIsAdmin(true)} 
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                                    isAdmin 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                <IconSettings /> <span className="hidden sm:inline">Gestión</span>
                            </button>
                        </div>
                    </div>
                </div>

                {isAdmin ? <GestionApp /> : <ClienteApp />}
            </div>
        </DataProvider>
    );
};

export default function App() {
    return (
        <ConfigProvider>
            <MainLayout />
        </ConfigProvider>
    );
}
