const fs = require('fs');
let content = fs.readFileSync('components/gestion/AddPlatoModal.tsx', 'utf8');

if (!content.includes('useConfig')) {
    content = content.replace(
        "import React, { useState, useEffect } from 'react';",
        "import React, { useState, useEffect } from 'react';\nimport { useConfig } from '../../context/ConfigContext';"
    );
}

content = content.replace(
    "const { updatePlato, addPlato, platos } = useData();",
    "const { updatePlato, addPlato, platos } = useData();\n    const { config } = useConfig();\n    const isKanala = config?.name?.toLowerCase().includes('kanala') || false;"
);

content = content.replace(
    '<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up border border-slate-200 my-8">',
    '<form onSubmit={handleSubmit} className={`rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up border my-8 ${isKanala ? "bg-neutral-900 border-white/20" : "bg-white border-slate-200"}`}>'
);

content = content.replace(
    /className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500"/g,
    'className={`w-full border rounded-lg p-2 text-sm outline-none focus:border-blue-500 ${isKanala ? "bg-neutral-800 border-white/20 text-white" : "bg-slate-50 border-slate-200"}`}'
);

content = content.replace(
    /className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-blue-500"/g,
    'className={`w-full border rounded-lg p-2 text-xs outline-none focus:border-blue-500 ${isKanala ? "bg-neutral-800 border-white/20 text-white" : "bg-white border-slate-200"}`}'
);

content = content.replace(
    /className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-blue-500 min-h-\[60px\] resize-y"/g,
    'className={`w-full border rounded-lg p-2 text-xs outline-none focus:border-blue-500 min-h-[60px] resize-y ${isKanala ? "bg-neutral-800 border-white/20 text-white" : "bg-slate-50 border-slate-200"}`}'
);

content = content.replace(
    '<h2 className="text-xl font-bold text-slate-800 px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">',
    '<h2 className={`text-xl font-bold px-6 py-4 border-b flex justify-between items-center ${isKanala ? "text-white border-white/10 bg-neutral-800" : "text-slate-800 border-slate-100 bg-slate-50"}`}>'
);

fs.writeFileSync('components/gestion/AddPlatoModal.tsx', content);
console.log('AddPlatoModal patched!');
