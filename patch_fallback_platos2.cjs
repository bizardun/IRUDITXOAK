const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

content = content.replace(
    /import \{ getActiveConfig \} from '\.\.\/config\/restaurant';/,
    `import { getActiveConfig, bolinaConfig } from '../config/restaurant';`
);

content = content.replace(
    /let initialData = config\.initialPlatos && config\.initialPlatos\.length > 0 \? config\.initialPlatos : getActiveConfig\(\)\.initialPlatos; \/\/ Fallback so it's never empty/,
    `let initialData = config.initialPlatos && config.initialPlatos.length > 0 ? config.initialPlatos : bolinaConfig.initialPlatos;`
);

fs.writeFileSync('services/api.ts', content);
