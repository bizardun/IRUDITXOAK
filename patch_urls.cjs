const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

content = content.replace(
    /const baseUrl = typeof window !== 'undefined' \? window\.location\.origin : 'https:\/\/tu-dominio\.vercel\.app';/g,
    "const baseUrl = 'https://ais-pre-i7k7exrqtpi6zwjsrpoplx-11277431321.europe-west2.run.app';"
);

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
