const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const targetStr = `    return (
        <DataProvider key={config.id}>
            <div className={\`min-h-screen leading-tight \${fontClass} \${themeColors[themeStyle]}\`}>`;

const replaceStr = `    const isKanala = config.name.toLowerCase().includes('kanala');
    
    return (
        <DataProvider key={config.id}>
            <div className={\`min-h-screen leading-tight \${fontClass} \${isKanala ? 'bg-black text-white' : themeColors[themeStyle]}\`}>
            {isKanala && <style>{\`body { background-color: black; }\`}</style>}`;

if(content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync('App.tsx', content);
    console.log("App.tsx Patched!");
} else {
    console.log("Not found in App.tsx");
}
