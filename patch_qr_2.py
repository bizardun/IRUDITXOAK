import re

with open('components/gestion/GestionQR.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const { updateConfig } = useConfig();', 'const { updateAppConfig } = useConfig();')
c = c.replace('onBlur={() => updateConfig({ publicUrl: domain })}', 'onBlur={() => updateAppConfig({ publicUrl: domain })}')

with open('components/gestion/GestionQR.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

