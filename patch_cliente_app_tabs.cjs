const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

// 1. Set initial view for Kanala to 'ALL'
content = content.replace(
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ENTRANTE' : 'menu');",
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ALL' : 'menu');"
);

// 2. Remove Kanala tabs logic from render
const kanalaTabsStart = "{config.name.toLowerCase().includes('kanala') ? (";
const kanalaTabsRegex = /\{config\.name\.toLowerCase\(\)\.includes\('kanala'\) \? \([\s\S]*?\) : \(/g;

// Before changing, let's just make sure we capture it right.
// We can just replace the whole ternary block.
