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
        
        // Find items in the same category to determine relative order
        const catPlatos = platos.filter(p => p.Tipo === item.Tipo);
        const catIndex = catPlatos.findIndex(p => p.ID_Plato === item.ID_Plato);
        
        if (catIndex <= 0) return; // Already at the top of its category
        
        const prevItem = catPlatos[catIndex - 1];
        
        const globalIndex = platos.findIndex(p => p.ID_Plato === item.ID_Plato);
        const globalPrevIndex = platos.findIndex(p => p.ID_Plato === prevItem.ID_Plato);
        
        const newPlatos = [...platos];
        const temp = newPlatos[globalIndex];
        newPlatos[globalIndex] = newPlatos[globalPrevIndex];
        newPlatos[globalPrevIndex] = temp;
        
        await reorderPlatos(newPlatos);
    };

    const movePlatoDown = async (e: React.MouseEvent, item: Plato) => {
        e.preventDefault();
        e.stopPropagation();
        
        const catPlatos = platos.filter(p => p.Tipo === item.Tipo);
        const catIndex = catPlatos.findIndex(p => p.ID_Plato === item.ID_Plato);
        
        if (catIndex === -1 || catIndex === catPlatos.length - 1) return; // Already at the bottom
        
        const nextItem = catPlatos[catIndex + 1];
        
        const globalIndex = platos.findIndex(p => p.ID_Plato === item.ID_Plato);
        const globalNextIndex = platos.findIndex(p => p.ID_Plato === nextItem.ID_Plato);
        
        const newPlatos = [...platos];
        const temp = newPlatos[globalIndex];
        newPlatos[globalIndex] = newPlatos[globalNextIndex];
        newPlatos[globalNextIndex] = temp;
        
        await reorderPlatos(newPlatos);
    };"""

content = re.sub(
    r"    const handleDrop = async.*?setDraggedItem\(null\);\n    };.*?await reorderPlatos\(newPlatos\);\n    };",
    funcs,
    content,
    flags=re.DOTALL
)

with open('components/gestion/GestionCategoria.tsx', 'w') as f:
    f.write(content)
print("Move logic patched")
