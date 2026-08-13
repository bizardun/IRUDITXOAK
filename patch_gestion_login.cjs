const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionApp.tsx', 'utf8');

// Add import
content = content.replace(
    /import \{ useConfig \} from '\.\.\/\.\.\/context\/ConfigContext';/,
    `import { useConfig } from '../../context/ConfigContext';\nimport GestionLogin from './GestionLogin';`
);

// Add state and rendering logic
content = content.replace(
    /const GestionApp: React\.FC = \(\) => \{/,
    `const GestionApp: React.FC = () => {\n    const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true');`
);

// We need to inject the early return for login
content = content.replace(
    /if \(view === 'home'\)/,
    `    const handleLogin = () => {\n        sessionStorage.setItem('admin_auth', 'true');\n        setIsAuthenticated(true);\n    };\n\n    if (!isAuthenticated) return <GestionLogin onLogin={handleLogin} />;\n\n    if (view === 'home')`
);

fs.writeFileSync('components/gestion/GestionApp.tsx', content);
