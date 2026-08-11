const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

content = content.replace(
    /\{availableApps\.map\(app => \(/,
    `{availableApps.map((app, index) => (`
);

content = content.replace(
    /<div key=\{app\.id\}/,
    `<div key={\`\${app.id}-\${index}\`}`
);

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
