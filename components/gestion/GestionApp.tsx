
import React, { useState, useEffect } from 'react';
import GestionHome from './GestionHome';
import GestionCategoria from './GestionCategoria';
import GestionQR from './GestionQR';
import GestionLogin from './GestionLogin';
import DevicePreview from '../factory/DevicePreview';
import { useConfig } from '../../context/ConfigContext';

const GestionApp: React.FC = () => {
    const { config, showMasterPanelButton } = useConfig();
    const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ALL' : 'home');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        if (showMasterPanelButton) return true;
        if (typeof window === 'undefined') return false;
        return sessionStorage.getItem(`admin_auth_${config.id}`) === 'true';
    });

    useEffect(() => {
        setView(config?.name?.toLowerCase().includes('kanala') ? 'ALL' : 'home');
        if (showMasterPanelButton) {
            setIsAuthenticated(true);
        } else if (typeof window !== 'undefined') {
            setIsAuthenticated(sessionStorage.getItem(`admin_auth_${config.id}`) === 'true');
        }
    }, [config.id, config.name, showMasterPanelButton]);

    const handleLogin = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(`admin_auth_${config.id}`, 'true');
        }
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        return <GestionLogin onLogin={handleLogin} />;
    }

    if (view === 'home') return <GestionHome setView={setView} />;
    if (view === 'qr') return <GestionQR setView={setView} />;
    if (view === 'preview') return <DevicePreview config={config} onClose={() => setView('home')} />;
    
    return <GestionCategoria mode={view as any} setView={setView} />;
};
export default GestionApp;
