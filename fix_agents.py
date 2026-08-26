import re

with open('AGENTS.md', 'r') as f:
    content = f.read()

old_str = "- **Universalidad:** Este diseño aplica obligatoriamente a TODOS los restaurantes (Kanala, Boliña, y cualquier futuro local), independientemente de si su fondo es claro u oscuro."
new_str = "- **Exclusividad para Temas Oscuros (Kanala):** Este diseño metálico SOLO debe aplicarse a restaurantes con temas oscuros o premium (como Kanala). Para restaurantes de tema claro (como Boliña), se deben mantener los bordes de color del tema original del restaurante sin efecto metálico."

if old_str in content:
    content = content.replace(old_str, new_str)
    with open('AGENTS.md', 'w') as f:
        f.write(content)
    print("Fixed AGENTS.md successfully")
else:
    print("Could not find the rule in AGENTS.md")
