const fs = require('fs');
let content = fs.readFileSync('context/ConfigContext.tsx', 'utf8');

// Update setConfigState calls
content = content.replace(
    /setConfigState\(app\);/g,
    `api.setApiAppId(app.id); setConfigState(app);`
);

content = content.replace(
    /setConfigState\(selectedApp\);/g,
    `api.setApiAppId(selectedApp.id); setConfigState(selectedApp);`
);

// Initial state and effect
content = content.replace(
    /const \[config, setConfigState\] = useState<RestaurantConfig>\(getActiveConfig\(\)\);/,
    `const [config, setConfigState] = useState<RestaurantConfig>(() => {
        const init = getActiveConfig();
        api.setApiAppId(init.id);
        return init;
    });`
);

fs.writeFileSync('context/ConfigContext.tsx', content);
