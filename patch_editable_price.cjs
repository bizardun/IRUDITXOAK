const fs = require('fs');
let content = fs.readFileSync('components/ui/EditablePrice.tsx', 'utf8');

if (!content.includes('useConfig')) {
    content = content.replace(
        "import React, { useState, useEffect } from 'react';",
        "import React, { useState, useEffect } from 'react';\nimport { useConfig } from '../../context/ConfigContext';"
    );
}

content = content.replace(
    "const [val, setVal] = useState(price.toFixed(2));",
    "const [val, setVal] = useState(price.toFixed(2));\n    const { config } = useConfig();\n    const isKanala = config?.name?.toLowerCase().includes('kanala') || false;"
);

content = content.replace(
    'className="w-20 px-1 py-0.5 text-sm font-bold text-black bg-white border-2 border-blue-400 rounded shadow-sm focus:outline-none"',
    'className={`w-20 px-1 py-0.5 text-sm font-bold border-2 rounded shadow-sm focus:outline-none ${isKanala ? "text-white bg-neutral-900 border-white/50" : "text-black bg-white border-blue-400"}`}'
);

content = content.replace(
    '<span onClick={() => setIsEditing(true)} className="cursor-pointer border border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 px-2 py-1 rounded-md transition-colors shadow-sm text-sm font-medium">',
    '<span onClick={() => setIsEditing(true)} className={`cursor-pointer border px-2 py-1 rounded-md transition-colors shadow-sm text-sm font-medium ${isKanala ? "border-white/20 bg-neutral-900 text-white hover:border-white/60 hover:bg-white/10" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"}`}>'
);

fs.writeFileSync('components/ui/EditablePrice.tsx', content);
console.log("EditablePrice patched");
