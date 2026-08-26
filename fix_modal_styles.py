import re

with open('components/gestion/AddPlatoModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''<div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">''',
    '''<div className={`px-6 py-4 border-b flex justify-between items-center ${isKanala ? 'bg-neutral-900 border-white/10' : 'bg-slate-50 border-slate-100'}`}>'''
)

content = content.replace(
    '''<h3 className="text-xl font-bold font-lora text-slate-800">{isEditing ? 'Editar Plato' : 'Añadir Plato'}</h3>''',
    '''<h3 className={`text-xl font-bold font-lora ${isKanala ? 'text-white' : 'text-slate-800'}`}>{isEditing ? 'Editar Plato' : 'Añadir Plato'}</h3>'''
)

content = content.replace(
    '''<button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><IconX/></button>''',
    '''<button type="button" onClick={onClose} className={`transition-colors ${isKanala ? 'text-neutral-500 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}><IconX/></button>'''
)

content = content.replace(
    '''<label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">''',
    '''<label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${isKanala ? 'text-neutral-400' : 'text-slate-700'}`}>'''
)

content = content.replace(
    '''<input required className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500" value={data.ES_Nombre} onChange={e => setData({...data, ES_Nombre: e.target.value})} />''',
    '''<input required className={`w-full border rounded-lg p-3 font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 ${isKanala ? 'bg-neutral-800 border-white/20 text-white' : 'bg-slate-50 border-slate-300'}`} value={data.ES_Nombre} onChange={e => setData({...data, ES_Nombre: e.target.value})} />'''
)

content = content.replace(
    '''<textarea className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acompañado de patatas y salsa..." rows={2} value={data.Descripcion || ''} onChange={e => setData({...data, Descripcion: e.target.value})} />''',
    '''<textarea className={`w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${isKanala ? 'bg-neutral-800 border-white/20 text-white' : 'bg-slate-50 border-slate-300'}`} placeholder="Acompañado de patatas y salsa..." rows={2} value={data.Descripcion || ''} onChange={e => setData({...data, Descripcion: e.target.value})} />'''
)

content = content.replace(
    '''<select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm font-semibold outline-none" value={data.Tipo} onChange={e => setData({...data, Tipo: e.target.value as any})}>''',
    '''<select className={`w-full border rounded-lg p-3 text-sm font-semibold outline-none ${isKanala ? 'bg-neutral-800 border-white/20 text-white' : 'bg-slate-50 border-slate-300'}`} value={data.Tipo} onChange={e => setData({...data, Tipo: e.target.value as any})}>'''
)

content = content.replace(
    '''<input required type="number" step="0.1" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 font-bold outline-none text-right" value={data.Precio} onChange={e => setData({...data, Precio: e.target.value})} />''',
    '''<input required type="number" step="0.1" className={`w-full border rounded-lg p-3 font-bold outline-none text-right ${isKanala ? 'bg-neutral-800 border-white/20 text-white' : 'bg-slate-50 border-slate-300'}`} value={data.Precio} onChange={e => setData({...data, Precio: e.target.value})} />'''
)

content = content.replace(
    '''<div className="space-y-4 pt-4 border-t border-slate-100">''',
    '''<div className={`space-y-4 pt-4 border-t ${isKanala ? 'border-white/10' : 'border-slate-100'}`}>'''
)

content = content.replace(
    '''<h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Traducciones e IA</h4>''',
    '''<h4 className={`text-sm font-bold uppercase tracking-wide ${isKanala ? 'text-neutral-500' : 'text-slate-400'}`}>Traducciones e IA</h4>'''
)

content = content.replace(
    '''<div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center">''',
    '''<div className={`border-t px-6 py-4 flex justify-between items-center ${isKanala ? 'bg-neutral-900 border-white/10' : 'bg-slate-50 border-slate-200'}`}>'''
)

content = content.replace(
    '''<button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancelar</button>''',
    '''<button type="button" onClick={onClose} className={`px-4 py-2 font-bold transition-colors ${isKanala ? 'text-neutral-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>Cancelar</button>'''
)

with open('components/gestion/AddPlatoModal.tsx', 'w') as f:
    f.write(content)
print("modal styles fixed")
