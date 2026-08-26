import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

bad_attrs = """                                                draggable
                                                onDragStart={(e) => handleDragStart(e, p)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, p)}"""

if bad_attrs in content:
    content = content.replace(bad_attrs, "")
    with open('components/gestion/GestionCategoria.tsx', 'w') as f:
        f.write(content)
    print("Removed draggable attributes")
else:
    print("Could not find draggable attributes")
