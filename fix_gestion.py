import re

with open('components/gestion/GestionCategoria.tsx', 'r') as f:
    content = f.read()

# Fix filter in GestionCategoria
content = content.replace(
    """            if (mode === 'carta' || mode === 'raciones') {
                return p.Categoria.includes('CARTA');
            }
            // If it's a specific category view for Kanala
            return p.Categoria.includes('CARTA') && p.Tipo === mode;""",
    """            if (mode === 'carta' || mode === 'raciones' || mode === 'ALL') {
                return p.Categoria.includes('CARTA');
            }
            // If it's a specific category view for Kanala
            return p.Categoria.includes('CARTA') && p.Tipo === mode;"""
)

with open('components/gestion/GestionCategoria.tsx', 'w') as f:
    f.write(content)

with open('components/gestion/GestionHome.tsx', 'r') as f:
    home_content = f.read()

# Fix cards in GestionHome
home_content = home_content.replace(
    """    const cards = isKanala ? [
        { id: 'ENTRANTE', label: 'Entrantes', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'ENSALADA', label: 'Ensaladas', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'ARROZ', label: 'Arroces', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'MARISCO', label: 'Mariscos', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'PESCADO', label: 'Pescados', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'CARNE', label: 'Carnes', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'POSTRE', label: 'Postres', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'qr', label: 'Descargar QR / Cartel', icon: IconQR, color: 'text-white/80 border-white/20 bg-white/5 hover:bg-white/10' },
    ] : [""",
    """    const cards = isKanala ? [
        { id: 'ALL', label: 'Gestionar Carta', icon: IconBook, color: 'text-white border-white/20 bg-white/5 hover:bg-white/10' },
        { id: 'qr', label: 'Descargar QR / Cartel', icon: IconQR, color: 'text-white/80 border-white/20 bg-white/5 hover:bg-white/10' },
    ] : ["""
)

with open('components/gestion/GestionHome.tsx', 'w') as f:
    f.write(home_content)

print("done")
