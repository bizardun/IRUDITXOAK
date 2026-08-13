const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

content = content.replace(
    /const \[isUnlocked, setIsUnlocked\] = useState\(false\);/,
    `const [isUnlocked, setIsUnlocked] = useState(isAiStudio);`
);

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
