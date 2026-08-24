const fs = require('fs');
let content = fs.readFileSync('components/cliente/ClienteApp.tsx', 'utf8');

const oldState = `    const [view, setView] = useState<string>('ALL');`;
const newState = `    const [view, setView] = useState<'menu' | 'carta' | 'raciones'>('menu');`;

const oldAllergens = `    const visibleAllergensInView = useMemo(() => {
        if (!showAllergens) return [];
        const activeSet = new Set<string>();
        let contextItems: Plato[] = activePlatos.filter(p => p.Categoria.includes('CARTA'));
        if (view !== 'ALL') {
            contextItems = contextItems.filter(p => p.Tipo === view);
        }
        contextItems.forEach(p => {
            if (Array.isArray(p.Alergenos)) {
                p.Alergenos.forEach(a => activeSet.add(a));
            }
        });
        return Array.from(activeSet).sort();
    }, [activePlatos, view, showAllergens]);`;

const newAllergens = `    const visibleAllergensInView = useMemo(() => {
        if (!showAllergens) return [];
        const activeSet = new Set<string>();
        let contextItems: Plato[] = [];
        const isKanala = config.name.toLowerCase().includes('kanala');
        if (isKanala) {
            contextItems = activePlatos.filter(p => p.Categoria.includes('CARTA'));
            if (view !== 'menu' && view !== 'ALL') {
                contextItems = contextItems.filter(p => p.Tipo === view);
            }
        } else {
            if (view === 'menu') {
                contextItems = activePlatos.filter(p => p.Rol_Menu && p.Rol_Menu !== 'RACION');
            } else {
                const isRaciones = view === 'raciones';
                contextItems = activePlatos.filter(p => {
                    const inCarta = p.Categoria.includes('CARTA');
                    return isRaciones ? (inCarta && p.Es_Racion) : inCarta;
                });
            }
        }
        
        contextItems.forEach(p => {
            if (Array.isArray(p.Alergenos)) {
                p.Alergenos.forEach(a => activeSet.add(a));
            }
        });
        return Array.from(activeSet).sort();
    }, [activePlatos, view, showAllergens, config.name]);`;

const oldRenderCarta = `    const renderCartaOrRaciones = () => {
        const filtered = filteredPlatos.filter(p => p.Categoria.includes('CARTA'));
        const groups: Record<string, any[]> = {};
        filtered.forEach(p => {
            const k = p.Tipo || 'OTROS';
            if (!groups[k]) groups[k] = [];
            groups[k].push(p);
        });
        const order: TipoPlato[] = ['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'];
        let sortedKeys = Object.keys(groups).sort((a, b) => {
            const ia = order.indexOf(a as TipoPlato);
            const ib = order.indexOf(b as TipoPlato);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });

        if (view !== 'ALL') {
            sortedKeys = sortedKeys.filter(k => k === view);
        }

        if (filtered.length === 0 && selectedAllergens.length > 0) return <div className="text-center py-8 text-slate-400 italic font-bold uppercase">Sin resultados</div>;
        if (sortedKeys.length === 0) return null;
        
        return (
            <div className="animate-fade-in max-w-3xl mx-auto space-y-0.5">
                {sortedKeys.map(k => renderGroup(groups[k], (t.tipos as any)[k] || k, k, false))}
            </div>
        );
    };`;

const newRenderCarta = `    const renderCartaOrRaciones = () => {
        const isKanala = config.name.toLowerCase().includes('kanala');
        const isRaciones = view === 'raciones';
        const filtered = filteredPlatos.filter(p => {
            const inCarta = p.Categoria.includes('CARTA');
            if (isKanala) return inCarta;
            if (isRaciones) return inCarta && p.Es_Racion;
            return inCarta;
        });
        
        const groups: Record<string, any[]> = {};
        filtered.forEach(p => {
            const k = p.Tipo || 'OTROS';
            if (!groups[k]) groups[k] = [];
            groups[k].push(p);
        });
        
        const order: TipoPlato[] = ['ENTRANTE', 'ENSALADA', 'ARROZ', 'MARISCO', 'PESCADO', 'CARNE', 'POSTRE'];
        let sortedKeys = Object.keys(groups).sort((a, b) => {
            const ia = order.indexOf(a as TipoPlato);
            const ib = order.indexOf(b as TipoPlato);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });
        
        if (isKanala && view !== 'menu' && view !== 'ALL') {
            sortedKeys = sortedKeys.filter(k => k === view);
        }

        if (filtered.length === 0 && selectedAllergens.length > 0) return <div className="text-center py-8 text-slate-400 italic font-bold uppercase">Sin resultados</div>;
        if (sortedKeys.length === 0) return null;
        
        return (
            <div className="animate-fade-in max-w-3xl mx-auto space-y-0.5">
                {sortedKeys.map(k => renderGroup(groups[k], (t.tipos as any)[k] || k, k, false))}
            </div>
        );
    };`;

