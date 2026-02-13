import React, { useState } from 'react';
import GestionHome from './GestionHome';
import GestionCategoria from './GestionCategoria';
import GestionQR from './GestionQR';

const GestionApp: React.FC = () => {
    const [view, setView] = useState<'home' | 'menu' | 'carta' | 'raciones' | 'qr'>('home');

    if (view === 'home') return <GestionHome setView={setView} />;
    if (view === 'qr') return <GestionQR setView={setView} />;
    return <GestionCategoria mode={view} setView={setView} />;
};
export default GestionApp;