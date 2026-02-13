import React, { useState, useEffect } from 'react';
import { IconChevronLeft } from '../icons';
import { useConfig } from '../../context/ConfigContext';

interface GestionQRProps {
    setView: (view: 'home') => void;
}

const GestionQR: React.FC<GestionQRProps> = ({ setView }) => {
    const { config } = useConfig();
    const [cleanUrl, setCleanUrl] = useState('');
    const [qrUrl, setQrUrl] = useState('');
    const [dateStr, setDateStr] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        let baseUrl = window.location.href;
        baseUrl = baseUrl.split('?')[0].split('#')[0];
        setCleanUrl(baseUrl);

        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear().toString();
        setDateStr(`${day}/${month}/${year}`);
    }, []);

    useEffect(() => {
        if (!cleanUrl) return;
        const timer = setTimeout(() => {
            const qrSource = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(cleanUrl)}&size=1000x1000&qzone=1&bgcolor=ffffff`;
            setQrUrl(qrSource);
        }, 500);
        return () => clearTimeout(timer);
    }, [cleanUrl]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${config.id}-qr.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error descargando QR", error);
            alert("No se pudo descargar la imagen.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
            <div className="print:hidden bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="p-4 flex flex-wrap gap-3 justify-between items-center">
                    <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                        <IconChevronLeft /> Volver
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Generador de QR</h1>
                    
                    <div className="flex gap-2">
                        <button onClick={handleDownload} disabled={downloading} className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            {downloading ? '...' : 'Descargar PNG'}
                        </button>
                        <button onClick={handlePrint} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 shadow transition-all flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                            Imprimir Cartel
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex justify-center p-4 sm:p-8 overflow-auto bg-slate-100">
                <div className="bg-white shadow-2xl print:shadow-none w-full max-w-[210mm] aspect-[1/1.4142] sm:aspect-auto sm:min-h-[297mm] p-8 sm:p-16 flex flex-col items-center text-center relative border border-slate-200 print:border-none">
                    <div className="absolute top-0 left-0 w-full h-4 bg-amber-500 print:visible"></div>
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-slate-800 print:visible"></div>

                    <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-6xl font-bold font-lora text-slate-900 tracking-tight leading-tight">
                                {config.name}
                            </h1>
                            <div className="h-1 w-32 bg-amber-500 mx-auto rounded-full"></div>
                            {config.slogan && (
                                <p className="text-xl sm:text-2xl text-slate-500 font-lora italic">
                                    {config.slogan}
                                </p>
                            )}
                        </div>

                        <div className="relative group">
                            <div className="relative bg-white p-4 rounded-xl border-4 border-slate-900 shadow-inner">
                                {qrUrl ? (
                                    <img src={qrUrl} alt="QR Code" className="w-64 h-64 sm:w-96 sm:h-96 object-contain mix-blend-multiply" />
                                ) : (
                                    <div className="w-64 h-64 bg-slate-100 flex items-center justify-center text-slate-400">Generando QR...</div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 max-w-md">
                            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wider">
                                Escanea el código
                            </h2>
                            <p className="text-slate-600 text-lg">
                                Para ver nuestros platos, precios y menú del día actualizado.
                            </p>
                        </div>
                    </div>

                    <div className="w-full flex justify-between items-end text-xs text-slate-400 border-t border-slate-100 pt-6 mt-8 font-mono">
                        <div className="text-left">
                            <p>Actualizado: {dateStr}</p>
                            <p className="mt-1 text-slate-300 max-w-[200px] truncate">{cleanUrl}</p>
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                @media print {
                    @page { margin: 0; size: A4 portrait; }
                    body { background: white; -webkit-print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                    .shadow-2xl { box-shadow: none !important; }
                    .min-h-screen { min-height: 100vh !important; height: auto !important; }
                    .bg-slate-100 { background-color: white !important; }
                }
            `}</style>
        </div>
    );
};

export default GestionQR;