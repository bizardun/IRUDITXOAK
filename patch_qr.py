import re

with open('components/gestion/GestionQR.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add a state for domain input
c = c.replace(
    'const [downloadingCartel, setDownloadingCartel] = useState(false);',
    'const [downloadingCartel, setDownloadingCartel] = useState(false);\n    const [domain, setDomain] = useState(config.publicUrl || (typeof window !== "undefined" ? window.location.origin : "https://tu-dominio.vercel.app"));\n    const { updateConfig } = useConfig();'
)

# Update useEffect to use domain
c = c.replace(
    "const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tu-dominio.vercel.app';",
    "const originUrl = domain.trim().replace(/\/$/, '');"
)

# Add UI to edit the domain
ui_addition = """                        <button onClick={handleDownloadCartel} disabled={downloadingCartel} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 shadow transition-all flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            {downloadingCartel ? '...' : 'Descargar Cartel'}
                        </button>
                    </div>
                </div>
                
                {/* Domain Config */}
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
                    <div>
                        <h3 className="font-bold text-amber-900 text-sm">Dominio Público (Importante)</h3>
                        <p className="text-amber-800 text-xs mt-1">Para evitar la pantalla de bloqueo de Google, debes usar el dominio real donde publiques la app (ej: Vercel, Netlify).</p>
                    </div>
                    <div className="flex w-full sm:w-auto gap-2">
                        <input 
                            type="text" 
                            value={domain} 
                            onChange={(e) => setDomain(e.target.value)}
                            onBlur={() => updateConfig({ publicUrl: domain })}
                            className="flex-1 sm:w-64 border border-amber-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-500 bg-white"
                            placeholder="https://mi-restaurante.vercel.app"
                        />
                    </div>
                </div>
"""

c = c.replace(
    """                        <button onClick={handleDownloadCartel} disabled={downloadingCartel} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 shadow transition-all flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            {downloadingCartel ? '...' : 'Descargar Cartel'}
                        </button>
                    </div>
                </div>""",
    ui_addition
)

with open('components/gestion/GestionQR.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

