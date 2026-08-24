const fs = require('fs');
let content = fs.readFileSync('components/gestion/AddPlatoModal.tsx', 'utf8');

const oldSubmit = `        const platoData: Plato = {
            ID_Plato: initialData?.ID_Plato || Date.now(),
            ES_Nombre: data.ES_Nombre,
            EU_Nombre: data.EU_Nombre,
            EN_Nombre: data.EN_Nombre,
            FR_Nombre: data.FR_Nombre,
            DE_Nombre: data.DE_Nombre,
            IT_Nombre: data.IT_Nombre,
            Precio: parseFloat(data.Precio.toString()) || 0,
            Categoria: data.Categoria,
            Tipo: data.Tipo,
            Activo_Dia: data.Activo_Dia,
            Rol_Menu: null,
            Es_Racion: false,
            Alergenos: data.Alergenos
        };`;

const newSubmit = `        const platoData: Plato = {
            ID_Plato: initialData?.ID_Plato || Date.now(),
            ES_Nombre: data.ES_Nombre,
            EU_Nombre: data.EU_Nombre,
            EN_Nombre: data.EN_Nombre,
            FR_Nombre: data.FR_Nombre,
            DE_Nombre: data.DE_Nombre,
            IT_Nombre: data.IT_Nombre,
            Precio: parseFloat(data.Precio.toString()) || 0,
            Categoria: data.Categoria,
            Tipo: data.Tipo,
            Activo_Dia: data.Activo_Dia,
            Rol_Menu: null,
            Es_Racion: false,
            Alergenos: data.Alergenos,
            Descripcion: (data as any).Descripcion,
            EU_Descripcion: (data as any).EU_Descripcion,
            EN_Descripcion: (data as any).EN_Descripcion,
            FR_Descripcion: (data as any).FR_Descripcion,
            DE_Descripcion: (data as any).DE_Descripcion,
            IT_Descripcion: (data as any).IT_Descripcion
        };`;
        
const oldState = `    const [data, setData] = useState({
        ES_Nombre: initialData?.ES_Nombre || '',
        EU_Nombre: initialData?.EU_Nombre || '',
        EN_Nombre: initialData?.EN_Nombre || '',
        FR_Nombre: initialData?.FR_Nombre || '',
        DE_Nombre: initialData?.DE_Nombre || '',
        IT_Nombre: initialData?.IT_Nombre || '',
        Precio: initialData?.Precio || '',
        Categoria: initialData?.Categoria || 'CARTA',
        Tipo: initialData?.Tipo || 'ENTRANTE',
        Activo_Dia: initialData !== undefined ? initialData.Activo_Dia : true,
        Alergenos: initialData?.Alergenos || []
    });`;
    
const newState = `    const [data, setData] = useState({
        ES_Nombre: initialData?.ES_Nombre || '',
        EU_Nombre: initialData?.EU_Nombre || '',
        EN_Nombre: initialData?.EN_Nombre || '',
        FR_Nombre: initialData?.FR_Nombre || '',
        DE_Nombre: initialData?.DE_Nombre || '',
        IT_Nombre: initialData?.IT_Nombre || '',
        Precio: initialData?.Precio || '',
        Categoria: initialData?.Categoria || 'CARTA',
        Tipo: initialData?.Tipo || 'ENTRANTE',
        Activo_Dia: initialData !== undefined ? initialData.Activo_Dia : true,
        Alergenos: initialData?.Alergenos || [],
        Descripcion: (initialData as any)?.Descripcion || '',
        EU_Descripcion: (initialData as any)?.EU_Descripcion || '',
        EN_Descripcion: (initialData as any)?.EN_Descripcion || '',
        FR_Descripcion: (initialData as any)?.FR_Descripcion || '',
        DE_Descripcion: (initialData as any)?.DE_Descripcion || '',
        IT_Descripcion: (initialData as any)?.IT_Descripcion || ''
    });`;

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
                        <textarea className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acompañado de patatas y salsa..." rows={2} value={(data as any).Descripcion} onChange={e => setData({...data, Descripcion: e.target.value})} />
                    </div>`;

if(content.includes(oldState)) {
    content = content.replace(oldState, newState);
    content = content.replace(oldSubmit, newSubmit);
    content = content.replace(oldInputs, newInputs);
    fs.writeFileSync('components/gestion/AddPlatoModal.tsx', content);
    console.log("Form Patched correctly");
} else {
    console.log("Already patched or pattern not found");
}
