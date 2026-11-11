# 🛡️ COPIA DE SEGURIDAD Y MANUAL MAESTRO DE LA PLATAFORMA (V1 & V2)
**Fecha:** Noviembre 2026  
**Proyecto:** Plataforma Multirrestaurante (Kanala Beach, Boliña, etc.) con Sincronización en Tiempo Real  
**Base de Datos en la Nube:** Google Cloud Firestore (`ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d`)  
**Usuario Propietario:** imamundaka@gmail.com  

---

## 📌 NOTA DE TRANQUILIDAD: NADA SE HA PERDIDO
Si has cambiado de ordenador o el equipo principal ha fallado, **todo tu proyecto sigue 100% intacto y a salvo**.
1. **El código fuente:** Se ejecuta en el entorno seguro de Google AI Studio en la nube.
2. **Las cartas, platos y restaurantes:** Están almacenados en Google Cloud Firestore. No dependen del disco duro de tu ordenador anterior.
3. **Esta carpeta de copia de seguridad:** Contiene todo el código, las reglas y los archivos empaquetados en `.zip` y `.tar.gz` para que puedas descargarlos y guardarlos en un pendrive o en tu nuevo ordenador cuando quieras.

---

## 🚀 COMPARATIVA: VERSIÓN 1 vs VERSIÓN 2

### 🔹 Versión 1.0 (Arquitectura Inicial)
- Aplicación de gestión y cliente para cartas digitales de restaurantes.
- Creador de nuevos restaurantes (Factory Dashboard) con plantillas y estilos.
- Detección básica de alérgenos por palabras clave.
- Traducciones generales de platos.
- Generación de códigos QR para mesas.

### 🔹 Versión 2.0 (Versión Actual Mejorada y Blindada)
1. **Los 14 Alérgenos Oficiales del Reglamento Europeo (UE 1169/2011):**
   - Estandarización de los 14 alérgenos de declaración obligatoria: Gluten, Crustáceos, Huevos, Pescado, Cacahuetes, Soja, Lácteos, Frutos de Cáscara, Apio, Mostaza, Sésamo, Sulfitos, Altramuces y Moluscos (además de compatibilidad con Marisco y Calamares).
2. **Visualización de Platos Descartados por Alérgenos:**
   - En la app cliente, cuando un comensal selecciona que es alérgico a un ingrediente, los platos afectados **no desaparecen bruscamente** de la pantalla: se muestran atenuados en escala de grises (`opacity-40 grayscale`). De este modo, el cliente sabe que el restaurante ofrece ese plato pero es consciente de que contiene su alérgeno.
3. **Pipeline Inteligente de Traducciones (Triple Capa):**
   - **Capa 1 (Diccionario Local Oficial):** Consulta primero diccionarios estructurados oficiales (como `src/data/kanala_dictionary.json`). Si el término está, se inyecta exactamente la traducción oficial sin inventar nada.
   - **Capa 2 (Web Oficial del Restaurante):** Si el plato no está en el diccionario, se consulta la página web oficial configurada para el restaurante en las rutas de idioma (`/eu/`, `/en/`, `/fr/`).
   - **Capa 3 (Garantía de Euskera con Elhuyar):** En euskera, las traducciones se contrastan y fundamentan con el Diccionario Elhuyar oficial (Euskadi.eus).
4. **Diseño de Banderas con Borde Metálico:**
   - En restaurantes de tema oscuro (como Kanala Beach), las banderas de selección de idioma tienen un acabado metálico biselado con degradado (`linear-gradient(135deg, #64748b 0%, #ffffff 50%, #64748b 100%)`), halo de luz al estar activas y atenuación cuidada al estar inactivas.
5. **Reordenación Táctil Móvil Blindada (Prohibido Drag & Drop):**
   - Reemplazo total de sistemas de arrastrar y soltar por botones de flechas Subir/Bajar, evitando conflictos de scroll en teléfonos móviles de camareros y clientes.
6. **Frase Oficial del Cartel QR:**
   - Impresión de cartelería con la frase universal estandarizada: *"Para ver nuestra oferta gastronómica actualizada a día de hoy."*
7. **Logotipos Oficiales y Enlace a la Web:**
   - Logos gráficos reales (sin iniciales genéricas) y enlace en el footer del cliente hacia la web oficial.

---

## 🥗 CATÁLOGO OFICIAL DE LOS 14 ALÉRGENOS (REGLAMENTO UE)

