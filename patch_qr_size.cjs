const fs = require('fs');

// Patch GestionQR.tsx
let qrContent = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');
const searchQr = `                        <div className="flex gap-3 sm:gap-5 justify-center items-center opacity-80 print:opacity-100 pt-2 pb-2">
                            <div className="w-10 h-7 sm:w-14 sm:h-10 rounded overflow-hidden shadow-sm"><FlagEU /></div>
                            <div className="w-10 h-7 sm:w-14 sm:h-10 rounded overflow-hidden shadow-sm"><FlagEN /></div>
                            <div className="w-10 h-7 sm:w-14 sm:h-10 rounded overflow-hidden shadow-sm"><FlagFR /></div>
                            <div className="w-10 h-7 sm:w-14 sm:h-10 rounded overflow-hidden shadow-sm"><FlagDE /></div>
                            <div className="w-10 h-7 sm:w-14 sm:h-10 rounded overflow-hidden shadow-sm"><FlagIT /></div>
                            <div className="w-10 h-7 sm:w-14 sm:h-10 rounded overflow-hidden shadow-sm"><FlagES /></div>
                        </div>`;

const replaceQr = `                        <div className="flex gap-2.5 sm:gap-4 justify-center items-center opacity-80 print:opacity-100 pt-1.5 pb-1.5">
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagEU /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagEN /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagFR /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagDE /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagIT /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagES /></div>
                        </div>`;

qrContent = qrContent.replace(searchQr, replaceQr);
fs.writeFileSync('components/gestion/GestionQR.tsx', qrContent);

// Patch icons.tsx for FlagEN
let iconsContent = fs.readFileSync('components/icons.tsx', 'utf8');
iconsContent = iconsContent.replace(/export const FlagEN = \(\) => <svg viewBox="0 0 60 30" className="w-full h-full shadow-sm rounded object-cover">/g, 'export const FlagEN = () => <svg viewBox="0 0 60 30" preserveAspectRatio="none" className="w-full h-full shadow-sm rounded object-cover">');
fs.writeFileSync('components/icons.tsx', iconsContent);

