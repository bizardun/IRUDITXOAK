import re

with open('components/factory/FactoryDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Main container background
c = c.replace(
    '<div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8 relative">',
    '<div className="min-h-screen bg-[#0b0f12] text-white font-sans p-4 sm:p-8 relative">'
)

# 2. Main title
c = c.replace(
    'FACTORY DASHBOARD',
    'AURA RESTAURANT SUITE'
)
c = c.replace(
    'text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight',
    'text-xl sm:text-2xl font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
)

# 3. App Cards
c = c.replace(
    "bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-blue-900/20",
    "bg-gradient-to-b from-[#1a1c1e] to-[#121415] border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
)

# 4. App Logo container (I already changed this in previous script, wait, no, the first script failed. Let's check if the logo logic is there).
