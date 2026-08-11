const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

// Add showQr state
content = content.replace(
    /const \[copiedAdmin, setCopiedAdmin\] = useState\(false\);/,
    `const [copiedAdmin, setCopiedAdmin] = useState(false);
    const [showQr, setShowQr] = useState(false);`
);

// Reset showQr when opening modal
content = content.replace(
    /setCopiedAdmin\(false\);/,
    `setCopiedAdmin(false);\n        setShowQr(false);`
);

// Replace the Ver QR Carta button
const buttonReplacement = `<button onClick={() => setShowQr(!showQr)} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 py-2.5 rounded-xl font-bold text-sm transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M3 14h7v7H3z"/></svg> {showQr ? 'Ocultar QR' : 'Ver QR Carta'}</button>
                                    </div>
                                    {showQr && (
                                        <div className="mt-4 p-4 bg-white rounded-xl flex flex-col items-center justify-center animate-fade-in-up border-4 border-slate-700">
                                            <p className="text-slate-800 font-bold mb-2 text-sm">Escanea para ver la carta:</p>
                                            <img src={\`https://api.qrserver.com/v1/create-qr-code/?data=\${encodeURIComponent(clientUrl)}&size=300x300&qzone=1&bgcolor=ffffff\`} alt="QR Code" className="w-48 h-48 object-contain" />
                                        </div>
                                    )}
`;
content = content.replace(
    /<button onClick=\{\(\) => alert\(\`QR generado para: \$\{clientUrl\}\`\)\}[\s\S]*?<\/button>\n                                    <\/div>/,
    buttonReplacement
);

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
