const fs = require('fs');

// Revert GestionApp.tsx
let content = fs.readFileSync('components/gestion/GestionApp.tsx', 'utf8');

content = content.replace(
    /const \[isAuthenticated, setIsAuthenticated\] = useState\(\(\) => sessionStorage\.getItem\('admin_auth'\) === 'true'\);/,
    ''
);

content = content.replace(
    /const handleLogin = \(\) => \{[\s\S]*?setIsAuthenticated\(true\);\n    \};/,
    ''
);

content = content.replace(
    /if \(!isAuthenticated\) return <GestionLogin onLogin=\{handleLogin\} \/>;/,
    ''
);

fs.writeFileSync('components/gestion/GestionApp.tsx', content);
