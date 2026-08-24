const fs = require('fs');
let content = fs.readFileSync('components/gestion/AddPlatoModal.tsx', 'utf8');

const oldSubmit = `        try {
            const payload: any = { 
                ...data, 
                Precio: parseFloat(data.Precio) || 0,
                Alergenos: selectedAllergens,
                Categoria: platoToEdit?.Categoria || (mode === 'menu' ? 'MENU,CARTA' : 'CARTA')
            };`;

const newSubmit = `        try {
            const payload: any = { 
                ...data, 
                Precio: parseFloat(data.Precio) || 0,
                Alergenos: selectedAllergens,
                Categoria: platoToEdit?.Categoria || (mode === 'menu' ? 'MENU,CARTA' : 'CARTA'),
                Descripcion: data.Descripcion
            };`;

if(content.includes(oldSubmit)) {
    content = content.replace(oldSubmit, newSubmit);
    fs.writeFileSync('components/gestion/AddPlatoModal.tsx', content);
    console.log("Form Patched correctly 3");
} else {
    console.log("Already patched or pattern not found 3");
}
