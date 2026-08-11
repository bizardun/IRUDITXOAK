const fs = require('fs');
let content = fs.readFileSync('context/DataContext.tsx', 'utf8');

content = content.replace(
    /const \[p, price\] = await Promise\.all\(\[api\.getPlatos\(\), api\.getMenuPrice\(\)\]\);/,
    `// Timeout fallback for Firebase hanging on mobile browsers
            const fetchPromise = Promise.all([api.getPlatos(), api.getMenuPrice()]);
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout Firebase")), 8000));
            
            const [p, price] = await Promise.race([fetchPromise, timeoutPromise]) as [any, any];`
);

fs.writeFileSync('context/DataContext.tsx', content);
