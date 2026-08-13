const fs = require('fs');

let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

content = content.replace(
    /const \[isUnlocked, setIsUnlocked\] = useState\(isAiStudio\);/,
    `const [isUnlocked, setIsUnlocked] = useState(false);`
);

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
