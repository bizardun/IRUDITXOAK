const fs = require('fs');

// Revert GestionApp.tsx
let content = fs.readFileSync('components/gestion/GestionApp.tsx', 'utf8');

content = content.replace(
    /import GestionLogin from '\.\/GestionLogin';/,
    ''
);

content = content.replace(
    /const \[isAuthenticated, setIsAuthenticated\] = useState\(\(\) => sessionStorage\.getItem\('admin_auth'\) === 'true'\);\n    const handleLogin = \(\) => \{\n        sessionStorage\.setItem\('admin_auth', 'true'\);\n        setIsAuthenticated\(true\);\n    \};\n\n    if \(!isAuthenticated\) return <GestionLogin onLogin=\{handleLogin\} \/>;\n\n    if \(view === 'home'\)/,
    `    if (view === 'home')`
);

fs.writeFileSync('components/gestion/GestionApp.tsx', content);
