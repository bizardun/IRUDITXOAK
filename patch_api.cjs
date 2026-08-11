const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

// Add setApiAppId and currentAppId
content = content.replace(
    /const getPlatosPath = \(\) => `restaurants\/\$\{getActiveConfig\(\)\.id\}\/platos`;/,
    `let _apiAppId = "";
export const setApiAppId = (id: string) => { _apiAppId = id; };
const getPlatosPath = () => \`restaurants/\${_apiAppId || getActiveConfig().id}/platos\`;`
);

content = content.replace(
    /const getConfigPath = \(\) => `restaurants\/\$\{getActiveConfig\(\)\.id\}`;/,
    `const getConfigPath = () => \`restaurants/\${_apiAppId || getActiveConfig().id}\`;`
);

// Add setApiAppId to default export
content = content.replace(
    /export default \{/,
    `export default {
    setApiAppId,`
);

fs.writeFileSync('services/api.ts', content);
