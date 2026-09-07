import re

with open('AGENTS.md', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "1. **Uso de Base de Conocimientos Local:** Para Kanala Beach, el sistema ahora integra un diccionario estructurado estático (`src/data/kanala_dictionary.json`). La IA **SIEMPRE** consulta internamente este archivo primero. Si el plato existe, la traducción se inyecta directamente (para EU, EN, FR) sin inventar nada.",
    "1. **Uso de Base de Conocimientos Local y Universal:** Esta regla aplica de forma CONSTANTE para todas las apps que se creen a partir de ahora (Kanala Beach, Boliña, etc.). Si existe un diccionario estructurado estático (como `src/data/kanala_dictionary.json` u otros equivalentes creados para cada app) o si el usuario proporciona un menú oficial, la IA **SIEMPRE** debe consultar internamente esa base de conocimientos primero. Si el plato o término existe, la traducción o dato se inyecta directamente respetando el origen sin inventar, deducir ni alterar NADA."
)

with open('AGENTS.md', 'w', encoding='utf-8') as f:
    f.write(content)
