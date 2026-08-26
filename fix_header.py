import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

# Add IconQR to the import if not there
if "IconQR" not in content:
    content = content.replace(
        "import { IconChevronLeft, IconPlus, IconEdit, IconSort, IconArrowDown, IconAllergy, IconX } from '../icons';",
        "import { IconChevronLeft, IconPlus, IconEdit, IconSort, IconArrowDown, IconAllergy, IconX } from '../icons';\nconst IconQR = () => (\n  <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\">\n    <rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect>\n    <rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect>\n    <rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect>\n    <path d=\"M3 14h7v7H3z\"></path>\n  </svg>\n);"
    )

# Fix the missed toggleAll button
content = content.replace(
    '''className="text-[10px] font-black uppercase text-slate-400 border border-slate-200 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"''',
    '''className={`text-[10px] font-black uppercase border px-2 py-1.5 rounded-lg transition-colors ${isKanala ? 'text-neutral-400 border-white/20 hover:bg-white/5' : 'text-slate-400 border-slate-200 hover:bg-slate-50'}`}'''
)

# Add the QR button
qr_btn = '''
                    {isKanala && mode === 'ALL' && (
                        <button onClick={() => setView('qr')} className="flex items-center gap-1 bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow hover:bg-neutral-700 transition-colors border border-white/20">
                            <IconQR /> QR
                        </button>
                    )}'''

content = content.replace(
    '''<button onClick={openAddModal} className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow hover:bg-emerald-700 transition-colors">''',
    qr_btn + '''\n                    <button onClick={openAddModal} className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow hover:bg-emerald-700 transition-colors">'''
)

with open('components/gestion/GestionCategoria.tsx', 'w') as f:
    f.write(content)
print("Header fixed")
