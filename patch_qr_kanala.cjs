const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

const oldHeader = `                            {config.name.toLowerCase().includes('boliña') ? (
                                <img src="/logo boliña sin fondo.jfif" alt={config.name} className="h-32 sm:h-48 mx-auto object-contain drop-shadow-md" />
                            ) : (
                                <h1 className="text-4xl sm:text-6xl font-bold font-lora text-slate-900 tracking-tight leading-tight">
                                    {config.name}
                                </h1>
                            )}`;

const newHeader = `                            {config.name.toLowerCase().includes('kanala') ? (
                                <img src="https://www.kanalabeach.eus/wp-content/uploads/2024/06/kanala-logos_LOGO-HORIZONTAL-zuria.png" alt={config.name} style={{filter: 'invert(1)'}} className="h-24 sm:h-32 mx-auto object-contain mb-4 sm:mb-6" />
                            ) : config.name.toLowerCase().includes('boliña') ? (
                                <img src="/logo boliña sin fondo.jfif" alt={config.name} className="h-32 sm:h-48 mx-auto object-contain drop-shadow-md" />
                            ) : (
                                <h1 className="text-4xl sm:text-6xl font-bold font-lora text-slate-900 tracking-tight leading-tight">
                                    {config.name}
                                </h1>
                            )}`;

content = content.replace(oldHeader, newHeader);
fs.writeFileSync('components/gestion/GestionQR.tsx', content);
