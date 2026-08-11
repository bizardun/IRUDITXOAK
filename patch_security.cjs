const fs = require('fs');

// Patch ConfigContext
let configContent = fs.readFileSync('context/ConfigContext.tsx', 'utf8');
configContent = configContent.replace(
    /const isMasterAdmin = !isClientUrl && !isOwnerUrl;/,
    `const isMasterAdmin = searchParams.get('factory') === 'master';`
);
fs.writeFileSync('context/ConfigContext.tsx', configContent);

// Patch FactoryDashboard
let factoryContent = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');
const importRegex = /export default function FactoryDashboard\(\) \{/;
const newImport = `export default function FactoryDashboard() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');`;

factoryContent = factoryContent.replace(importRegex, newImport);

const returnRegex = /return \(\s*<div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8 relative">/;
const newReturn = `
    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-sm text-center">
                    <div className="w-16 h-16 bg-slate-700 rounded-2xl mx-auto flex items-center justify-center mb-6">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Acceso Maestro</h2>
                    <p className="text-slate-400 text-sm mb-6">Panel de control SaaS multitenant</p>
                    
                    <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Contraseña maestra"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white mb-4 text-center focus:border-emerald-500 outline-none"
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                if (password === 'admin123') setIsUnlocked(true);
                                else alert('Contraseña incorrecta');
                            }
                        }}
                    />
                    <button 
                        onClick={() => password === 'admin123' ? setIsUnlocked(true) : alert('Contraseña incorrecta')}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-lg font-bold transition-colors"
                    >
                        Desbloquear Panel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8 relative">`;

factoryContent = factoryContent.replace(returnRegex, newReturn);
fs.writeFileSync('components/factory/FactoryDashboard.tsx', factoryContent);
