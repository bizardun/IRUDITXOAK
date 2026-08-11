const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
    /const \[isAdmin, setIsAdmin\] = useState\(false\);/,
    `const [isAdminMode, setIsAdminMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('admin') === 'true' || window.location.hash === '#admin';
        }
        return false;
    });
    const [hasAdminAccess, setHasAdminAccess] = useState(isAdminMode);`
);

content = content.replace(
    /\{\/\* Navbar \*\/\}.*?\{isAdmin \? <GestionApp \/> : <ClienteApp \/>\}/s,
    `{/* Navbar */}
                {hasAdminAccess && (
                    <div className="print:hidden relative z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-2 px-4">
                        <div className="max-w-5xl mx-auto flex items-center justify-between">
                            {showMasterPanelButton ? (
                                <button
                                     onClick={enterFactory}
                                    className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs sm:text-sm transition-all hover:bg-slate-50 rounded-lg group"
                                >
                                    <div className="p-1.5 bg-slate-100 rounded-md group-hover:bg-slate-200 transition-colors">
                                        <IconHome />
                                    </div>
                                    <span className="hidden sm:inline">Panel Principal</span>
                                </button>
                            ) : (
                                <div className="flex-1"></div>
                            )}
                            <div className="flex bg-slate-100 p-1 rounded-full shadow-inner border border-slate-200">
                                <button
                                     onClick={() => setIsAdminMode(false)}
                                     className={\`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 \${
                                        !isAdminMode
                                         ? 'bg-amber-500 text-white shadow-md'
                                         : 'text-slate-400 hover:text-slate-600'
                                    }\`}
                                >
                                    <IconUser /> <span className="hidden sm:inline">Cliente (Vista Previa)</span>
                                </button>
                                
                                <button
                                     onClick={() => setIsAdminMode(true)}
                                     className={\`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 \${
                                        isAdminMode
                                         ? 'bg-blue-600 text-white shadow-md'
                                         : 'text-slate-400 hover:text-slate-600'
                                    }\`}
                                >
                                    <IconSettings /> <span className="hidden sm:inline">Gestión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isAdminMode ? <GestionApp /> : <ClienteApp />}`
);

fs.writeFileSync('App.tsx', content);
