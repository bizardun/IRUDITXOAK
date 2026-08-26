const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

content = content.replace(
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ENTRANTE' : 'menu');",
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ALL' : 'menu');"
);

// We want to replace the Kanala ternary block. Let's just find the start and the ") : (" 
const parts = content.split("{config.name.toLowerCase().includes('kanala') ? (");
if (parts.length > 1) {
    const afterStart = parts[1];
    // Find the end of the first branch of the ternary
    const split2 = afterStart.split(") : (\\n                    <div className=\\"bg-slate-100/80 p-1 rounded-2xl");
    if (split2.length > 1) {
        content = parts[0] + "{config.name.toLowerCase().includes('kanala') ? null : (\\n                    <div className=\\"bg-slate-100/80 p-1 rounded-2xl" + split2.slice(1).join(") : (\\n                    <div className=\\"bg-slate-100/80 p-1 rounded-2xl");
        fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
        console.log('Patched with split!');
    } else {
        // Try another way to match
        console.log("Could not find the else branch start");
    }
}
