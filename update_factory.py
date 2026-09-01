import re

with open('components/factory/FactoryDashboard.tsx', 'r') as f:
    content = f.read()

# Add states
state_old = "const [passwordApp, setPasswordApp] = useState<RestaurantConfig | null>(null);"
state_new = """const [passwordApp, setPasswordApp] = useState<RestaurantConfig | null>(null);
    const [websiteApp, setWebsiteApp] = useState<RestaurantConfig | null>(null);
    const [newWebsite, setNewWebsite] = useState('');"""

if state_old in content:
    content = content.replace(state_old, state_new)
else:
    print("Failed to replace state")

# Add handler functions
handler_old = """    const savePassword = async () => {
        if (!passwordApp) return;
        const updatedApp = { ...passwordApp, adminPassword: newAdminPassword };
        // Save to DB
        
        await api.saveApp(updatedApp);
        // Refresh apps list would be ideal, but we can just update local state or just close
        setPasswordApp(null);
        // Note: The useConfig context should ideally provide a way to update, but we just trigger a save via API directly and the context might not auto-refresh. For simplicity, we just reload window or rely on the user to understand it's saved.
        alert('Contraseña guardada correctamente.');
    };"""

handler_new = handler_old + """

    const handleWebsiteClick = (e: React.MouseEvent, app: RestaurantConfig) => {
        e.stopPropagation();
        setWebsiteApp(app);
        setNewWebsite(app.officialWebsite || '');
    };

    const saveWebsite = async () => {
        if (!websiteApp) return;
        const updatedApp = { ...websiteApp, officialWebsite: newWebsite };
        await api.saveApp(updatedApp);
        setWebsiteApp(null);
        alert('Web oficial guardada correctamente.');
    };"""

if handler_old in content:
    content = content.replace(handler_old, handler_new)
else:
    print("Failed to replace handler")

# Add button
btn_old = """                                            <button 
                                                onClick={(e) => handleShareClick(e, app)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-600"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M3 14h7v7H3z"/></svg> QR
                                            </button>
                                        </div>"""

btn_new = """                                            <button 
                                                onClick={(e) => handleShareClick(e, app)}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-600"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M3 14h7v7H3z"/></svg> QR
                                            </button>
                                            <button 
                                                onClick={(e) => handleWebsiteClick(e, app)}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-600"
                                                title="Configurar Web Oficial"
                                            >
                                                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> Web
                                            </button>
                                        </div>"""

if btn_old in content:
    content = content.replace(btn_old, btn_new)
else:
    print("Failed to replace btn")

# Add website modal
modal_old = """            {/* Modal de Configurar Contraseña */}"""

modal_new = """            {/* Modal de Configurar Web */}
            {websiteApp && (
                <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Configurar Web Oficial</h2>
                        <p className="text-sm text-slate-600 mb-4">Establece la página web oficial para <strong>{websiteApp.name}</strong>.</p>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Enlace (URL)</label>
                                <input 
                                    type="text" 
                                    value={newWebsite}
                                    onChange={(e) => setNewWebsite(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej: https://www.kanala.es"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setWebsiteApp(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Cancelar</button>
                            <button onClick={saveWebsite} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-bold shadow-sm">Guardar Web</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Configurar Contraseña */}"""

if modal_old in content:
    content = content.replace(modal_old, modal_new)
else:
    print("Failed to replace modal")

with open('components/factory/FactoryDashboard.tsx', 'w') as f:
    f.write(content)
print("Updated FactoryDashboard")
