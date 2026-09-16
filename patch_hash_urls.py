import re

with open('components/factory/FactoryDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'setClientUrl(`${baseUrl}/?app=${app.id}&client=true`);\n            setAdminUrl(`${baseUrl}/?app=${app.id}&admin=true`);',
    'setClientUrl(`${baseUrl}/#/?app=${app.id}&client=true`);\n            setAdminUrl(`${baseUrl}/#/?app=${app.id}&admin=true`);'
)

with open('components/factory/FactoryDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('components/gestion/GestionQR.tsx', 'r', encoding='utf-8') as f:
    c2 = f.read()

c2 = c2.replace(
    'const baseUrl = originUrl + "/?app=" + config.id + "&client=true";\n        const adminUrl = originUrl + "/?app=" + config.id + "&admin=true";',
    'const baseUrl = originUrl + "/#/?app=" + config.id + "&client=true";\n        const adminUrl = originUrl + "/#/?app=" + config.id + "&admin=true";'
)

with open('components/gestion/GestionQR.tsx', 'w', encoding='utf-8') as f:
    f.write(c2)

