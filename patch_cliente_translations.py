import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

old_footer = """<div className="uppercase tracking-widest mb-4">I.V.A. INCLUIDO • DATOS EN TIEMPO REAL</div>
                    {config.officialWebsite && (
                        <a href={config.officialWebsite} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:scale-105 ${config.name.toLowerCase().includes('kanala') ? 'border-white/20 text-white/50 hover:text-white hover:border-white/40' : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>
                            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            VISITAR WEB OFICIAL
                        </a>
                    )}"""

new_footer = """<div className="uppercase tracking-widest mb-4">{t.ivaYDatos}</div>
                    {config.officialWebsite && (
                        <a href={config.officialWebsite} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:scale-105 ${config.name.toLowerCase().includes('kanala') ? 'border-white/20 text-white/50 hover:text-white hover:border-white/40' : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>
                            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            {t.visitarWeb}
                        </a>
                    )}"""

if old_footer in content:
    content = content.replace(old_footer, new_footer)
    with open('components/cliente/ClienteApp.tsx', 'w') as f:
        f.write(content)
    print("Updated ClienteApp footer translations")
else:
    print("Could not find footer in ClienteApp")
