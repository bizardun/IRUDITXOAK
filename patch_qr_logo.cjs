const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

content = content.replace(
    /<h1 className="text-4xl sm:text-6xl font-bold font-lora text-slate-900 tracking-tight leading-tight">\s*\{config\.name\}\s*<\/h1>/,
    `{config.name.toLowerCase().includes('boliña') ? (
                                <img src="/logo boliña sin fondo.jfif" alt={config.name} className="h-32 sm:h-48 mx-auto object-contain drop-shadow-md" />
                            ) : (
                                <h1 className="text-4xl sm:text-6xl font-bold font-lora text-slate-900 tracking-tight leading-tight">
                                    {config.name}
                                </h1>
                            )}`
);

fs.writeFileSync('components/gestion/GestionQR.tsx', content);
