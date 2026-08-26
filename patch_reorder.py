import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

funcs = """    const handleDrop = async (e: React.DragEvent, targetItem: Plato) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.ID_Plato === targetItem.ID_Plato) return;

        const currentIndex = platos.findIndex(p => p.ID_Plato === draggedItem.ID_Plato);
        const targetIndex = platos.findIndex(p => p.ID_Plato === targetItem.ID_Plato);

        if (currentIndex === -1 || targetIndex === -1) return;

        const newPlatos = [...platos];
        const [removed] = newPlatos.splice(currentIndex, 1);
        newPlatos.splice(targetIndex, 0, removed);

        await reorderPlatos(newPlatos);
        setDraggedItem(null);
    };

    const movePlatoUp = async (e: React.MouseEvent, item: Plato) => {
        e.preventDefault();
        e.stopPropagation();
        const index = platos.findIndex(p => p.ID_Plato === item.ID_Plato);
        if (index <= 0) return;
        
        const newPlatos = [...platos];
        const temp = newPlatos[index];
        newPlatos[index] = newPlatos[index - 1];
        newPlatos[index - 1] = temp;
        
        await reorderPlatos(newPlatos);
    };

    const movePlatoDown = async (e: React.MouseEvent, item: Plato) => {
        e.preventDefault();
        e.stopPropagation();
        const index = platos.findIndex(p => p.ID_Plato === item.ID_Plato);
        if (index === -1 || index === platos.length - 1) return;
        
        const newPlatos = [...platos];
        const temp = newPlatos[index];
        newPlatos[index] = newPlatos[index + 1];
        newPlatos[index + 1] = temp;
        
        await reorderPlatos(newPlatos);
    };"""

content = re.sub(
    r"    const handleDrop = async.*?setDraggedItem\(null\);\n    };",
    funcs,
    content,
    flags=re.DOTALL
)

import_icons_old = "import { IconEdit, IconPlus, IconSort, IconTrash, IconAllergy } from '../icons';"
import_icons_new = "import { IconEdit, IconPlus, IconSort, IconTrash, IconAllergy, IconArrowUp, IconArrowDown } from '../icons';"
content = content.replace(import_icons_old, import_icons_new)

with open('components/gestion/GestionCategoria.tsx', 'w') as f:
    f.write(content)
print("Added move functions")
