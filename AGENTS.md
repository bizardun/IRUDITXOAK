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
