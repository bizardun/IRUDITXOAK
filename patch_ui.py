import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

old_block = """                                                <div className={`cursor-grab active:cursor-grabbing p-1.5 rounded transition-colors ${isKanala ? 'text-neutral-400 hover:text-white' : 'text-slate-700 hover:text-blue-600'}`}>
                                                    <IconSort width={16} height={16} />
                                                </div>"""

new_block = """                                                <div className="flex flex-col items-center justify-center -ml-2 mr-1">
                                                    <button onClick={(e) => movePlatoUp(e, p)} className={`p-1 rounded transition-colors ${isKanala ? 'text-neutral-500 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                                                        <IconArrowUp width={18} height={18} />
                                                    </button>
                                                    <button onClick={(e) => movePlatoDown(e, p)} className={`p-1 rounded transition-colors ${isKanala ? 'text-neutral-500 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                                                        <IconArrowDown width={18} height={18} />
                                                    </button>
                                                </div>"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('components/gestion/GestionCategoria.tsx', 'w') as f:
        f.write(content)
    print("Replaced UI successfully")
else:
    print("Could not find UI block")

