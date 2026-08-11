const fs = require('fs');
let content = fs.readFileSync('context/ConfigContext.tsx', 'utf8');

content = content.replace(
    /const isMasterAdmin = searchParams\.get\('factory'\) === 'master';/,
    `const isMasterAdmin = !isClientUrl && !isOwnerUrl;`
);

fs.writeFileSync('context/ConfigContext.tsx', content);
