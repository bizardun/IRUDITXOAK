const fs = require('fs');

let content = fs.readFileSync('components/gestion/GestionQR.tsx', 'utf8');

// Add useRef and html2canvas
content = content.replace(
    "import React, { useState, useEffect } from 'react';", 
    "import React, { useState, useEffect, useRef } from 'react';\nimport html2canvas from 'html2canvas';"
);

// Add state for downloading cartel and ref
content = content.replace(
    "const [downloading, setDownloading] = useState(false);",
    "const [downloading, setDownloading] = useState(false);\n    const [downloadingCartel, setDownloadingCartel] = useState(false);\n    const cartelRef = useRef<HTMLDivElement>(null);"
);

// Replace handlePrint with handleDownloadCartel
const newHandleDownloadCartel = `    const handleDownloadCartel = async () => {
        if (!cartelRef.current) return;
        setDownloadingCartel(true);
        try {
            const canvas = await html2canvas(cartelRef.current, { scale: 2, useCORS: true, logging: false });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${config.id}-cartel.png\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error descargando cartel", error);
            alert("No se pudo descargar el cartel.");
        } finally {
            setDownloadingCartel(false);
        }
    };`;

content = content.replace(
    /    const handlePrint = \(\) => \{\s*window\.print\(\);\s*\};/g,
    newHandleDownloadCartel
);

// Change text and onClick of the buttons
content = content.replace(
    /\{downloading \? '\.\.\.' : 'Descargar PNG'\}/g,
    "{downloading ? '...' : 'Descargar QR'}"
);

content = content.replace(
    /<button onClick=\{handlePrint\} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 shadow transition-all flex items-center gap-2 text-sm">\s*<svg[^>]*>.*?<\/svg>\s*Imprimir Cartel\s*<\/button>/,
    `<button onClick={handleDownloadCartel} disabled={downloadingCartel} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 shadow transition-all flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            {downloadingCartel ? '...' : 'Descargar Cartel'}
                        </button>`
);

// Add ref to the cartel div
content = content.replace(
    /className="bg-white shadow-2xl print:shadow-none w-full max-w-\[210mm\] aspect-\[1\/1\.4142\] sm:aspect-auto sm:min-h-\[297mm\] p-8 sm:p-16 flex flex-col items-center text-center relative border border-slate-200 print:border-none"/,
    `ref={cartelRef} className="bg-white shadow-2xl print:shadow-none w-full max-w-[210mm] aspect-[1/1.4142] sm:aspect-auto sm:min-h-[297mm] p-8 sm:p-16 flex flex-col items-center text-center relative border border-slate-200 print:border-none"`
);

fs.writeFileSync('components/gestion/GestionQR.tsx', content);