| Clave Interna | Español | Euskera | English | Français | Deutsch | Italiano | Color Distintivo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GLUTEN` | Gluten | Glotena | Gluten | Gluten | Gluten | Glutine | Amarillo ámbar (`bg-amber-500`) |
| `CRUSTACEOS` | Crustáceos | Krustazeoak | Crustaceans | Crustacés | Krebstiere | Crostacei | Rojo carmesí (`bg-red-500`) |
| `HUEVOS` | Huevos | Arrautzak | Eggs | Œufs | Eier | Uova | Amarillo brillante (`bg-yellow-400`) |
| `PESCADO` | Pescado | Arraina | Fish | Poisson | Fisch | Pesce | Azul océano (`bg-blue-500`) |
| `CACAHUETES` | Cacahuetes | Kakahueteak | Peanuts | Arachides | Erdnüsse | Arachidi | Naranja intenso (`bg-orange-600`) |
| `SOJA` | Soja | Soja | Soybeans | Soja | Soja | Soia | Verde oliva (`bg-lime-600`) |
| `LACTEOS` | Lácteos | Esnekiak | Milk | Lait | Milch | Latte | Azul celeste (`bg-sky-400`) |
| `FRUTOS_CASCARA`| Frutos de cáscara |果 / Intxaurrak | Tree nuts | Fruits à coque | Schalenfrüchte | Frutta a guscio | Marrón avellana (`bg-amber-700`) |
| `APIO` | Apio | Apioa | Celery | Céleri | Sellerie | Sedano | Verde esmeralda (`bg-emerald-500`) |
| `MOSTAZA` | Mostaza | Mostaza | Mustard | Moutarde | Senf | Senape | Amarillo mostaza (`bg-yellow-600`) |
| `SESAMO` | Sésamo | Sesamoa | Sesame | Sésame | Sesam | Sesamo | Canela cálido (`bg-amber-600`) |
| `SULFITOS` | Sulfitos | Sulfitoak | Sulphites | Sulfites | Sulfite | Solfiti | Púrpura vino (`bg-purple-500`) |
| `ALTRAMUCES` | Altramuces | Zuzonak / Lupinoak | Lupin | Lupin | Lupinen | Lupini | Índigo suave (`bg-indigo-400`) |
| `MOLUSCOS` | Moluscos | Moluskuak | Molluscs | Mollusques | Weichtiere | Molluschi | Cian profundo (`bg-cyan-600`) |

---

## 📂 ESTRUCTURA DE ARCHIVOS CLAVE DEL PROYECTO

```
├── AGENTS.md                  -> Reglas persistentes del proyecto (Banderas, QR, Drag&Drop, Traducciones, Logos)
├── components/
│   ├── cliente/               -> Vista del cliente comensal (Banderas metálicas, filtros de alérgenos atenuados)
│   │   ├── ClienteApp.tsx
│   │   ├── ClienteHeader.tsx
│   │   └── PlatoCard.tsx
│   ├── gestion/               -> Panel de administración del restaurante
│   │   ├── GestionCategoria.tsx (Reordenación táctil Subir/Bajar)
│   │   ├── AddPlatoModal.tsx    (Detección IA de 14 alérgenos con Gemini)
│   │   ├── GestionQR.tsx        (Cartelería con frase oficial)
│   │   └── GestionLayout.tsx
│   ├── factory/               -> Panel Maestro Multirrestaurante (Factory Dashboard)
│   │   └── FactoryDashboard.tsx (Creación, contraseñas, web oficial, copias de seguridad)
│   └── icons.tsx              -> Iconos SVG de alérgenos y elementos UI
├── config/
│   └── restaurant.ts          -> Configuración inicial y temas (Kanala, Boliña, etc.)
├── constants.ts               -> Nombres y traducciones oficiales de alérgenos en 6 idiomas
├── services/
│   ├── api.ts                 -> Servicio IA con Gemini (analizador de alérgenos y traducciones)
│   ├── firebase.ts            -> Conexión a Google Firestore en tiempo real
│   └── zipService.ts          -> Generador de paquetes de código
├── src/
│   └── data/
│       └── kanala_dictionary.json -> Diccionario oficial euskera/español de Kanala Beach
├── public/
│   └── copia_seguridad/       -> Archivos ZIP y TAR.GZ descargables con un clic
```

---

## 📥 CÓMO DESCARGAR TU COPIA DE SEGURIDAD
En tu nuevo ordenador, puedes obtener la copia de dos formas:

1. **Desde la aplicación web:**
   - En el panel de gestión o en el Factory Dashboard, haz clic en el botón verde **"💾 Descargar Copia Completa (ZIP)"**.
2. **Descarga directa por enlace:**
   - Abre en tu navegador la dirección web de tu app añadiendo `/copia_seguridad/copia_completa_v1_v2.zip` (o `.tar.gz`).
3. **Restauración local:**
   - Descomprime el archivo `.zip`.
   - Ejecuta `npm install` y luego `npm run dev` para tener la aplicación corriendo en local en `http://localhost:3000`.
