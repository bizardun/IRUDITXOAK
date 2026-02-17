
import React, { useState } from 'react';
import GestionHome from './GestionHome';
import GestionCategoria from './GestionCategoria';
import GestionQR from './GestionQR';
import DevicePreview from '../factory/DevicePreview';
import { useConfig } from '../../context/ConfigContext';

const GestionApp: React.FC = () => {
    const [view, setView] = useState<'home' | 'menu' | 'carta' | 'raciones' | 'qr' | 'preview'>('home');
    const { config } = useConfig();

    if (view === 'home') return <GestionHome setView={setView} />;
    if (view === 'qr') return <GestionQR setView={setView} />;
    if (view === 'preview') return <DevicePreview config={config} onClose={() => setView('home')} />;
    
    return <GestionCategoria mode={view as any} setView={setView} />;
};
export default GestionApp;
