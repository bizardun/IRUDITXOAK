const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

// The password check logic
const expectedPass = "import.meta.env.VITE_MASTER_PASSWORD || '8517'";

content = content.replace(
    /if \(password === '8517'\)/,
    `if (password === (${expectedPass}))`
);

content = content.replace(
    /onClick=\{\(\) => password === '8517' \?/,
    `onClick={() => password === (${expectedPass}) ?`
);

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