const oldTabs = `                <div className="flex overflow-x-auto no-scrollbar gap-2 mb-4 sm:mb-8 px-1 pb-2 snap-x max-w-3xl mx-auto">
                    {[
                        { id: 'ALL', label: t.carta || 'Carta' },
                        { id: 'ENTRANTE', label: t.tipos?.ENTRANTE || 'Entrantes' },
                        { id: 'ENSALADA', label: t.tipos?.ENSALADA || 'Ensaladas' },
                        { id: 'ARROZ', label: t.tipos?.ARROZ || 'Arroces' },
                        { id: 'MARISCO', label: t.tipos?.MARISCO || 'Mariscos' },
                        { id: 'PESCADO', label: t.tipos?.PESCADO || 'Pescados' },
                        { id: 'CARNE', label: t.tipos?.CARNE || 'Carnes' },
                        { id: 'POSTRE', label: t.tipos?.POSTRE || 'Postres' }
                    ].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setView(tab.id)} 
                            className={\`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all border snap-center \${view === tab.id ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}\`}
                        >
                            <span className="whitespace-nowrap uppercase tracking-wide">{tab.label}</span>
                        </button>
                    ))}
                </div>`;

const newTabs = `                {config.name.toLowerCase().includes('kanala') ? (
                    <div className="flex overflow-x-auto no-scrollbar gap-2 mb-4 sm:mb-8 px-1 pb-2 snap-x max-w-3xl mx-auto">
                        {[
                            { id: 'menu', label: t.carta || 'Carta' },
                            { id: 'ENTRANTE', label: t.tipos?.ENTRANTE || 'Entrantes' },
                            { id: 'ENSALADA', label: t.tipos?.ENSALADA || 'Ensaladas' },
                            { id: 'ARROZ', label: t.tipos?.ARROZ || 'Arroces' },
                            { id: 'MARISCO', label: t.tipos?.MARISCO || 'Mariscos' },
                            { id: 'PESCADO', label: t.tipos?.PESCADO || 'Pescados' },
                            { id: 'CARNE', label: t.tipos?.CARNE || 'Carnes' },
                            { id: 'POSTRE', label: t.tipos?.POSTRE || 'Postres' }
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setView(tab.id as any)} 
                                className={\`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all border snap-center \${view === tab.id ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}\`}
                            >
                                <span className="whitespace-nowrap uppercase tracking-wide">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-100/80 p-1 rounded-2xl flex gap-1 mb-4 sm:mb-10 shadow-inner max-w-lg mx-auto">
                        {[{ id: 'menu', label: t.menuDelDia, icon: IconMenu }, { id: 'carta', label: t.carta, icon: IconBook }, { id: 'raciones', label: t.raciones, icon: IconFood }].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setView(tab.id as any)} 
                                className={\`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] sm:text-sm font-bold transition-all \${view === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                            >
                                <tab.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                )}`;

const oldMainRender = `                {renderCartaOrRaciones()}`;
const newMainRender = `                {(!config.name.toLowerCase().includes('kanala') && view === 'menu') ? renderMenu() : renderCartaOrRaciones()}`;

if (content.includes(oldState)) {
    content = content.replace(oldState, newState);
    content = content.replace(oldAllergens, newAllergens);
    content = content.replace(oldRenderCarta, newRenderCarta);
    content = content.replace(oldTabs, newTabs);
    content = content.replace(oldMainRender, newMainRender);
    fs.writeFileSync('components/cliente/ClienteApp.tsx', content);
    console.log("Reverted & Conditional Logic Applied");
} else {
    console.log("Not found");
}
