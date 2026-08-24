const fs = require('fs');
let content = fs.readFileSync('components/gestion/MenuForm.tsx', 'utf8');

// Also ensure descriptions can be edited and saved in the management form
const oldSubmit = `        const newPlato: Plato = {
            ID_Plato: plato?.ID_Plato || Date.now(),
            ES_Nombre: formData.ES_Nombre,
            EU_Nombre: formData.EU_Nombre || formData.ES_Nombre,
            EN_Nombre: formData.EN_Nombre || formData.ES_Nombre,
            FR_Nombre: formData.FR_Nombre || formData.ES_Nombre,
            DE_Nombre: formData.DE_Nombre || formData.ES_Nombre,
            IT_Nombre: formData.IT_Nombre || formData.ES_Nombre,
            Precio: parseFloat(formData.Precio) || 0,
            Categoria: formData.Categoria as Categoria,
            Tipo: formData.Tipo as TipoPlato,
            Activo_Dia: formData.Activo_Dia,
            Rol_Menu: null,
            Es_Racion: false,
            Alergenos: formData.Alergenos
        };`;

const newSubmit = `        const newPlato: Plato = {
            ID_Plato: plato?.ID_Plato || Date.now(),
            ES_Nombre: formData.ES_Nombre,
            EU_Nombre: formData.EU_Nombre || formData.ES_Nombre,
            EN_Nombre: formData.EN_Nombre || formData.ES_Nombre,
            FR_Nombre: formData.FR_Nombre || formData.ES_Nombre,
            DE_Nombre: formData.DE_Nombre || formData.ES_Nombre,
            IT_Nombre: formData.IT_Nombre || formData.ES_Nombre,
            Precio: parseFloat(formData.Precio) || 0,
            Categoria: formData.Categoria as Categoria,
            Tipo: formData.Tipo as TipoPlato,
            Activo_Dia: formData.Activo_Dia,
            Rol_Menu: null,
            Es_Racion: false,
            Alergenos: formData.Alergenos,
            Descripcion: formData.Descripcion,
            EU_Descripcion: formData.EU_Descripcion,
            EN_Descripcion: formData.EN_Descripcion,
            FR_Descripcion: formData.FR_Descripcion,
            DE_Descripcion: formData.DE_Descripcion,
            IT_Descripcion: formData.IT_Descripcion
        };`;
        
// Initialize state properly
const oldState = `    const [formData, setFormData] = useState({
        ES_Nombre: plato?.ES_Nombre || '',
        EU_Nombre: plato?.EU_Nombre || '',
        EN_Nombre: plato?.EN_Nombre || '',
        FR_Nombre: plato?.FR_Nombre || '',
        DE_Nombre: plato?.DE_Nombre || '',
        IT_Nombre: plato?.IT_Nombre || '',
        Precio: plato?.Precio.toString() || '',
        Categoria: plato?.Categoria || 'CARTA',
        Tipo: plato?.Tipo || 'ENTRANTE',
        Activo_Dia: plato ? plato.Activo_Dia : true,
        Alergenos: plato?.Alergenos || []
    });`;
    
const newState = `    const [formData, setFormData] = useState({
        ES_Nombre: plato?.ES_Nombre || '',
        EU_Nombre: plato?.EU_Nombre || '',
        EN_Nombre: plato?.EN_Nombre || '',
        FR_Nombre: plato?.FR_Nombre || '',
        DE_Nombre: plato?.DE_Nombre || '',
        IT_Nombre: plato?.IT_Nombre || '',
        Precio: plato?.Precio.toString() || '',
        Categoria: plato?.Categoria || 'CARTA',
        Tipo: plato?.Tipo || 'ENTRANTE',
        Activo_Dia: plato ? plato.Activo_Dia : true,
        Alergenos: plato?.Alergenos || [],
        Descripcion: plato?.Descripcion || '',
        EU_Descripcion: plato?.EU_Descripcion || '',
        EN_Descripcion: plato?.EN_Descripcion || '',
        FR_Descripcion: plato?.FR_Descripcion || '',
        DE_Descripcion: plato?.DE_Descripcion || '',
        IT_Descripcion: plato?.IT_Descripcion || ''
    });`;

// Form input for Description
const oldInputs = `                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>`;
                        
const newInputs = `                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Descripción / Ingredientes</label>
                    <textarea 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                        placeholder="Descripción corta del plato..."
                        rows={2}
                        value={formData.Descripcion}
                        onChange={(e) => setFormData({...formData, Descripcion: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>`;

content = content.replace(oldSubmit, newSubmit);
content = content.replace(oldState, newState);
content = content.replace(oldInputs, newInputs);
fs.writeFileSync('components/gestion/MenuForm.tsx', content);
