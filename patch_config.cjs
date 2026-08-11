const fs = require('fs');
let content = fs.readFileSync('context/ConfigContext.tsx', 'utf8');

content = content.replace(
    /const isMasterAdmin = typeof window !== 'undefined' && window\.location\.search\.includes\('admin=master'\);/,
    `const isClientUrl = typeof window !== 'undefined' && window.location.search.includes('client=true');\n    const isMasterAdmin = !isClientUrl;`
);

fs.writeFileSync('context/ConfigContext.tsx', content);
