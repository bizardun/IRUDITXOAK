const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

content = content.replace("import DevicePreview from './DevicePreview';", "");

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
