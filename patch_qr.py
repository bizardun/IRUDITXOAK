import re

with open('components/gestion/GestionQR.tsx', 'r') as f:
    content = f.read()

old_str = """                            <p className="text-slate-600 text-lg">
                                Para ver nuestros platos, precios y menú del día actualizado.
                            </p>"""

new_str = """                            <p className="text-slate-600 text-lg">
                                {config.name.toLowerCase().includes('kanala') ? 
                                    'Para ver nuestra oferta gastronómica actualizada a día de hoy.' : 
                                    'Para ver nuestros platos, precios y menú del día actualizado.'}
                            </p>"""

if old_str in content:
    content = content.replace(old_str, new_str)
    with open('components/gestion/GestionQR.tsx', 'w') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Could not find the string to replace")
