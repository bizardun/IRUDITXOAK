import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

old_block = """                            <div className="w-full h-full rounded-[6.5px] overflow-hidden bg-black">"""

new_block = """                            <div className={`w-full h-full rounded-[6.5px] overflow-hidden ${isKanala ? 'bg-black' : 'bg-white'}`}>"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('components/cliente/ClienteApp.tsx', 'w') as f:
        f.write(content)
    print("Fixed bg-black to be conditional")
else:
    print("Could not find the block")
