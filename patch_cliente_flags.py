import re

with open('components/cliente/ClienteApp.tsx', 'r') as f:
    content = f.read()

# Add isKanala if missing in main component
if "const isKanala = config?.name?.toLowerCase().includes('kanala');" not in content:
    content = content.replace(
        "const { config } = useConfig();\n    const [lang, setLang] = useState<Language['code']>('ES');",
        "const { config } = useConfig();\n    const isKanala = config?.name?.toLowerCase().includes('kanala');\n    const [lang, setLang] = useState<Language['code']>('ES');"
    )

old_flag_button = """                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 w-9 h-6 sm:w-12 sm:h-8 rounded-lg border-2 transition-all ${lang === l.code ? `${styles.buttonActive} scale-110 shadow-md` : 'border-transparent opacity-40 hover:opacity-100'}`}
                        >
                            <l.flag />
                        </button>
                    ))}"""

new_flag_button = """                    {languages.map(l => (
                        <button 
                            key={l.code} 
                            onClick={() => setLang(l.code)} 
                            className={`flex-shrink-0 w-9 h-6 sm:w-12 sm:h-8 rounded-lg transition-all overflow-hidden ${isKanala ? 'border border-neutral-500/50' : 'border-2'} ${lang === l.code ? (isKanala ? 'ring-2 ring-white scale-110 shadow-md opacity-100' : `${styles.buttonActive} scale-110 shadow-md opacity-100`) : (isKanala ? 'opacity-40 hover:opacity-100' : 'border-transparent opacity-40 hover:opacity-100')}`}
                        >
                            <l.flag />
                        </button>
                    ))}"""

if old_flag_button in content:
    content = content.replace(old_flag_button, new_flag_button)
    with open('components/cliente/ClienteApp.tsx', 'w') as f:
        f.write(content)
    print("Replaced flags in ClienteApp")
else:
    print("Could not find flag button in ClienteApp")

