const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

content = content.replace(
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ENTRANTE' : 'menu');",
    "const [view, setView] = useState<string>(config?.name?.toLowerCase().includes('kanala') ? 'ALL' : 'menu');"
);

const startIndex = content.indexOf("{config.name.toLowerCase().includes('kanala') ? (");
if (startIndex !== -1) {
    const searchString = `) : (
                    <div className="bg-slate-100/80 p-1 rounded-2xl`;
    const endIndex = content.indexOf(searchString, startIndex);
    
    if (endIndex !== -1) {
        content = content.substring(0, startIndex) + "{config.name.toLowerCase().includes('kanala') ? null : (\n                    <div className=\"bg-slate-100/80 p-1 rounded-2xl" + content.substring(endIndex + searchString.length);
        fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
        console.log("Patched successfully!");
    } else {
        console.log("Could not find end index");
    }
} else {
    console.log("Could not find start index");
}
