import re

with open('context/ConfigContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add isInitializing to context type? No, just local state.
content = content.replace(
    "const isMasterAdmin = !isClientUrl && !isOwnerUrl;",
    "const isMasterAdmin = !isClientUrl && !isOwnerUrl;\n    const [isInitializing, setIsInitializing] = useState(true);"
)

content = content.replace(
    "setAvailableApps([bolinaConfig]);\n            }",
    "setAvailableApps([bolinaConfig]);\n            } finally { setIsInitializing(false); }"
)

content = content.replace(
    "return (\n        <ConfigContext.Provider value={{",
    "if (isInitializing && !isMasterAdmin) return <div className=\"min-h-screen bg-slate-900 flex items-center justify-center\"><div className=\"animate-pulse flex flex-col items-center gap-4\"><div className=\"w-12 h-12 border-4 border-slate-700 border-t-white rounded-full animate-spin\"></div><p className=\"text-slate-400 font-medium\">Cargando restaurante...</p></div></div>;\n\n    return (\n        <ConfigContext.Provider value={{"
)

with open('context/ConfigContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
