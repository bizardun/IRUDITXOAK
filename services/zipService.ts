
import { RestaurantConfig } from '../types';

declare const JSZip: any;

const packageJson = `{
  "name": "restaurant-app-standalone",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@google/genai": "^0.1.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}`;

const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "unusedLocals": false,
    "unusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;

const tsConfigNode = `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`;

const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`;

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ['Lora', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}`;

const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

const indexHtml = (title: string) => `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        background-color: #FDFBF7;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        overscroll-behavior-y: none;
      }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
}`;

export const generateRestaurantZip = async (config: RestaurantConfig) => {
    if (typeof JSZip === 'undefined') {
        alert("La librería JSZip no está cargada. Recarga la página.");
        return;
    }

    const zip = new JSZip();

    zip.file("package.json", packageJson);
    zip.file("tsconfig.json", tsConfig);
    zip.file("tsconfig.node.json", tsConfigNode);
    zip.file("vite.config.ts", viteConfig);
    zip.file("tailwind.config.js", tailwindConfig);
    zip.file("postcss.config.js", postcssConfig);
    zip.file("index.html", indexHtml(config.name));

    const src = zip.folder("src");
    src.file("main.tsx", mainTsx);
    src.file("index.css", indexCss);

    // Inject Specific Config
    src.folder("config").file("restaurant.ts", `
import { RestaurantConfig } from '../types';
export const appConfig: RestaurantConfig = ${JSON.stringify(config, null, 2)};
export const getActiveConfig = () => appConfig;
export const getMasterPlatos = () => appConfig.initialPlatos;
`);

    // Modified ConfigContext for Standalone
    src.folder("context").file("ConfigContext.tsx", `
import React, { createContext, useContext, useState } from 'react';
import { RestaurantConfig } from '../types';
import { getActiveConfig } from '../config/restaurant';

interface ConfigContextType {
    config: RestaurantConfig;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config] = useState<RestaurantConfig>(getActiveConfig());
    return (
        <ConfigContext.Provider value={{ config }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) throw new Error('useConfig must be used within ConfigProvider');
    return context;
};
`);

    // Modified App.tsx for Standalone
    src.file("App.tsx", `
import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import ClienteApp from './components/cliente/ClienteApp';
import GestionApp from './components/gestion/GestionApp';

const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

const MainLayout = () => {
    const { config } = useConfig();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        document.title = \`\${config.name} - Carta Digital\`;
    }, [config]);

    const fontClass = config.theme?.font || 'font-lora';
    const themeStyle = config.theme?.style || 'classic';
    const themeColors = {
        classic: 'bg-[#FDFBF7] text-slate-800',
        modern: 'bg-slate-50 text-slate-900',
        fresh: 'bg-emerald-50/30 text-emerald-950'
    };

    return (
        <DataProvider key={config.id}>
            <div className={\`min-h-screen leading-tight \${fontClass} \${themeColors[themeStyle]}\`}>
                <div className="print:hidden sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-3 px-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-end">
                        <div className="flex bg-slate-100 p-1 rounded-full shadow-inner border border-slate-200">
                            <button onClick={() => setIsAdmin(false)} className={\`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 \${!isAdmin ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}\`}>
                                <IconUser /> <span className="hidden sm:inline">Cliente</span>
                            </button>
                            <button onClick={() => setIsAdmin(true)} className={\`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 \${isAdmin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}\`}>
                                <IconSettings /> <span className="hidden sm:inline">Gestión</span>
                            </button>
                        </div>
                    </div>
                </div>
                {isAdmin ? <GestionApp /> : <ClienteApp />}
            </div>
        </DataProvider>
    );
};

export default function App() {
    return (
        <ConfigProvider>
            <MainLayout />
        </ConfigProvider>
    );
}
`);

    // Fetch and copy other files
    const componentFiles = [
        'services/api.ts', 'context/DataContext.tsx', 'types.ts', 'constants.ts',
        'components/cliente/ClienteApp.tsx', 'components/gestion/GestionApp.tsx',
        'components/gestion/GestionHome.tsx', 'components/gestion/GestionCategoria.tsx',
        'components/gestion/AddPlatoModal.tsx', 'components/gestion/GestionQR.tsx',
        'components/icons.tsx', 'components/ui/Switch.tsx', 'components/ui/EditablePrice.tsx'
    ];

    for (const filePath of componentFiles) {
        try {
            const res = await fetch(`/${filePath}`);
            if (res.ok) {
                const text = await res.text();
                if (!text.trim().startsWith('<!DOCTYPE')) {
                     const parts = filePath.split('/');
                     let folder = src;
                     for(let i=0; i<parts.length-1; i++) folder = folder.folder(parts[i]);
                     folder.file(parts[parts.length-1], text);
                }
            }
        } catch (e) {
            console.warn(`Skipping ${filePath}`);
        }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_source.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};
