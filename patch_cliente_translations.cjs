const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

const oldRenderPlato = `                                            <h3 className="font-semibold text-lg text-slate-800 leading-tight group-hover:text-amber-600 transition-colors">
                                                {language === 'es' ? plato.ES_Nombre :
                                                 language === 'eu' ? (plato.EU_Nombre || plato.ES_Nombre) :
                                                 language === 'en' ? (plato.EN_Nombre || plato.ES_Nombre) :
                                                 language === 'fr' ? (plato.FR_Nombre || plato.ES_Nombre) :
                                                 language === 'de' ? (plato.DE_Nombre || plato.ES_Nombre) :
                                                 (plato.IT_Nombre || plato.ES_Nombre)}
                                            </h3>
                                            <div className="flex-shrink-0 ml-4 font-bold text-lg text-amber-700">
                                                {plato.Precio.toFixed(2)} €
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex flex-wrap gap-1">`;

const newRenderPlato = `                                            <h3 className="font-semibold text-lg text-slate-800 leading-tight group-hover:text-amber-600 transition-colors">
                                                {language === 'es' ? plato.ES_Nombre :
                                                 language === 'eu' ? (plato.EU_Nombre || plato.ES_Nombre) :
                                                 language === 'en' ? (plato.EN_Nombre || plato.ES_Nombre) :
                                                 language === 'fr' ? (plato.FR_Nombre || plato.ES_Nombre) :
                                                 language === 'de' ? (plato.DE_Nombre || plato.ES_Nombre) :
                                                 (plato.IT_Nombre || plato.ES_Nombre)}
                                            </h3>
                                            <div className="flex-shrink-0 ml-4 font-bold text-lg text-amber-700">
                                                {plato.Precio.toFixed(2)} €
                                            </div>
                                        </div>
                                        
                                        {(plato.Descripcion || plato.EU_Descripcion) && (
                                            <p className="text-slate-500 text-sm mt-1 mb-2 leading-relaxed">
                                                {language === 'es' ? plato.Descripcion :
                                                 language === 'eu' ? (plato.EU_Descripcion || plato.Descripcion) :
                                                 language === 'en' ? (plato.EN_Descripcion || plato.Descripcion) :
                                                 language === 'fr' ? (plato.FR_Descripcion || plato.Descripcion) :
                                                 language === 'de' ? (plato.DE_Descripcion || plato.Descripcion) :
                                                 (plato.IT_Descripcion || plato.Descripcion)}
                                            </p>
                                        )}
                                        
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex flex-wrap gap-1">`;

if (content.includes(oldRenderPlato)) {
    content = content.replace(oldRenderPlato, newRenderPlato);
    fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
    console.log("Patched correctly");
} else {
    console.log("Already patched or pattern not found");
}
