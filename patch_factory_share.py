import re

with open('components/factory/FactoryDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "const baseUrl = 'https://ais-pre-i7k7exrqtpi6zwjsrpoplx-11277431321.europe-west2.run.app';",
    "const baseUrl = app.publicUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-i7k7exrqtpi6zwjsrpoplx-11277431321.europe-west2.run.app');"
)

with open('components/factory/FactoryDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

