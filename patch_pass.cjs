const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

// Replace all instances of 'admin123' with '8517'
content = content.replace(/'admin123'/g, "'8517'");

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
