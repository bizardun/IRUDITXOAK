import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

old_code = '''<div className="flex items-center gap-3">
                    <button onClick={() => setView('home')} className="flex items-center gap-2 group text-left transition-colors">
                        <div className={`p-2 rounded-full transition-colors ${isKanala ? 'bg-neutral-800 group-hover:bg-neutral-700 text-neutral-300' : 'bg-slate-100 group-hover:bg-slate-200 text-slate-600'}`}>
                            <IconChevronLeft className="w-6 h-6" />
                        </div>
                        <h2 className={`text-xl sm:text-2xl font-bold font-lora capitalize transition-colors ${isKanala ? 'text-white' : 'text-slate-800 group-hover:text-slate-900'}`}>
                            {mode === 'raciones' ? 'Gestión Raciones' : mode === 'carta' ? 'Carta Principal' : (translations['ES']?.tipos as any)?.[mode] || mode}
                        </h2>
                    </button>
                </div>'''

new_code = '''<div className="flex items-center gap-3">
                    {!(isKanala && mode === 'ALL') ? (
                        <button onClick={() => setView('home')} className="flex items-center gap-2 group text-left transition-colors">
                            <div className={`p-2 rounded-full transition-colors ${isKanala ? 'bg-neutral-800 group-hover:bg-neutral-700 text-neutral-300' : 'bg-slate-100 group-hover:bg-slate-200 text-slate-600'}`}>
                                <IconChevronLeft className="w-6 h-6" />
                            </div>
                            <h2 className={`text-xl sm:text-2xl font-bold font-lora capitalize transition-colors ${isKanala ? 'text-white' : 'text-slate-800 group-hover:text-slate-900'}`}>
                                {mode === 'raciones' ? 'Gestión Raciones' : mode === 'carta' ? 'Carta Principal' : (translations['ES']?.tipos as any)?.[mode] || mode}
                            </h2>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 pl-2">
                            <h2 className={`text-xl sm:text-2xl font-bold font-lora capitalize ${tc.text}`}>
                                Panel de Gestión
                            </h2>
                        </div>
                    )}
                </div>'''

if old_code in content:
    content = content.replace(old_code, new_code)
else:
    print("WARNING: Could not find old_code")

with open('components/gestion/GestionCategoria.tsx', 'w') as f:
    f.write(content)
print("Title fixed")
