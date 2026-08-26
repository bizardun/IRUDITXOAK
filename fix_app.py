import re

with open('components/gestion/GestionApp.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const [view, setView] = useState<string>('home');",
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ALL' : 'home');"
)

with open('components/gestion/GestionApp.tsx', 'w') as f:
    f.write(content)
print("app default view updated")
