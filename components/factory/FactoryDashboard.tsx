
import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { ThemeConfig, RestaurantConfig } from '../../types';
import { generateRestaurantZip } from '../../services/zipService';

// --- ICONOS LOCALES ---
const IconShare = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>;
const IconRocket = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>;
const IconCopy = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const IconCheck = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconWhatsapp = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const IconDownload = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;

export default function FactoryDashboard() {
    const { availableApps, loadApp, createApp, deleteApp, exitFactory } = useConfig();
    const [newName, setNewName] = useState('');
    const [prompt, setPrompt] = useState('');
    
    // File handling
    const [fileData, setFileData] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');

    const [step, setStep] = useState<'list' | 'create'>('list');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    
    // Estado para confirmación de borrado
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    
    // Estado para Compartir / Desplegar
    const [sharingApp, setSharingApp] = useState<RestaurantConfig | null>(null);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployUrl, setDeployUrl] = useState('');
    const [copied, setCopied] = useState(false);

    // Estado para Descargar ZIP
    const [isZipping, setIsZipping] = useState(false);

    // Style State
    const [font, setFont] = useState<ThemeConfig['font']>('font-lora');
    const [style, setStyle] = useState<ThemeConfig['style']>('classic');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setMimeType(file.type);
            const reader = new FileReader();
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                reader.onload = (evt) => { if (evt.target?.result) setFileData((evt.target.result as string).split(',')[1]); };
                reader.readAsDataURL(file);
            } else {
                reader.onload = (evt) => { if (evt.target?.result) setFileData(evt.target.result as string); };
                reader.readAsText(file);
            }
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newName) return;
        setIsLoading(true);
        try {
            await createApp(newName, prompt, fileData, mimeType, { font, style });
        } catch (error) {
            alert("Error creando la app. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (appId: string) => {
        if (confirmDeleteId === appId) {
            deleteApp(appId);
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(appId);
            setTimeout(() => setConfirmDeleteId(prev => prev === appId ? null : prev), 3000);
        }
    };

    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setConfirmDeleteId(null);
    };

    const handleShareClick = (e: React.MouseEvent, app: RestaurantConfig) => {
        e.stopPropagation();
        setSharingApp(app);
        setIsDeploying(true);
        setDeployUrl('');
        setTimeout(() => {
            const mockUrl = `https://${app.id.replace(/_/g, '-')}.menu-app.io`;
            setDeployUrl(mockUrl);
            setIsDeploying(false);
        }, 1500);
    };

    const closeShare = () => { setSharingApp(null); setCopied(false); };
    const copyToClipboard = () => {
        if (!deployUrl) return;
        navigator.clipboard.writeText(deployUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- NUEVA LÓGICA DE DESCARGA ZIP ---
    const handleDownloadApp = async (e: React.MouseEvent, app: RestaurantConfig) => {
        e.stopPropagation();
        setIsZipping(true);
        
        try {
            // 1. Recuperar datos actualizados
            const storedData = localStorage.getItem(app.id);
            const latestPlatos = storedData ? JSON.parse(storedData) : app.initialPlatos;
            
            // 2. Crear config final
            const configToExport = {
                ...app,
                initialPlatos: latestPlatos
            };

            // 3. Generar ZIP
            await generateRestaurantZip(configToExport);
            
        } catch (error) {
            console.error("Error generando ZIP:", error);
            alert("Error generando código fuente. Verifica que tengas conexión para cargar JSZip.");
        } finally {
            setIsZipping(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8 relative">
            
            {sharingApp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-800 border border-slate-600 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
                        <button onClick={closeShare} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-6">
                                {isDeploying ? <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <IconRocket />}
                            </div>
                            {isDeploying ? (
                                <div className="space-y-2"><h3 className="text-xl font-bold text-white">Implementando App...</h3><p className="text-slate-400 text-sm">Generando rutas...</p></div>
                            ) : (
                                <div className="w-full space-y-6 animate-fade-in-up">
                                    <div className="space-y-1"><h3 className="text-xl font-bold text-white">¡{sharingApp.name} online!</h3><p className="text-slate-400 text-sm">Lista para compartir.</p></div>
                                    <div className="bg-slate-900 rounded-xl p-3 flex items-center gap-2 border border-slate-700">
                                        <input readOnly value={deployUrl} className="bg-transparent text-emerald-400 text-sm font-mono flex-1 outline-none" />
                                        <button onClick={copyToClipboard} className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{copied ? <IconCheck /> : <IconCopy />}</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <a href={`https://wa.me/?text=Mira la carta: ${deployUrl}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 rounded-xl font-bold text-sm transition-colors"><IconWhatsapp /> WhatsApp</a>
                                        <button onClick={() => alert(`QR generado para: ${deployUrl}`)} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 py-2.5 rounded-xl font-bold text-sm transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M3 14h7v7H3z"/></svg> Ver QR</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-slate-700 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">Gestión de Restaurantes</h1>
                        <p className="text-slate-400 text-sm">Plataforma de Gestión y Creación</p>
                    </div>
                    <button onClick={exitFactory} className="text-slate-400 hover:text-white transition-colors text-xs font-bold flex items-center gap-2 border border-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-800">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18-6-6 6-6"/></svg> Volver al Restaurante Activo
                    </button>
                </header>

                {step === 'list' && (
                    <div className="grid gap-6">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <h2 className="text-xl font-bold text-slate-200">Mis Aplicaciones</h2>
                            <div className="flex items-center gap-3">
                                <button onClick={toggleDeleteMode} className={`px-4 py-2 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 border ${isDeleteMode ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'}`}>
                                    {isDeleteMode ? <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Terminar Edición</> : <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> Gestionar / Eliminar</>}
                                </button>
                                {!isDeleteMode && (
                                    <button onClick={() => setStep('create')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-900/50 transition-all flex items-center gap-2">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> Nueva App AI
                                    </button>
                                )}
                            </div>
                        </div>

                        {isDeleteMode && <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-center text-sm font-bold animate-fade-in">MODO ELIMINACIÓN: Selecciona la aplicación que deseas borrar permanentemente.</div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableApps.map(app => (
                                <div key={app.id} onClick={() => !isDeleteMode && loadApp(app.id)} className={`group relative rounded-xl p-6 border transition-all cursor-pointer shadow-lg flex flex-col justify-between ${isDeleteMode ? 'bg-slate-800 border-red-500/50 ring-2 ring-red-500/20' : 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-blue-900/20 hover:-translate-y-1'}`}>
                                    {isDeleteMode && app.id !== 'bolina_viejo_v1' && (
                                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] z-50 rounded-xl flex items-center justify-center animate-fade-in">
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(app.id); }} className={`${confirmDeleteId === app.id ? 'bg-red-700 scale-110 border-red-300 animate-pulse' : 'bg-red-600 hover:bg-red-500 border-red-400 hover:scale-105'} text-white px-6 py-3 rounded-full font-bold shadow-xl transform transition-all flex items-center gap-2 border-2`}>
                                                {confirmDeleteId === app.id ? <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> ¿CONFIRMAR?</> : <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> ELIMINAR</>}
                                            </button>
                                        </div>
                                    )}
                                    {isDeleteMode && app.id === 'bolina_viejo_v1' && <div className="absolute inset-0 bg-slate-900/60 z-50 rounded-xl flex items-center justify-center"><span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-600">Protegida (Master)</span></div>}

                                    <div>
                                        <div className="flex justify-between items-start mb-4 opacity-100">
                                             <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-slate-600/50">{app.name.charAt(0).toUpperCase()}</div>
                                            {app.theme && <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${app.theme.style === 'modern' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : app.theme.style === 'fresh' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-amber-900/30 text-amber-400 border-amber-500/30'}`}>{app.theme.style}</span>}
                                        </div>
                                        <div className="space-y-1 mb-4"><h3 className="font-bold text-lg text-white leading-tight truncate pr-4">{app.name}</h3>{app.slogan && <p className="text-slate-400 text-xs truncate">{app.slogan}</p>}</div>
                                        <div className="mt-4 space-y-2 mb-4">
                                            <div onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`https://${app.id.replace(/_/g, '-')}.menu-app.io`); }} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-700/50 cursor-copy hover:border-emerald-500/50 transition-colors group/url" title="Copiar URL App Cliente">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                                                <div className="flex-1 min-w-0"><p className="text-[10px] text-slate-500 uppercase font-bold leading-none mb-0.5">App Cliente</p><p className="text-xs text-emerald-400 font-mono truncate">menu.app/{app.id}</p></div>
                                                <IconCopy className="w-4 h-4 text-slate-600 group-hover/url:text-slate-300" />
                                            </div>
                                            <div onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`https://${app.id.replace(/_/g, '-')}.menu-app.io/admin`); }} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-700/50 cursor-copy hover:border-blue-500/50 transition-colors group/url" title="Copiar URL Panel Gestión">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                                <div className="flex-1 min-w-0"><p className="text-[10px] text-slate-500 uppercase font-bold leading-none mb-0.5">Gestión</p><p className="text-xs text-blue-400 font-mono truncate">menu.app/{app.id}/admin</p></div>
                                                <IconCopy className="w-4 h-4 text-slate-600 group-hover/url:text-slate-300" />
                                            </div>
                                            <button onClick={(e) => handleShareClick(e, app)} className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white py-1 hover:bg-slate-700 rounded transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M3 14h7v7H3z"/></svg> Ver Código QR</button>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center gap-2">
                                        <span className="text-xs text-slate-500 font-mono">{app.initialPlatos?.length || 0} items</span>
                                        {!isDeleteMode && (
                                            <div className="flex items-center gap-2">
                                                 <button onClick={(e) => handleDownloadApp(e, app)} disabled={isZipping} className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 p-2 rounded-lg transition-all hover:scale-105 shadow-sm" title="Descargar Código Fuente (ZIP)">
                                                    {isZipping ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <IconDownload />}
                                                </button>
                                                <button onClick={(e) => handleShareClick(e, app)} className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all hover:scale-105 shadow-sm" title="Implementar y Compartir"><IconRocket /></button>
                                                <button className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white">Abrir <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {step === 'create' && (
                    <div className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                             <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></div>
                             <div><h2 className="text-2xl font-bold text-white">Generar Restaurante con IA</h2><p className="text-slate-400 text-sm">Describe tu restaurante y sube tu menú.</p></div>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-sm font-bold text-slate-300 mb-2">Nombre del Restaurante</label><input autoFocus type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none placeholder-slate-600" placeholder="Ej: La Trattoria Digital" required /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-bold text-slate-300 mb-2">Tipografía</label><select value={font} onChange={(e) => setFont(e.target.value as any)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white outline-none"><option value="font-lora">Clásica (Lora)</option><option value="font-inter">Moderna (Inter)</option><option value="font-serif">Elegante (Serif)</option><option value="font-sans">Limpia (Sans)</option></select></div>
                                    <div><label className="block text-sm font-bold text-slate-300 mb-2">Tema</label><select value={style} onChange={(e) => setStyle(e.target.value as any)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white outline-none"><option value="classic">Clásico (Ámbar)</option><option value="modern">Moderno (Azul)</option><option value="fresh">Fresco (Verde/Lima)</option></select></div>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 space-y-4">
                                <div><label className="block text-sm font-bold text-blue-400 mb-2 flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Subir Menú</label><div className="flex items-center gap-4"><label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 transition-colors text-sm font-medium">Seleccionar Archivo <input type="file" onChange={handleFileChange} accept=".csv,.txt,.json,.md,.pdf,.jpg,.jpeg,.png,.webp" className="hidden" /></label><span className="text-slate-400 text-sm italic truncate max-w-[200px]">{fileName || "Ningún archivo seleccionado"}</span></div></div>
                                <div><label className="block text-sm font-bold text-slate-300 mb-2">Instrucciones</label><textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none resize-none" placeholder="Instrucciones para la IA..." /></div>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-slate-700">
                                <button type="button" onClick={() => setStep('list')} disabled={isLoading} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-slate-300 transition-colors disabled:opacity-50">Cancelar</button>
                                <button type="submit" disabled={isLoading || !newName} className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3">{isLoading ? "Generando..." : "Crear Restaurante"}</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
