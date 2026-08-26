import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

# Fix header group texts
content = content.replace(
    '''<span className={`w-2 h-2 rounded-full transition-colors ${isExpanded ? 'bg-amber-400 shadow-sm' : 'bg-slate-300'}`}></span>''',
    '''<span className={`w-2 h-2 rounded-full transition-colors ${isExpanded ? 'bg-amber-400 shadow-sm' : (isKanala ? 'bg-neutral-600' : 'bg-slate-300')}`}></span>'''
)

content = content.replace(
    '''<h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">''',
    '''<h3 className={`text-xs font-bold uppercase tracking-wider truncate ${tc.text}`}>'''
)

content = content.replace(
    '''<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Menú día</span>''',
    '''<span className={`text-[11px] font-semibold uppercase tracking-wider ${tc.textMuted}`}>Menú día</span>'''
)

content = content.replace(
    '''<IconArrowDown className={`w-4 h-4 text-slate-700 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />''',
    '''<IconArrowDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${tc.text}`} />'''
)

content = content.replace(
    '''<div className="divide-y divide-slate-50">''',
    '''<div className={`divide-y ${isKanala ? 'divide-white/5' : 'divide-slate-50'}`}>'''
)

content = content.replace(
    '''<div className="cursor-grab active:cursor-grabbing p-1.5 text-slate-700 hover:text-blue-600 rounded transition-colors">''',
    '''<div className={`cursor-grab active:cursor-grabbing p-1.5 rounded transition-colors ${isKanala ? 'text-neutral-400 hover:text-white' : 'text-slate-700 hover:text-blue-600'}`}>'''
)

content = content.replace(
    '''<p className={`text-sm font-medium leading-snug truncate ${isRestricted ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-800'}`}>{p.ES_Nombre}</p>''',
    '''<p className={`text-sm font-medium leading-snug truncate ${isRestricted ? (isKanala ? 'text-neutral-500 line-through decoration-neutral-600' : 'text-slate-500 line-through decoration-slate-400') : tc.text}`}>{p.ES_Nombre}</p>'''
)

content = content.replace(
    '''<div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 text-slate-600 transition-colors">''',
    '''<div className={`p-2 rounded-full transition-colors ${isKanala ? 'bg-neutral-800 group-hover:bg-neutral-700 text-neutral-300' : 'bg-slate-100 group-hover:bg-slate-200 text-slate-600'}`}>'''
)

content = content.replace(
    '''<button    
                        onClick={() => toggleAll(allCollapsed)}   
                        className="text-[10px] font-black uppercase text-slate-400 border border-slate-200 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"   
                    >''',
    '''<button    
                        onClick={() => toggleAll(allCollapsed)}   
                        className={`text-[10px] font-black uppercase border px-2 py-1.5 rounded-lg transition-colors ${isKanala ? 'text-neutral-400 border-white/20 hover:bg-white/5' : 'text-slate-400 border-slate-200 hover:bg-slate-50'}`}   
                    >'''
)

content = content.replace(
    '''<button onClick={() => setShowAllergens(!showAllergens)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-sm ${showAllergens ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>''',
    '''<button onClick={() => setShowAllergens(!showAllergens)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-sm ${showAllergens ? (isKanala ? 'bg-white text-black border-white' : 'bg-slate-800 text-white border-slate-800') : (isKanala ? 'bg-transparent text-white border-white/20 hover:bg-white/5' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}`}>'''
)

content = content.replace(
    '''<div className="bg-white/95 backdrop-blur-md border-t border-slate-200 border-b-4 border-b-slate-300 shadow-md py-2 px-4 sm:px-6">''',
    '''<div className={`backdrop-blur-md border-t border-b-4 shadow-md py-2 px-4 sm:px-6 ${isKanala ? 'bg-neutral-900/95 border-white/10 border-b-neutral-800' : 'bg-white/95 border-slate-200 border-b-slate-300'}`}>'''
)

content = content.replace(
    '''<p className="text-[9px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t.infoAlergenos}</p>''',
    '''<p className={`text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] ${isKanala ? 'text-neutral-400' : 'text-slate-400'}`}>{t.infoAlergenos}</p>'''
)

content = content.replace(
    '''<button onClick={() => setSelectedAllergens([])} className="text-[9px] bg-slate-800 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm hover:bg-slate-700 transition-colors">''',
    '''<button onClick={() => setSelectedAllergens([])} className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm transition-colors ${isKanala ? 'bg-white text-black hover:bg-neutral-200' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>'''
)

content = content.replace(
    '''className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"''',
    '''className={`transition-colors p-1 rounded-full ${isKanala ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}'''
)

content = content.replace(
    '''className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${isSelected ? 'bg-white border-slate-800 shadow-sm ring-1 ring-slate-200 z-10' : 'bg-white/40 border-slate-100 hover:border-slate-300'}`}''',
    '''className={`flex items-center gap-1 transition-all duration-200 rounded-md px-1.5 py-0.5 border ${isKanala ? (isSelected ? 'bg-neutral-700 border-white shadow-sm ring-1 ring-neutral-600 z-10' : 'bg-transparent border-white/20 hover:border-white/40') : (isSelected ? 'bg-white border-slate-800 shadow-sm ring-1 ring-slate-200 z-10' : 'bg-white/40 border-slate-100 hover:border-slate-300')}`}'''
)

content = content.replace(
    '''<span className={`text-[9px] font-bold uppercase whitespace-nowrap tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{t.alergenos?.[key] || key}</span>''',
    '''<span className={`text-[9px] font-bold uppercase whitespace-nowrap tracking-tight ${isSelected ? (isKanala ? 'text-white' : 'text-slate-900') : (isKanala ? 'text-neutral-400' : 'text-slate-500')}`}>{t.alergenos?.[key] || key}</span>'''
)

with open('components/gestion/GestionCategoria.tsx', 'w') as f:
    f.write(content)

print("done kanala gestion styles")
