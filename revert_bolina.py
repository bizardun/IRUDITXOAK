import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

old_block = """                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 flex items-center justify-center p-0 relative w-9 h-6 sm:w-12 sm:h-8 transition-all ${lang === l.code ? 'scale-110 z-10' : 'hover:scale-105'}`}
                            style={{
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #64748b 0%, #ffffff 50%, #64748b 100%)',
                                padding: '1.5px',
                                boxShadow: lang === l.code ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none'
                            }}
                        >
                            <div className={`w-full h-full rounded-[6.5px] overflow-hidden ${isKanala ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
                                <div className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${lang === l.code ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                                    <l.flag />
                                </div>
                            </div>
                        </button>
                    ))}"""

new_block = """                    {languages.map(l => (
                        isKanala ? (
                            <button 
                                key={l.code} 
                                onClick={() => setLang(l.code)} 
                                className={`flex-shrink-0 flex items-center justify-center p-0 relative w-9 h-6 sm:w-12 sm:h-8 transition-all ${lang === l.code ? 'scale-110 z-10' : 'hover:scale-105'}`}
                                style={{
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #64748b 0%, #ffffff 50%, #64748b 100%)',
                                    padding: '1.5px',
                                    boxShadow: lang === l.code ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none'
                                }}
                            >
                                <div className="w-full h-full rounded-[6.5px] overflow-hidden bg-black flex items-center justify-center">
                                    <div className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${lang === l.code ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                                        <l.flag />
                                    </div>
                                </div>
                            </button>
                        ) : (
                            <button 
                                key={l.code} 
                                onClick={() => setLang(l.code)} 
                                className={`flex-shrink-0 w-9 h-6 sm:w-12 sm:h-8 rounded-lg border-2 transition-all ${lang === l.code ? `${styles.buttonActive} scale-110 shadow-md` : 'border-transparent opacity-40 hover:opacity-100'}`}
                            >
                                <l.flag />
                            </button>
                        )
                    ))}"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('components/cliente/ClienteApp.tsx', 'w') as f:
        f.write(content)
    print("Reverted for Boliña successfully")
else:
    print("Old block not found!")
