with open('components/factory/FactoryDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

replacements = {
    'className="min-h-screen bg-slate-900 font-sans selection:bg-blue-500/30"': 'className="min-h-screen bg-[#0b0f12] font-sans selection:bg-cyan-500/30"',
    
    'className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50"': 'className="bg-gradient-to-b from-[#1a1c1e] to-[#0f1214] backdrop-blur-md border-b border-cyan-500/50 shadow-[0_4px_20px_rgba(0,255,255,0.1)] sticky top-0 z-50"',
    
    'className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight"': 'className="text-xl sm:text-2xl font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"',
    
    'className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-900/50 transition-all flex items-center gap-2"': 'className="bg-[#0b1727] hover:bg-[#152840] border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 px-4 py-2 rounded-lg font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all flex items-center gap-2 uppercase tracking-wider text-xs"',
    
    "className={`p-2 rounded-lg transition-colors ${isDeleteMode ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}": "className={`p-2 rounded-lg transition-all border ${isDeleteMode ? 'bg-cyan-900 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-[#0f172a] border-cyan-800/50 hover:border-cyan-400 text-cyan-500 hover:text-cyan-300'}`}",
    
    'className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-center text-sm font-bold animate-fade-in"': 'className="bg-[#1a0f0f] border border-red-500 rounded-lg p-3 text-red-400 text-center text-sm font-bold animate-fade-in shadow-[0_0_15px_rgba(239,68,68,0.3)]"',
    
    "className={`group relative rounded-xl p-6 border transition-all cursor-pointer shadow-lg flex flex-col justify-between ${isDeleteMode ? 'bg-slate-800 border-red-500/50 ring-2 ring-red-500/20' : 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-blue-900/20 hover:-translate-y-1'}`": "className={`group relative rounded-xl p-6 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1a1c1e] to-[#121415] ${isDeleteMode ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:-translate-y-1'}`",
    
    'className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-inner border border-slate-600/50 overflow-hidden"': 'className="w-14 h-14 bg-gradient-to-br from-[#0f172a] to-[#020617] rounded-xl flex items-center justify-center shadow-inner border border-cyan-900/50 overflow-hidden"',
    
    'className="font-bold text-lg text-white leading-tight truncate pr-4"': 'className="font-bold text-lg text-cyan-50 leading-tight truncate pr-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"',
    
    'className="flex-1 flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-600"': 'className="flex-1 flex items-center justify-center gap-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-cyan-300 py-1.5 rounded-lg text-xs font-bold transition-all border border-cyan-800/50 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]"',
    
    "className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${app.theme.style === 'modern' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : app.theme.style === 'fresh' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-amber-900/30 text-amber-400 border-amber-500/30'}`}": "className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${app.theme.style === 'modern' ? 'bg-blue-900/30 text-blue-400 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : app.theme.style === 'fresh' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-900/30 text-amber-400 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}",
    
    'className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 p-2 rounded-lg transition-all hover:scale-105 shadow-sm"': 'className="bg-[#0f172a] border border-indigo-500/50 hover:border-indigo-400 text-indigo-400 p-2 rounded-lg transition-all hover:shadow-[0_0_10px_rgba(99,102,241,0.4)]"',
    
    'className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all hover:scale-105 shadow-sm"': 'className="bg-[#0f172a] border border-fuchsia-500/50 hover:border-fuchsia-400 text-fuchsia-400 p-2 rounded-lg transition-all hover:shadow-[0_0_10px_rgba(217,70,239,0.4)]"',
    
    'className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white"': 'className="bg-[#0b1727] border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]"'
}

for old, new in replacements.items():
    if old not in c:
        print(f"NOT FOUND: {old[:50]}...")
    c = c.replace(old, new)

with open('components/factory/FactoryDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

