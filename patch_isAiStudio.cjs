const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

content = content.replace(
    /const isAiStudio = typeof window !== 'undefined' && \(window\.location\.hostname\.includes\('\.run\.app'\) \|\| window\.location\.hostname === 'localhost'\);\n    const \[isUnlocked, setIsUnlocked\] = useState\(isAiStudio\);/,
    `const [isUnlocked, setIsUnlocked] = useState(false);`
);

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
