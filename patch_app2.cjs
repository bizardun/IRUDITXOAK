const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
    /const hasAdminAccess = showMasterPanelButton \|\| isAdminMode;/,
    `const hasAdminAccess = showMasterPanelButton || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') === 'true');`
);

fs.writeFileSync('App.tsx', content);
