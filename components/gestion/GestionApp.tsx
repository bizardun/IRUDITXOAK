
import React, { useState } from 'react';
import GestionHome from './GestionHome';
import GestionCategoria from './GestionCategoria';
import GestionQR from './GestionQR';
import DevicePreview from '../factory/DevicePreview';
import { useConfig } from '../../context/ConfigContext';
import GestionLogin from './GestionLogin';

const GestionApp: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
    const [view, setView] = useState<'home' | 'menu' | 'carta' | 'raciones' | 'qr' | 'preview'>('home');
    const { config } = useConfig();

        const handleLogin = () => {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) return <GestionLogin onLogin={handleLogin} />;

    if (view === 'home') return <GestionHome setView={setView} />;
    if (view === 'qr') return <GestionQR setView={setView} />;
    if (view === 'preview') return <DevicePreview config={config} onClose={() => setView('home')} />;
    
    return <GestionCategoria mode={view as any} setView={setView} />;
};
export default GestionApp;
