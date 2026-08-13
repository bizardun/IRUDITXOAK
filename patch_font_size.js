const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

// Replace specific mobile text classes
content = content.replace(/text-\[13px\]/g, 'text-[15px]');
content = content.replace(/text-\[11px\]/g, 'text-[13px]');
content = content.replace(/text-\[10px\]/g, 'text-[12px]');
content = content.replace(/text-\[9px\]/g, 'text-[11px]');
content = content.replace(/text-sm sm:text-lg/g, 'text-base sm:text-lg');
content = content.replace(/text-xl sm:text-2xl/g, 'text-2xl sm:text-[28px]');
content = content.replace(/text-2xl sm:text-4xl/g, 'text-3xl sm:text-5xl');
content = content.replace(/text-3xl sm:text-6xl/g, 'text-4xl sm:text-6xl');
content = content.replace(/w-3\.5 h-3\.5/g, 'w-4 h-4');
content = content.replace(/text-xs/g, 'text-sm');

fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
