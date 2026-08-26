import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

current = """                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 relative w-9 h-6 sm:w-12 sm:h-8 transition-all ${lang === l.code ? 'scale-110 z-10' : 'hover:scale-105'}`}"""

new_val = """                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 flex items-center justify-center p-0 relative w-9 h-6 sm:w-12 sm:h-8 transition-all ${lang === l.code ? 'scale-110 z-10' : 'hover:scale-105'}`}"""

if current in content:
    content = content.replace(current, new_val)
    with open('components/cliente/ClienteApp.tsx', 'w') as f:
        f.write(content)
    print("Alignment fixed 2")
else:
    print("Could not find the block")

