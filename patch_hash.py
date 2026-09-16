import re

with open('context/ConfigContext.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Update param reading to also check hash
hash_logic = """    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const hashParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.hash.replace(/^#\/?\??/, '')) : new URLSearchParams();
    
    const isClientUrl = searchParams.get('client') === 'true' || hashParams.get('client') === 'true';
    const isOwnerUrl = searchParams.get('admin') === 'true' || hashParams.get('admin') === 'true';
"""

c = c.replace(
    "    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();\n    const isClientUrl = searchParams.get('client') === 'true';\n    const isOwnerUrl = searchParams.get('admin') === 'true';",
    hash_logic
)

c = c.replace(
    "const appIdParam = searchParams.get('app');",
    "const appIdParam = searchParams.get('app') || hashParams.get('app');"
)

with open('context/ConfigContext.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

