const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

content = content.replace(
    /useEffect\(\(\) => \{\n        let baseUrl = window\.location\.origin \+ window\.location\.pathname \+ "\?app=" \+ config\.id \+ "&client=true";\n        setCleanUrl\(baseUrl\);\n[\s\S]*?\}, \[\]\);/,
    `useEffect(() => {
        const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        const baseUrl = originUrl + path + "?app=" + config.id + "&client=true";
        setCleanUrl(baseUrl);
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear().toString();
        setDateStr(\`\${day}/\${month}/\${year}\`);
    }, [config.id]);`
);

fs.writeFileSync('components/gestion/GestionQR.tsx', content);
