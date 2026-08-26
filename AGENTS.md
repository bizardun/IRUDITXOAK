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
