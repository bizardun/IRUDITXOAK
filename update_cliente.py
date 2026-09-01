import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

footer_old = """                <footer className={`mt-12 sm:mt-20 pt-6 border-t text-center text-[11px] sm:text-[12px] uppercase tracking-widest font-black ${config.name.toLowerCase().includes('kanala') ? 'border-white/10 text-white/20' : 'border-slate-50 text-slate-200'}`}>
                    I.V.A. INCLUIDO • DATOS EN TIEMPO REAL
                </footer>"""

footer_new = """                <footer className={`mt-12 sm:mt-20 pt-6 border-t text-center text-[11px] sm:text-[12px] font-black ${config.name.toLowerCase().includes('kanala') ? 'border-white/10 text-white/20' : 'border-slate-50 text-slate-300'}`}>
                    <div className="uppercase tracking-widest mb-4">I.V.A. INCLUIDO • DATOS EN TIEMPO REAL</div>
                    {config.officialWebsite && (
                        <a href={config.officialWebsite} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:scale-105 ${config.name.toLowerCase().includes('kanala') ? 'border-white/20 text-white/50 hover:text-white hover:border-white/40' : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>
                            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            VISITAR WEB OFICIAL
                        </a>
                    )}
                </footer>"""

if footer_old in content:
    content = content.replace(footer_old, footer_new)
    with open('components/cliente/ClienteApp.tsx', 'w') as f:
        f.write(content)
    print("Updated ClienteApp footer")
else:
    print("Could not find footer")
