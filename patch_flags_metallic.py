import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

# We need to find the exact block to replace
old_block = """                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 w-9 h-6 sm:w-12 sm:h-8 rounded-lg transition-all overflow-hidden ${isKanala ? 'border border-neutral-500/50' : 'border-2'} ${lang === l.code ? (isKanala ? 'ring-2 ring-white scale-110 shadow-md opacity-100' : `${styles.buttonActive} scale-110 shadow-md opacity-100`) : (isKanala ? 'opacity-40 hover:opacity-100' : 'border-transparent opacity-40 hover:opacity-100')}`}
                        >
                            <l.flag />
                        </button>
                    ))}"""

new_block = """                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 relative w-9 h-6 sm:w-12 sm:h-8 transition-all ${lang === l.code ? 'scale-110 z-10' : 'hover:scale-105'} ${!isKanala ? (lang === l.code ? `rounded-lg border-2 ${styles.buttonActive} shadow-md` : 'rounded-lg border-2 border-transparent') : ''}`}
                            style={isKanala ? {
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #64748b 0%, #ffffff 50%, #64748b 100%)',
                                padding: '1.5px',
                                boxShadow: lang === l.code ? '0 0 12px rgba(255, 255, 255, 0.8)' : '0 0 5px rgba(148, 163, 184, 0.5)'
                            } : {}}
                        >
                            <div className={`w-full h-full rounded-[6.5px] overflow-hidden transition-opacity duration-300 ${lang === l.code ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                                <l.flag />
                            </div>
                        </button>
                    ))}"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('components/cliente/ClienteApp.tsx', 'w') as f:
        f.write(content)
    print("Metallic flags replaced successfully")
else:
    print("Failed to find old block")

