const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

const searchString = `                                )}
                            </div>
                        </div>`;

const replacement = `                                )}
                            </div>
                        </div>
                        
                        <div className="flex gap-2.5 sm:gap-4 justify-center items-center opacity-80 print:opacity-100 pt-1 pb-1">
                            <div className="w-8 h-6 sm:w-10 sm:h-7 rounded overflow-hidden shadow-sm"><FlagES /></div>
                            <div className="w-8 h-6 sm:w-10 sm:h-7 rounded overflow-hidden shadow-sm"><FlagEU /></div>
                            <div className="w-8 h-6 sm:w-10 sm:h-7 rounded overflow-hidden shadow-sm"><FlagEN /></div>
                            <div className="w-8 h-6 sm:w-10 sm:h-7 rounded overflow-hidden shadow-sm"><FlagFR /></div>
                            <div className="w-8 h-6 sm:w-10 sm:h-7 rounded overflow-hidden shadow-sm"><FlagDE /></div>
                            <div className="w-8 h-6 sm:w-10 sm:h-7 rounded overflow-hidden shadow-sm"><FlagIT /></div>
                        </div>`;

content = content.replace(searchString, replacement);
fs.writeFileSync('components/gestion/GestionQR.tsx', content);
