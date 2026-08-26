const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

// 1. In DishItem, add useConfig hook
content = content.replace(
    'const DishItem: React.FC<DishItemProps> = ({',
    `const DishItem: React.FC<DishItemProps> = ({\n    const { config } = useConfig();\n    const isKanala = config.name.toLowerCase().includes('kanala');\n`
);

// Wait, the destructuring is inside the parameter list.
// Let's do it after the parameters.
