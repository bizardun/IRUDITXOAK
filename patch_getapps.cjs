const fs = require('fs');
let content = fs.readFileSync('services/api.ts', 'utf8');

content = content.replace(
    /const apps = querySnapshot\.docs\.map\(doc => doc\.data\(\) as RestaurantConfig\);/,
    `const apps = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data } as RestaurantConfig;
        }).filter(app => app.name); // Only return apps that have a name (not just menuPrice stubs)`
);

fs.writeFileSync('services/api.ts', content);
