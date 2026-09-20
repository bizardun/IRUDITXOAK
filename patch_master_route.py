import re

with open('context/ConfigContext.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "const isClientUrl = searchParams.get('client') === 'true' || hashParams.get('client') === 'true';",
    "const isExplicitMaster = searchParams.get('master') === 'true' || hashParams.get('master') === 'true';\n    const isClientUrl = !isExplicitMaster && (searchParams.get('client') === 'true' || hashParams.get('client') === 'true');"
)

c = c.replace(
    "const isOwnerUrl = searchParams.get('admin') === 'true' || hashParams.get('admin') === 'true';",
    "const isOwnerUrl = !isExplicitMaster && (searchParams.get('admin') === 'true' || hashParams.get('admin') === 'true');"
)

c = c.replace(
    "const isMasterAdmin = !isClientUrl && !isOwnerUrl;",
    "const isMasterAdmin = isExplicitMaster || (!isClientUrl && !isOwnerUrl);"
)

with open('context/ConfigContext.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

