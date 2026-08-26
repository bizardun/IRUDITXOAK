const fs = require('fs');
let content = fs.readFileSync('components/gestion/AddPlatoModal.tsx', 'utf8');

// Update Props
content = content.replace(
    "interface AddPlatoModalProps {\n    isOpen: boolean;\n    onClose: () => void;\n    mode: 'menu' | 'carta' | 'raciones';\n    refreshData: () => Promise<void>;\n    platoToEdit?: Plato | null;\n}",
    "interface AddPlatoModalProps {\n    isOpen: boolean;\n    onClose: () => void;\n    mode: string;\n    refreshData: () => Promise<void>;\n    platoToEdit?: Plato | null;\n}"
);

// Update InitialData
const validTypes = "['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE']";
content = content.replace(
    "const initialData = { ES_Nombre: '', Precio: '', Tipo: 'ENTRANTE' };",
    "const initialData = { ES_Nombre: '', Precio: '', Tipo: ['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'].includes(mode) ? mode : 'ENTRANTE' };"
);

fs.writeFileSync('components/gestion/AddPlatoModal.tsx', content);
console.log('AddPlatoModal mode patched!');
