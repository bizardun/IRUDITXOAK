# Directrices Persistentes del Proyecto (Gestión de Restaurantes)

A continuación, se detallan las reglas y preferencias de diseño establecidas por el usuario que deben aplicarse a todas las nuevas características, aplicaciones o restaurantes que se integren en esta plataforma:

## Diseño de la Aplicación Cliente (Vista Pública)
1. **Selector de Idiomas (Banderas):** Los iconos/banderas utilizados para seleccionar el idioma **SIEMPRE** deben llevar un diseño premium con borde metálico. No deben ser planos. 
   - **Estilo exacto a replicar:** Marco gris metálico creado mediante un degradado en diagonal (`linear-gradient(135deg, #64748b 0%, #ffffff 50%, #64748b 100%)`) y un `padding` de `1.5px` sobre un botón con `borderRadius: '8px'`.
   - **Estado Inactivo:** La bandera (interior) debe atenuarse (`opacity-40`), pero con un fondo detrás de ella que coincida con el tema de la app (`bg-black` para temas oscuros, `bg-white` para temas claros) para oscurecerla sin que el degradado metálico se transparente, y SIN emitir halo de luz.
   - **Estado Activo:** La bandera elegida debe recuperar su opacidad completa (`opacity-100`), aumentar ligeramente su tamaño (`scale-110`) y emitir un fino halo blanco (`box-shadow: 0 0 12px rgba(255, 255, 255, 0.8)`).
   - **Exclusividad para Temas Oscuros (Kanala):** Este diseño metálico SOLO debe aplicarse a restaurantes con temas oscuros o premium (como Kanala). Para restaurantes de tema claro (como Boliña), se deben mantener los bordes de color del tema original del restaurante sin efecto metálico.

## Código QR y Material Promocional
1. **Frase del cartel QR:** Al generar cartelería para que los clientes escaneen y accedan al menú, la frase descriptiva predeterminada debajo del código QR debe ser SIEMPRE: *"Para ver nuestra oferta gastronómica actualizada a día de hoy."* (Universal para todos los restaurantes).

## Interfaz de Gestión y Administración
1. **Reordenamiento de Elementos (Prohibido Drag & Drop):** Para permitir al usuario reordenar listas de elementos (como la posición de los platos en una carta), **SIEMPRE** se deben utilizar botones explícitos con flechas (Subir/Bajar). Queda **estrictamente prohibido** utilizar sistemas de arrastrar y soltar (drag & drop, `draggable`, `onDragStart`), ya que generan conflictos de scroll en dispositivos táctiles móviles. El reordenamiento debe ser mediante toques directos (clicks) que actualicen la posición de la base de datos de forma predecible.

## Enlace a la Web Oficial (Transversal)
1. **Configuración de Web Oficial:** En el panel maestro de gestión de aplicaciones (Factory Dashboard), junto a los botones de "Contraseña" y "QR", **SIEMPRE** se debe mantener el botón/modal para configurar la "Web Oficial" de cada restaurante.
2. **Visualización en Cliente:** En la aplicación cliente (la que ve el usuario final), **SIEMPRE** se debe mostrar un enlace a la web oficial en el pie de página (footer) si esta ha sido configurada en el panel maestro, respetando la estética del tema actual.

