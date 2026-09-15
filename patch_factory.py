with open('components/factory/FactoryDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_logo = """<div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-slate-600/50">{(app?.name || 'A').charAt(0).toUpperCase()}</div>"""

new_logo = """<div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-inner border border-slate-600/50 overflow-hidden">
                                                {app.name.toLowerCase().includes('kanala') ? (
                                                    <img src="https://www.kanalabeach.eus/wp-content/uploads/2024/06/kanala-logos_LOGO-HORIZONTAL-zuria.png" alt={app.name} className="w-full h-full object-contain p-1" />
                                                ) : app.name.toLowerCase().includes('boliña') ? (
                                                    <img src="/logo boliña sin fondo.jfif" alt={app.name} className="w-full h-full object-contain bg-white" />
                                                ) : (
                                                    <span className="text-3xl text-white">{(app?.name || 'A').charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>"""

content = content.replace(old_logo, new_logo)

with open('components/factory/FactoryDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
