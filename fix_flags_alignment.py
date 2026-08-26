import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

old_block = """                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 relative w-9 h-6 sm:w-12 sm:h-8 transition-all ${lang === l.code ? 'scale-110 z-10' : 'hover:scale-105'}`}
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

# first verify
import sys
current = """                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 relative w-9 h-6 sm:w-12 sm:h-8 transition-all ${lang === l.code ? 'scale-110 z-10' : 'hover:scale-105'}`}
                            style={{
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #64748b 0%, #ffffff 50%, #64748b 100%)',
                                padding: '1.5px',
                                boxShadow: lang === l.code ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none'
                            }}
                        >
                            <div className={`w-full h-full rounded-[6.5px] overflow-hidden ${isKanala ? 'bg-black' : 'bg-white'}`}>
                                <div className={`w-full h-full transition-opacity duration-300 ${lang === l.code ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                                    <l.flag />
                                </div>
                            </div>
                        </button>
                    ))}"""
                    
if current in content:
    content = content.replace(current, old_block)
    with open('components/cliente/ClienteApp.tsx', 'w') as f:
        f.write(content)
    print("Alignment fixed")
else:
    print("Could not find the block")

