import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

# Replace import line
old = "import { IconChevronLeft, IconPlus, IconEdit, IconSort, IconArrowDown, IconAllergy, IconX } from '../icons';"
new = "import { IconChevronLeft, IconPlus, IconEdit, IconSort, IconArrowUp, IconArrowDown, IconAllergy, IconX } from '../icons';"

if old in content:
    content = content.replace(old, new)
    with open('components/gestion/GestionCategoria.tsx', 'w') as f:
        f.write(content)
    print("Fixed import")
else:
    print("Import not found, let's find the line:")
    for line in content.split('\\n'):
        if 'from \\'../icons\\'' in line:
            print(line)
