import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

bad_block = """    const movePlatoDown = async (e: React.MouseEvent, item: Plato) => {
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

if bad_block in content:
    # replace only the last occurrence or just normal replace
    content = content.replace(bad_block, "")
    with open('components/gestion/GestionCategoria.tsx', 'w') as f:
        f.write(content)
    print("Fixed duplicate")
else:
    print("Not found")

