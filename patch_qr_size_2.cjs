const fs = require('fs');

let qrContent = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');
const replaceQr = `                        <div className="flex gap-2.5 sm:gap-4 justify-center items-center opacity-80 print:opacity-100 pt-1.5 pb-1.5">
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagEU /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagEN /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagFR /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagDE /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagIT /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagES /></div>
                        </div>`;

qrContent = qrContent.replace(/                        <div className="flex gap-3 sm:gap-5 justify-center items-center opacity-80 print:opacity-100 pt-2 pb-2">[\s\S]*?<\/div>\r?\n                        <\/div>/m, replaceQr);
fs.writeFileSync('components/gestion/GestionQR.tsx', qrContent);

