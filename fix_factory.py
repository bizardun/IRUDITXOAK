import re

with open('components/factory/FactoryDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace Header Background
c = c.replace(
    'className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50"',
    'className="bg-gradient-to-b from-[#1a1c1e] to-[#0f1214] backdrop-blur-md border-b border-cyan-500/50 shadow-[0_4px_20px_rgba(0,255,255,0.1)] sticky top-0 z-50"'
)

# Replace "Nueva App AI" Button
c = c.replace(
    'className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-900/50 transition-all flex items-center gap-2"',
    'className="bg-[#0b1727] hover:bg-[#152840] border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 px-4 py-2 rounded-lg font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all flex items-center gap-2 uppercase tracking-wider text-xs"'
)

# Replace Delete Toggle Button
c = c.replace(
    "className={`p-2 rounded-lg transition-colors ${isDeleteMode ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}",
    "className={`p-2 rounded-lg transition-all border ${isDeleteMode ? 'bg-cyan-900 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-[#0f172a] border-cyan-800/50 hover:border-cyan-400 text-cyan-500 hover:text-cyan-300'}`}"
)

# Replace Delete Warning Box
c = c.replace(
    'className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-center text-sm font-bold animate-fade-in"',
    'className="bg-[#1a0f0f] border border-red-500 rounded-lg p-3 text-red-400 text-center text-sm font-bold animate-fade-in shadow-[0_0_15px_rgba(239,68,68,0.3)]"'
)

# Replace App Title Text (it seems it was partially replaced already, I should just regex it)
c = re.sub(
    r'className="font-bold text-lg text-white leading-tight truncate pr-4"',
    r'className="font-bold text-lg text-cyan-50 leading-tight truncate pr-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"',
    c
)

with open('components/factory/FactoryDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

