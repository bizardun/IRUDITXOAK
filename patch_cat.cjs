const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionCategoria.tsx', 'utf8');

const search = `                <div className="flex items-center gap-3">
                    <button onClick={() => setView('home')} className="p-1.5 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600"><IconChevronLeft /></button>
                    <h2 className="text-xl font-bold font-lora text-slate-800 capitalize">{mode === 'raciones' ? 'Gestión Raciones' : mode}</h2>
                </div>`;

const replace = `                <div className="flex items-center gap-3">
                    <button onClick={() => setView('home')} className="flex items-center gap-2 group text-left transition-colors">
                        <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 text-slate-600 transition-colors">
                            <IconChevronLeft className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold font-lora text-slate-800 group-hover:text-slate-900 capitalize transition-colors">
                            {mode === 'raciones' ? 'Gestión Raciones' : mode}
                        </h2>
                    </button>
                </div>`;

content = content.replace(search, replace);
fs.writeFileSync('components/gestion/GestionCategoria.tsx', content);
