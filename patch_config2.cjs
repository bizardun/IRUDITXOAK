const fs = require('fs');
let content = fs.readFileSync('context/ConfigContext.tsx', 'utf8');

content = content.replace(
    /const isClientUrl = typeof window !== 'undefined' && window\.location\.search\.includes\('client=true'\);\s*const isMasterAdmin = !isClientUrl;/,
    `const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const isClientUrl = searchParams.get('client') === 'true';
    const isOwnerUrl = searchParams.get('admin') === 'true';
    const isMasterAdmin = !isClientUrl && !isOwnerUrl;`
);

content = content.replace(
    /const lastAppId = localStorage\.getItem\(CURRENT_APP_KEY\);/,
    `const appIdParam = searchParams.get('app');\n                    const lastAppId = appIdParam || localStorage.getItem(CURRENT_APP_KEY);`
);

fs.writeFileSync('context/ConfigContext.tsx', content);
