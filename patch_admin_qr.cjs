const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

// Add admin state
content = content.replace(
    "const [cleanUrl, setCleanUrl] = useState('');",
    "const [cleanUrl, setCleanUrl] = useState('');\n    const [adminCleanUrl, setAdminCleanUrl] = useState('');\n    const [adminQrUrl, setAdminQrUrl] = useState('');"
);

// Update first useEffect
content = content.replace(
    /        const baseUrl = originUrl \+ "\/\?app=" \+ config\.id \+ "&client=true";\s*setCleanUrl\(baseUrl\);/,
    `        const baseUrl = originUrl + "/?app=" + config.id + "&client=true";
        const adminUrl = originUrl + "/?app=" + config.id + "&admin=true";
        setCleanUrl(baseUrl);
        setAdminCleanUrl(adminUrl);`
);

// Update second useEffect
content = content.replace(
    /        const timer = setTimeout\(\(\) => \{\s*const qrSource = \`https:\/\/api\.qrserver\.com\/v1\/create-qr-code\/\?data=\$\{encodeURIComponent\(cleanUrl\)\}&size=1000x1000&qzone=1&bgcolor=ffffff\`;\s*setQrUrl\(qrSource\);\s*\}, 500\);\s*return \(\) => clearTimeout\(timer\);\s*\}, \[cleanUrl\]\);/,
    `        const timer = setTimeout(() => {
            const qrSource = \`https://api.qrserver.com/v1/create-qr-code/?data=\${encodeURIComponent(cleanUrl)}&size=1000x1000&qzone=1&bgcolor=ffffff\`;
            setQrUrl(qrSource);
            const adminQrSource = \`https://api.qrserver.com/v1/create-qr-code/?data=\${encodeURIComponent(adminCleanUrl)}&size=500x500&qzone=1&bgcolor=ffffff\`;
            setAdminQrUrl(adminQrSource);
        }, 500);
        return () => clearTimeout(timer);
    }, [cleanUrl, adminCleanUrl]);`
);

// Modify layout
content = content.replace(
    /<div className="flex-1 flex justify-center p-4 sm:p-8 overflow-auto bg-slate-100">/,
    `<div className="flex-1 flex flex-col xl:flex-row items-center xl:items-start justify-center p-4 sm:p-8 gap-8 overflow-auto bg-slate-100">`
);

// Add the Admin QR box below the cartel
content = content.replace(
    /                <\/div>\s*<\/div>\s*<style>/,
    `                </div>
                
                {/* Admin Access Box (Not printed) */}
                <div className="bg-white shadow-xl border border-slate-200 rounded-2xl p-6 w-full max-w-[210mm] xl:max-w-xs flex flex-col items-center text-center print:hidden">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h3 className="font-bold text-xl text-slate-800 mb-2">Acceso Propietario</h3>
                    <p className="text-slate-500 text-sm mb-6">Escanea este QR con tu móvil para acceder al panel de gestión y editar los platos desde cualquier lugar usando tu contraseña.</p>
                    
                    <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 mb-4">
                        {adminQrUrl ? (
                            <img src={adminQrUrl} alt="QR Acceso Admin" className="w-48 h-48 mix-blend-multiply" />
                        ) : (
                            <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-sm">Generando...</div>
                        )}
                    </div>
                    
                    <p className="text-xs font-mono text-slate-400 break-all px-4">{adminCleanUrl}</p>
                </div>
            </div>
             <style>`
);

fs.writeFileSync('components/gestion/GestionQR.tsx', content);
