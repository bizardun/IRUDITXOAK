const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
    /const \[hasAdminAccess, setHasAdminAccess\] = useState\(isAdminMode\);/,
    `const hasAdminAccess = showMasterPanelButton || isAdminMode;`
);

fs.writeFileSync('App.tsx', content);
