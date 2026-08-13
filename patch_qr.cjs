const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

const search = `                <div className="p-4 flex flex-wrap gap-3 justify-between items-center">
                    <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                        <IconChevronLeft /> Volver
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Generador de QR (v2)</h1>`;

const replace = `                <div className="p-4 flex flex-wrap gap-3 justify-between items-center">
                    <button onClick={() => setView('home')} className="flex items-center gap-2 group text-left transition-colors">
                        <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 text-slate-600 transition-colors">
                            <IconChevronLeft className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold font-lora text-slate-800 group-hover:text-slate-900 transition-colors">
                            Generador de QR (v2)
                        </h1>
                    </button>`;

content = content.replace(search, replace);
fs.writeFileSync('components/gestion/GestionQR.tsx', content);
