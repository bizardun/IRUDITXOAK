import re

with open('types.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'officialWebsite?: string;',
    'officialWebsite?: string;\n    publicUrl?: string;'
)

with open('types.ts', 'w', encoding='utf-8') as f:
    f.write(c)

