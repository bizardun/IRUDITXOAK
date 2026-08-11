const fs = require('fs');
let content = fs.readFileSync('context/DataContext.tsx', 'utf8');

// We need to add catch block to refreshData
content = content.replace(
    /const \[p, price\] = await Promise\.race\(\[fetchPromise, timeoutPromise\]\) as \[any, any\];\n\s*setPlatos\(p\);\n\s*setMenuPrice\(price\);\n\s*\} finally \{/,
    `const [p, price] = await Promise.race([fetchPromise, timeoutPromise]) as [any, any];
            setPlatos(p || []);
            setMenuPrice(price || 0);
        } catch (error) {
            console.error("Error in refreshData:", error);
        } finally {`
);

fs.writeFileSync('context/DataContext.tsx', content);
