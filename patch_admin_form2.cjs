const fs = require('fs');
let content = fs.readFileSync('components/gestion/AddPlatoModal.tsx', 'utf8');

const oldEffect = `            if (platoToEdit) {
                setData({ ES_Nombre: platoToEdit.ES_Nombre, Precio: platoToEdit.Precio.toString(), Tipo: platoToEdit.Tipo });
                const tr: Record<string, string> = {};`;

const newEffect = `            if (platoToEdit) {
                setData({ 
                    ES_Nombre: platoToEdit.ES_Nombre, 
                    Precio: platoToEdit.Precio.toString(), 
                    Tipo: platoToEdit.Tipo,
                    Descripcion: platoToEdit.Descripcion || ''
                });
                const tr: Record<string, string> = {};`;

const oldSave = `                const newPlato: Plato = {
                    ...platoToEdit,
                    ES_Nombre: data.ES_Nombre,
                    Precio: parseFloat(data.Precio.toString()),
                    Tipo: data.Tipo,
                    Alergenos: selectedAllergens,
                    Categoria: platoToEdit.Categoria
                };`;

const newSave = `                const newPlato: Plato = {
                    ...platoToEdit,
                    ES_Nombre: data.ES_Nombre,
                    Precio: parseFloat(data.Precio.toString()),
                    Tipo: data.Tipo,
                    Alergenos: selectedAllergens,
                    Categoria: platoToEdit.Categoria,
                    Descripcion: data.Descripcion
                };`;

const oldInputs = `                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nombre (Español)</label>
                        <input required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500" value={data.ES_Nombre} onChange={e => setData({...data, ES_Nombre: e.target.value})} />
                    </div>`;
                        
const newInputs = `                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nombre (Español)</label>
                        <input required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500" value={data.ES_Nombre} onChange={e => setData({...data, ES_Nombre: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Descripción / Ingredientes (Opcional)</label>
                        <textarea className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acompañado de patatas y salsa..." rows={2} value={data.Descripcion || ''} onChange={e => setData({...data, Descripcion: e.target.value})} />
                    </div>`;

if(content.includes(oldEffect)) {
    content = content.replace(oldEffect, newEffect);
    content = content.replace(oldSave, newSave);
    content = content.replace(oldInputs, newInputs);
    fs.writeFileSync('components/gestion/AddPlatoModal.tsx', content);
    console.log("Form Patched correctly 2");
} else {
    console.log("Already patched or pattern not found 2");
}
