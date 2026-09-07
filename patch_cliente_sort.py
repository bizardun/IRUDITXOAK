import re

with open('components/cliente/ClienteApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_order = "const order: string[] = ['PRODUCTO', 'PARA PICAR', 'DEL MAR', 'DE LA TIERRA', 'ARROCES', 'HAMBURGUESAS', 'PIZZAS', 'ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'];"

content = content.replace(
    "const order: TipoPlato[] = ['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'];",
    new_order
)

with open('components/cliente/ClienteApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
