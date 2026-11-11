# Plataforma Integral de Gestión de Restaurantes y Cartas Digitales (v2.0)

Plataforma SaaS multirrestaurante desarrollada con React 19, TypeScript, Vite, Tailwind CSS y Firebase Firestore, equipada con inteligencia artificial para traducción gastronómica y detección exhaustiva de alérgenos.

---

## 🚀 Novedades de la Versión 2.0 (Universal para todos los restaurantes)

1. **Normativa Europea de Alérgenos (Reglamento UE 1169/2011):**
   - Cobertura completa de los **14 alérgenos de declaración obligatoria**:
     1. Gluten (cereales y derivados)
     2. Crustáceos
     3. Huevos
     4. Pescado
     5. Cacahuetes
     6. Soja
     7. Lácteos (incluida lactosa)
     8. Frutos de cáscara (nueces, almendras, avellanas, piñones, etc.)
     9. Apio
     10. Mostaza
     11. Granos de sésamo
     12. Dióxido de azufre y sulfitos
     13. Altramuces
     14. Moluscos (calamares, pulpo, chipirones, mejillones, etc.)
   - Análisis inteligente por receta e ingredientes (detecta alérgenos ocultos como gluten en salsas de soja, frutos de cáscara en pestos, sulfitos en vinos y reducciones).

2. **Motor de Traducción Gastronómica con IA:**
   - **Gemini 3.8 Flash** con validación y grounding en tiempo real.
   - **Prioridad a Base de Conocimientos Local:** Consulta inmediata al diccionario gastronómico.
   - **Escaneo Dinámico de la Web Oficial:** Si el restaurante tiene web configurada, busca y replica las traducciones oficiales de sus cartas (`/eu/`, `/en/`, `/fr/`, etc.).
   - **Grounding con Diccionario Elhuyar para Euskera:** Validación terminológica oficial de términos culinarios vascos a través de Google Search y el Diccionario Elhuyar.
   - Traducción multilingüe completa a 6 idiomas: Español (ES), Euskera (EU), Inglés (EN), Francés (FR), Alemán (DE) e Italiano (IT).

3. **Compatibilidad Universal Multirrestaurante:**
   - Todos los restaurantes creados desde el Factory Dashboard (Kanala Beach, Boliña y futuros) heredan automáticamente el nuevo motor de alérgenos y traducciones.
   - Respeto a las directrices de diseño (botones de reordenación con flechas táctiles, selectores con marco metálico para temas oscuros, visualización de platos agotados/descartados en gris).

---

## 🛠️ Despliegue en Vercel

### Opción 1: Despliegue Automático mediante GitHub (Recomendado)
1. Sube este repositorio a tu cuenta de GitHub.
2. Inicia sesión en [Vercel](https://vercel.com).
3. Haz clic en **"Add New..."** -> **"Project"**.
4. Selecciona tu repositorio de GitHub recién subido.
5. Vercel detectará automáticamente Vite. Haz clic en **Deploy**.
6. (Opcional) En los ajustes del proyecto en Vercel (Environment Variables), añade `VITE_GEMINI_API_KEY` si deseas habilitar las llamadas de IA en tu propio dominio.

### Opción 2: Despliegue mediante Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

El archivo `vercel.json` incluido gestiona automáticamente las rutas SPA para evitar errores 404 al recargar la página.

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en puerto 3000
npm run dev

# Compilar para producción
npm run build
```
