import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

# Hide back button if isKanala and mode is ALL
content = content.replace(
    '''<button onClick={() => setView('home')} className="flex items-center gap-2 group text-left transition-colors">''',
    '''{!(isKanala && mode === 'ALL') && (
                        <button onClick={() => setView('home')} className="flex items-center gap-2 group text-left transition-colors">
                            <div className={`p-2 rounded-full transition-colors ${isKanala ? 'bg-neutral-800 group-hover:bg-neutral-700 text-neutral-300' : 'bg-slate-100 group-hover:bg-slate-200 text-slate-600'}`}>
                                <IconChevronLeft className="w-6 h-6" />
                            </div>
                        </button>
                    )}'''
)

# the original code had:
# <button onClick={() => setView('home')} className="flex items-center gap-2 group text-left transition-colors">
#    <div className="...">
#        <IconChevronLeft className="w-6 h-6" />
#    </div>
#    <h2 className="...">

# Wait! The title is also inside the button!
