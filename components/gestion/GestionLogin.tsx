import React, { useState } from 'react';
import api from '../../services/api';
import { useConfig } from '../../context/ConfigContext';

interface GestionLoginProps {
    onLogin: () => void;
}

const GestionLogin: React.FC<GestionLoginProps> = ({ onLogin }) => {
    const { config } = useConfig();
    const isKanala = config?.name?.toLowerCase().includes('kanala');
    const isBolina = config?.name?.toLowerCase().includes('boliña') || config?.id === 'bolina_viejo_v1';
    const isDarkCustom = !isKanala && !isBolina && Boolean(config?.theme?.customColors?.isDark);
    const isDarkTheme = isKanala || isDarkCustom;
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('Introduce la contraseña de acceso.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.login('admin', password.trim(), config.id);
            onLogin();
        } catch (err: any) {
            setError(err.message || 'Contraseña incorrecta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-[80vh] p-4 ${isDarkTheme ? 'bg-black text-white' : 'bg-slate-50 text-slate-800'}`}>
            <div className={`w-full max-w-sm p-8 rounded-2xl shadow-xl border space-y-6 ${isDarkTheme ? 'bg-neutral-900 border-white/15' : 'bg-white border-slate-200'}`}>
                <div className="text-center space-y-3">
                    {isKanala ? (
                        <img
                            src="https://www.kanalabeach.eus/wp-content/uploads/2024/06/kanala-logos_LOGO-HORIZONTAL-zuria.png"
                            alt={config.name}
                            className="h-12 mx-auto object-contain"
                        />
                    ) : isBolina ? (
                        <img
                            src="/logo-bolina.jpg"
                            alt={config.name}
                            className="h-20 mx-auto object-contain mix-blend-multiply"
                        />
                    ) : config.logoUrl ? (
                        isDarkCustom ? (
                            <div className="inline-flex items-center justify-center bg-white rounded-2xl p-2 shadow-md">
                                <img
                                    src={config.logoUrl}
                                    alt={config.name}
                                    className="h-16 mx-auto object-contain"
                                />
                            </div>
                        ) : (
                            <img
                                src={config.logoUrl}
                                alt={config.name}
                                className="h-20 mx-auto object-contain"
                            />
                        )
                    ) : (
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center border border-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                    )}
                    <div>
                        <h1 className={`text-xl font-bold font-lora ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
                            Acceso Propietario
                        </h1>
                        <p className={`text-xs mt-1 ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
                            Panel de Gestión — {config.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkTheme ? 'text-neutral-300' : 'text-slate-600'}`}>
                            Contraseña de gestión
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => { setPassword(e.target.value); if (error) setError(''); }}
                            placeholder="Introduce tu clave"
                            autoFocus
                            className={`w-full px-4 py-3 rounded-xl border text-center text-base tracking-widest outline-none transition-all ${
                                isDarkTheme
                                    ? 'bg-neutral-800 border-white/20 text-white placeholder-neutral-500 focus:border-white'
                                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                            }`}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-xs font-semibold text-red-500 text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-50 ${
                            isDarkTheme
                                ? 'bg-white text-black hover:bg-neutral-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Verificando...' : 'Entrar a Gestión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GestionLogin;

