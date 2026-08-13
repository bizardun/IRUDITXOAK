const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

content = content.replace(
    /className=\{\`text-\[13px\] sm:text-base font-medium truncate block leading-tight \\\$\{\isRestricted \? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'\}\`\}/g,
    "className={`font-sans text-[13px] sm:text-base font-medium truncate block leading-tight \\${isRestricted ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'}`}"
);

fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
