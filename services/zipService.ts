
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
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@google/genai": "^1.30.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
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
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`;

const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })`;

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { lora: ['Lora', 'serif'], inter: ['Inter', 'sans-serif'] },
      animation: { 'fade-in': 'fadeIn 0.5s ease-out' },
      keyframes: { fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } } }
    },
  },
  plugins: [],
}`;

const indexHtml = (title: string) => `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Inter:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>`;

const API_SOURCE = `
import { GoogleGenAI } from "@google/genai";
const apiKey = typeof process !== 'undefined' && process.env.API_KEY ? process.env.API_KEY : "";
const ai = new GoogleGenAI({ apiKey });

const extractSources = (res) => res.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(c => ({ title: c.web?.title, uri: c.web?.uri })).filter(s => s.uri) || [];

export default {
    getPlatos: async () => JSON.parse(localStorage.getItem('restaurant_db') || '[]'),
    getMenuPrice: async () => parseFloat(localStorage.getItem('menu_price') || '16.5'),
    updatePlato: async (id, data) => {
        const c = JSON.parse(localStorage.getItem('restaurant_db') || '[]');
        localStorage.setItem('restaurant_db', JSON.stringify(c.map(p => p.ID_Plato === id ? {...p, ...data} : p)));
    },
    addPlato: async (p) => {
        const c = JSON.parse(localStorage.getItem('restaurant_db') || '[]');
        const nid = Math.max(...c.map(x => x.ID_Plato), 0) + 1;
        c.push({...p, ID_Plato: nid});
        localStorage.setItem('restaurant_db', JSON.stringify(c));
    },
    deletePlato: async (id) => {
        const c = JSON.parse(localStorage.getItem('restaurant_db') || '[]');
        localStorage.setItem('restaurant_db', JSON.stringify(c.filter(x => x.ID_Plato !== id)));
    },
    analyzeDish: async (name) => {
        const resp = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: \`Analyze: "\${name}"\`,
            config: { 
                systemInstruction: "Translate to EU, EN, FR, DE, IT. For Basque (EU), use Google Search to cross-reference with https://www.euskadi.eus/diccionario-elhuyar/. Detect allergens. JSON format.",
                responseMimeType: "application/json",
                tools: [{ googleSearch: {} }]
            }
        });
        return { ...JSON.parse(resp.text), sources: extractSources(resp) };
    }
};
`;

export const generateRestaurantZip = async (config: RestaurantConfig) => {
    if (typeof JSZip === 'undefined') return;
    const zip = new JSZip();
    zip.file("package.json", packageJson);
    zip.file("index.html", indexHtml(config.name));
    zip.file("vite.config.ts", viteConfig);
    zip.file("tailwind.config.js", tailwindConfig);
    const src = zip.folder("src");
    src.file("main.tsx", `import React from 'react'; import ReactDOM from 'react-dom/client'; import App from './App.tsx'; import './index.css'; ReactDOM.createRoot(document.getElementById('root')!).render(<App />);`);
    src.file("index.css", "@tailwind base; @tailwind components; @tailwind utilities;");
    src.folder("services").file("api.ts", API_SOURCE);
    src.folder("config").file("restaurant.ts", `export const appConfig = ${JSON.stringify(config, null, 2)}; export const getActiveConfig = () => appConfig;`);

    // Fetch local files recursively
    const files = ["App.tsx", "constants.ts", "types.ts", "components/icons.tsx", "components/cliente/ClienteApp.tsx", "context/DataContext.tsx", "context/ConfigContext.tsx"];
    for(const f of files) {
        try {
            const r = await fetch(`/${f}`);
            if(r.ok) {
                const text = await r.text();
                if(!text.startsWith('<!DOCTYPE')) {
                    const p = f.split('/');
                    let fold = src;
                    for(let i=0; i<p.length-1; i++) fold = fold.folder(p[i]);
                    fold.file(p[p.length-1], text);
                }
            }
        } catch(e) {}
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.replace(/\s/g, '_')}_source.zip`;
    a.click();
};
