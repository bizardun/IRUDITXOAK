import re

with open('components/factory/FactoryDashboard.tsx', 'r') as f:
    content = f.read()

# Fix for newWebsite input
old_web_input = """                                <input 
                                    type="text" 
                                    value={newWebsite}
                                    onChange={(e) => setNewWebsite(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej: https://www.kanala.es"
                                />"""
new_web_input = """                                <input 
                                    type="text" 
                                    value={newWebsite}
                                    onChange={(e) => setNewWebsite(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                                    placeholder="Ej: https://www.kanala.es"
                                />"""

if old_web_input in content:
    content = content.replace(old_web_input, new_web_input)

# Fix for newAdminPassword input
old_pass_input = """                                <input 
                                    type="text" 
                                    value={newAdminPassword}
                                    onChange={(e) => setNewAdminPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej: 1234"
                                />"""
new_pass_input = """                                <input 
                                    type="text" 
                                    value={newAdminPassword}
                                    onChange={(e) => setNewAdminPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
                                    placeholder="Ej: 1234"
                                />"""

if old_pass_input in content:
    content = content.replace(old_pass_input, new_pass_input)

with open('components/factory/FactoryDashboard.tsx', 'w') as f:
    f.write(content)
print("Fixed inputs colors")
