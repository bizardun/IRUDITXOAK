const fs = require('fs');
let content = fs.readFileSync('components/gestion/GestionApp.tsx', 'utf8');

// Also ensure descriptions are rendered correctly in the management app
const oldRender = `                                            <h3 className="font-semibold text-slate-800">{plato.ES_Nombre}</h3>
                                            <div className="font-bold text-amber-700">{plato.Precio.toFixed(2)} €</div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex flex-wrap gap-1">`;

const newRender = `                                            <h3 className="font-semibold text-slate-800">{plato.ES_Nombre}</h3>
                                            <div className="font-bold text-amber-700">{plato.Precio.toFixed(2)} €</div>
                                        </div>
                                        
                                        {plato.Descripcion && (
                                            <p className="text-slate-500 text-sm mt-1 mb-2 line-clamp-2">{plato.Descripcion}</p>
                                        )}
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex flex-wrap gap-1">`;

content = content.replace(oldRender, newRender);
fs.writeFileSync('components/gestion/GestionApp.tsx', content);