## Traducciones de Platos (IA)
1. **Uso de Base de Conocimientos Local y Universal:** Esta regla aplica de forma CONSTANTE para todas las apps que se creen a partir de ahora (Kanala Beach, Boliña, etc.). Si existe un diccionario estructurado estático (como `src/data/kanala_dictionary.json` u otros equivalentes creados para cada app) o si el usuario proporciona un menú oficial, la IA **SIEMPRE** debe consultar internamente esa base de conocimientos primero. Si el plato o término existe, la traducción o dato se inyecta directamente respetando el origen sin inventar, deducir ni alterar NADA.
2. **Respetar Traducciones Oficiales (No Inventar Nada):** Para otros restaurantes, o si el plato no está en el diccionario local de Kanala, la IA **SIEMPRE** debe verificar de forma dinámica la página web oficial del restaurante (configurada en `officialWebsite`). Si la web es multilingüe, la IA debe buscar las traducciones exactas en las rutas correspondientes del idioma (ej. `/eu/`, `/en/`, `/fr/`).
3. **Uso de Elhuyar para Euskera:** Solo en el caso en el que la web no disponga de traducción al euskera (o sea un plato nuevo que tampoco esté en el diccionario local), la IA debe generar una traducción usando Google Search para contrastarla con el Diccionario Elhuyar (https://www.euskadi.eus/diccionario-elhuyar/).

## Logotipos de Restaurantes (Factory Dashboard / UI)
1. **Uso de Logos Oficiales:** En el panel maestro (Factory Dashboard) y en las vistas de los restaurantes, **SIEMPRE** se deben utilizar los logotipos de los restaurantes (imágenes o recursos gráficos) en lugar de iniciales genéricas de texto (ej. prohibido usar la inicial "B" para Boliña o "K" para Kanala). Para todas las futuras apps que se creen o integren, se debe mantener esta lógica condicional, cargando la imagen correspondiente al nuevo restaurante y ajustando sus fondos para garantizar una correcta legibilidad (por ejemplo, fondo oscuro si el logotipo es blanco como en Kanala, o fondo claro si el logotipo lo requiere como en Boliña).

## Lista de Intocables y Protocolo de Verificación Obligatoria
Para evitar regresiones y garantizar que cada modificación afecte **exclusivamente** a lo solicitado por el usuario, los siguientes elementos quedan **bloqueados como INTOCABLES** (prohibido alterarlos, eliminarlos o refactorizarlos salvo orden expresa):
1. **URLs y rutas de acceso:** Mantener intactos los enlaces `/#/?app=<id>&client=true` (Carta Cliente) y `/#/?app=<id>&admin=true` (Acceso Propietario / Gestión) tanto en `App.tsx`, `GestionQR.tsx` como en `FactoryDashboard.tsx`. Nunca cambiar la estructura de URLs fijas.
2. **Logos oficiales:** Mantener el archivo `/public/logo-bolina.jpg` y su renderizado en Cliente (`ClienteApp.tsx`), Acceso Propietario (`GestionLogin.tsx`), Panel de Gestión (`GestionHome.tsx`), Cartel QR (`GestionQR.tsx`) y Panel Maestro (`FactoryDashboard.tsx`), así como el logotipo oficial blanco de Kanala Beach.
3. **Contraseña de Propietario:** Mantener el acceso protegido mediante `GestionLogin` en `GestionApp.tsx` siempre que se entre desde URL directa o QR de propietario (`!showMasterPanelButton`), y el botón **Contraseña** en `FactoryDashboard.tsx` sincronizado con Firestore (`updateAppById`).
4. **Alérgenos en platos:** Mantener la visualización y el filtrado de los 14 alérgenos europeos (`p.Alergenos`, `allergensToDisplay`) en `ClienteApp.tsx`.
5. **Traducciones completas (EU, EN, FR, DE, IT):** Mantener el esquema obligatorio de los 5 idiomas (`required: ["EU", "EN", "FR", "DE", "IT"]`), el diccionario local de Kanala (`src/data/kanala_dictionary.json`) y el fallback por idioma en `services/api.ts` para que nunca queden traducciones vacías o defectuosas.
6. **Cartel QR, Web Oficial y Botones Subir/Bajar:** Mantener intacta la frase oficial del cartel QR, el botón/enlace de Web Oficial y la ausencia total de Drag & Drop (`draggable`/`onDragStart`).
7. **Verificación obligatoria tras cualquier cambio:** Antes de dar por terminada cualquier tarea que modifique código o datos, ejecutar **SIEMPRE** `npm run verify` (`node scripts/verify_integrity.mjs`) y comprobar que todos los controles pasan en verde (`OK`). Informar brevemente al usuario qué se modificó y confirmar que los intocables pasaron la verificación.

