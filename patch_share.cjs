const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

// Replace state
content = content.replace(
    /const \[deployUrl, setDeployUrl\] = useState\(''\);/,
    `const [clientUrl, setClientUrl] = useState('');
    const [adminUrl, setAdminUrl] = useState('');
    const [copiedClient, setCopiedClient] = useState(false);
    const [copiedAdmin, setCopiedAdmin] = useState(false);`
);

// Remove copied state
content = content.replace(
    /const \[copied, setCopied\] = useState\(false\);/,
    ``
);

// Replace closeShare
content = content.replace(
    /const closeShare = \(\) => \{ setSharingApp\(null\); setCopied\(false\); \};/,
    `const closeShare = () => { setSharingApp(null); setCopiedClient(false); setCopiedAdmin(false); };`
);

// Replace copyToClipboard
content = content.replace(
    /const copyToClipboard = \(\) => \{[\s\S]*?\};\n/,
    ``
);

// Replace handleShareClick
const shareClickReplacement = `const handleShareClick = (e: React.MouseEvent, app: RestaurantConfig) => {
        e.stopPropagation();
        setSharingApp(app);
        setIsDeploying(true);
        setClientUrl('');
        setAdminUrl('');
        setCopiedClient(false);
        setCopiedAdmin(false);
        setTimeout(() => {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tu-dominio.vercel.app';
            setClientUrl(\`\${baseUrl}/?app=\${app.id}&client=true\`);
            setAdminUrl(\`\${baseUrl}/?app=\${app.id}&admin=true\`);
            setIsDeploying(false);
        }, 800);
    };`;
content = content.replace(
    /const handleShareClick = \([\s\S]*?1500\);\n    \};/,
    shareClickReplacement
);

// Replace the modal UI
const modalReplacement = `{isDeploying ? (
                                <div className="space-y-2"><h3 className="text-xl font-bold text-white">Generando Enlaces...</h3></div>
                            ) : (
                                <div className="w-full space-y-6 animate-fade-in-up text-left">
                                    <div className="space-y-1 text-center"><h3 className="text-xl font-bold text-white">¡{sharingApp.name} online!</h3><p className="text-slate-400 text-sm">Enlaces generados para tu Vercel.</p></div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">👩‍🍳 Panel de Administración (Dueño)</label>
                                        <div className="bg-slate-900 rounded-xl p-3 flex items-center gap-2 border border-blue-900/50">
                                            <input readOnly value={adminUrl} className="bg-transparent text-blue-400 text-xs font-mono flex-1 outline-none" />
                                            <button onClick={() => { navigator.clipboard.writeText(adminUrl); setCopiedAdmin(true); setTimeout(() => setCopiedAdmin(false), 2000); }} className={\`p-2 rounded-lg transition-all \${copiedAdmin ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}\`}>{copiedAdmin ? <IconCheck /> : <IconCopy />}</button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">🍽️ App Pública (Clientes / Carta)</label>
                                        <div className="bg-slate-900 rounded-xl p-3 flex items-center gap-2 border border-emerald-900/50">
                                            <input readOnly value={clientUrl} className="bg-transparent text-emerald-400 text-xs font-mono flex-1 outline-none" />
                                            <button onClick={() => { navigator.clipboard.writeText(clientUrl); setCopiedClient(true); setTimeout(() => setCopiedClient(false), 2000); }} className={\`p-2 rounded-lg transition-all \${copiedClient ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}\`}>{copiedClient ? <IconCheck /> : <IconCopy />}</button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <a href={\`https://wa.me/?text=Mira nuestra carta: \${clientUrl}\`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 rounded-xl font-bold text-sm transition-colors"><IconWhatsapp /> Enviar a Cliente</a>
                                        <button onClick={() => alert(\`QR generado para: \${clientUrl}\`)} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 py-2.5 rounded-xl font-bold text-sm transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M3 14h7v7H3z"/></svg> Ver QR Carta</button>
                                    </div>
                                </div>
                            )}`;

content = content.replace(
    /\{isDeploying \? \([\s\S]*?<\/div>\n                            \)\}/,
    modalReplacement
);

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
