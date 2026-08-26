import re

with open('components/gestion/AddPlatoModal.tsx', 'r') as f:
    content = f.read()

new_hooks = '''    const { config } = useConfig();
    const isKanala = config.name.toLowerCase().includes('kanala');
    const initialData = { ES_Nombre: '', Precio: '', Tipo: ['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'].includes(mode) ? mode : 'ENTRANTE' };'''

content = content.replace(
    "    const initialData = { ES_Nombre: '', Precio: '', Tipo: ['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'].includes(mode) ? mode : 'ENTRANTE' };",
    new_hooks
)

with open('components/gestion/AddPlatoModal.tsx', 'w') as f:
    f.write(content)
