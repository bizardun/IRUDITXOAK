
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { IconChevronLeft, FlagES, FlagEU, FlagEN, FlagFR, FlagDE, FlagIT } from '../icons';
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
    const [downloadingCartel, setDownloadingCartel] = useState(false);
    const cartelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tu-dominio.vercel.app';
        const baseUrl = originUrl + "/?app=" + config.id + "&client=true";
        setCleanUrl(baseUrl);
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear().toString();
        setDateStr(`${day}/${month}/${year}`);
    }, [config.id]);

    useEffect(() => {
        if (!cleanUrl) return;
        const timer = setTimeout(() => {
            const qrSource = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(cleanUrl)}&size=1000x1000&qzone=1&bgcolor=ffffff`;
            setQrUrl(qrSource);
        }, 500);
        return () => clearTimeout(timer);
    }, [cleanUrl]);

    const handleDownloadCartel = async () => {
        if (!cartelRef.current) return;
        setDownloadingCartel(true);
        try {
            const canvas = await html2canvas(cartelRef.current, { scale: 2, useCORS: true, logging: false });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `${config.id}-cartel.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error descargando cartel", error);
            alert("No se pudo descargar el cartel.");
        } finally {
            setDownloadingCartel(false);
        }
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
                    <button onClick={() => setView('home')} className="flex items-center gap-2 group text-left transition-colors">
                        <div className="p-2 bg-slate-100 rounded-full group-hover:bg-slate-200 text-slate-600 transition-colors">
                            <IconChevronLeft className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold font-lora text-slate-800 group-hover:text-slate-900 transition-colors">
                            Generador de QR (v2)
                        </h1>
                    </button>
                    
                    <div className="flex gap-2">
                        <button onClick={handleDownload} disabled={downloading} className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            {downloading ? '...' : 'Descargar QR'}
                        </button>
                        <button onClick={handleDownloadCartel} disabled={downloadingCartel} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 shadow transition-all flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            {downloadingCartel ? '...' : 'Descargar Cartel'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex justify-center p-4 sm:p-8 overflow-auto bg-slate-100">
                <div ref={cartelRef} className="bg-white shadow-2xl print:shadow-none w-full max-w-[210mm] aspect-[1/1.4142] sm:aspect-auto sm:min-h-[297mm] p-8 sm:p-16 flex flex-col items-center text-center relative border border-slate-200 print:border-none">
                    <div className="absolute top-0 left-0 w-full h-4 bg-amber-500 print:visible"></div>
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-slate-800 print:visible"></div>

                    <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
                        <div className="space-y-4">
                            {config.name.toLowerCase().includes('boliña') ? (
                                <img src="/logo boliña sin fondo.jfif" alt={config.name} className="h-32 sm:h-48 mx-auto object-contain drop-shadow-md" />
                            ) : (
                                <h1 className="text-4xl sm:text-6xl font-bold font-lora text-slate-900 tracking-tight leading-tight">
                                    {config.name}
                                </h1>
                            )}
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
                        
                        <div className="flex gap-2.5 sm:gap-4 justify-center items-center opacity-80 print:opacity-100 pt-1.5 pb-1.5">
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagEU /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagEN /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagFR /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagDE /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagIT /></div>
                            <div className="w-9 h-6 sm:w-12 sm:h-8 rounded overflow-hidden shadow-sm"><FlagES /></div>
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
