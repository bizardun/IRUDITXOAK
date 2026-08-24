const fs = require('fs');
let content = fs.readFileSync('components/factory/FactoryDashboard.tsx', 'utf8');

// replace require with proper import usage if not imported
if (!content.includes("import api from '../../services/api';")) {
    content = content.replace(
        "import { generateRestaurantZip } from '../../services/zipService';",
        "import { generateRestaurantZip } from '../../services/zipService';\nimport api from '../../services/api';"
    );
}

content = content.replace(
    "const api = require('../../services/api').default;",
    ""
);

fs.writeFileSync('components/factory/FactoryDashboard.tsx', content);
