import re

with open('constants.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# Tipos translations to add:
# ES
c = c.replace(
    'tipos: { ENTRANTE: "Entrantes", ENSALADA: "Ensaladas", ARROZ: "Arroces", MARISCO: "Mariscos", PESCADO: "Pescados", CARNE: "Carnes", POSTRE: "Postres" },',
    'tipos: { ENTRANTE: "Entrantes", ENSALADA: "Ensaladas", ARROZ: "Arroces", MARISCO: "Mariscos", PESCADO: "Pescados", CARNE: "Carnes", POSTRE: "Postres", PRODUCTO: "Producto", "PARA PICAR": "Para Picar", "DEL MAR": "Del Mar", "DE LA TIERRA": "De la Tierra", ARROCES: "Arroces", HAMBURGUESAS: "Hamburguesas", PIZZAS: "Pizzas" },'
)

# EU
c = c.replace(
    'tipos: { ENTRANTE: "Hasierakoak", ENSALADA: "Entsaladak", ARROZ: "Arrozak", MARISCO: "Itsaskiak", PESCADO: "Arrainak", CARNE: "Haragiak", POSTRE: "Postreak" },',
    'tipos: { ENTRANTE: "Hasierakoak", ENSALADA: "Entsaladak", ARROZ: "Arrozak", MARISCO: "Itsaskiak", PESCADO: "Arrainak", CARNE: "Haragiak", POSTRE: "Postreak", PRODUCTO: "Produktua", "PARA PICAR": "Pikatzeko", "DEL MAR": "Itsasokoak", "DE LA TIERRA": "Lurrekoak", ARROCES: "Arrozak", HAMBURGUESAS: "Hanburgesak", PIZZAS: "Pizzak" },'
)

# EN
c = c.replace(
    'tipos: { ENTRANTE: "Starters", ENSALADA: "Salads", ARROZ: "Rice", MARISCO: "Seafood", PESCADO: "Fish", CARNE: "Meats", POSTRE: "Desserts" },',
    'tipos: { ENTRANTE: "Starters", ENSALADA: "Salads", ARROZ: "Rice", MARISCO: "Seafood", PESCADO: "Fish", CARNE: "Meats", POSTRE: "Desserts", PRODUCTO: "Snacks", "PARA PICAR": "To Share", "DEL MAR": "From the sea", "DE LA TIERRA": "From the land", ARROCES: "Rice dishes", HAMBURGUESAS: "Hamburgers", PIZZAS: "Pizzas" },'
)

# FR
c = c.replace(
    'tipos: { ENTRANTE: "Entrées", ENSALADA: "Salades", ARROZ: "Riz", MARISCO: "Fruits de mer", PESCADO: "Poissons", CARNE: "Viandes", POSTRE: "Desserts" },',
    'tipos: { ENTRANTE: "Entrées", ENSALADA: "Salades", ARROZ: "Riz", MARISCO: "Fruits de mer", PESCADO: "Poissons", CARNE: "Viandes", POSTRE: "Desserts", PRODUCTO: "À grignoter", "PARA PICAR": "Pour picorer", "DEL MAR": "De la mer", "DE LA TIERRA": "De la terre", ARROCES: "Plats de riz", HAMBURGUESAS: "Hamburgers", PIZZAS: "Pizzas" },'
)

# DE
c = c.replace(
    'tipos: { ENTRANTE: "Vorspeisen", ENSALADA: "Salate", ARROZ: "Reis", MARISCO: "Meeresfrüchte", PESCADO: "Fisch", CARNE: "Fleisch", POSTRE: "Desserts" },',
    'tipos: { ENTRANTE: "Vorspeisen", ENSALADA: "Salate", ARROZ: "Reis", MARISCO: "Meeresfrüchte", PESCADO: "Fisch", CARNE: "Fleisch", POSTRE: "Desserts", PRODUCTO: "Produkt", "PARA PICAR": "Für den kleinen Hunger", "DEL MAR": "Aus dem Meer", "DE LA TIERRA": "Vom Land", ARROCES: "Reisgerichte", HAMBURGUESAS: "Hamburger", PIZZAS: "Pizzas" },'
)

# IT
c = c.replace(
    'tipos: { ENTRANTE: "Antipasti", ENSALADA: "Insalate", ARROZ: "Riso", MARISCO: "Frutti di mare", PESCADO: "Pesce", CARNE: "Carne", POSTRE: "Dolci" },',
    'tipos: { ENTRANTE: "Antipasti", ENSALADA: "Insalate", ARROZ: "Riso", MARISCO: "Frutti di mare", PESCADO: "Pesce", CARNE: "Carne", POSTRE: "Dolci", PRODUCTO: "Prodotto", "PARA PICAR": "Stuzzichini", "DEL MAR": "Dal mare", "DE LA TIERRA": "Dalla terra", ARROCES: "Piatti di riso", HAMBURGUESAS: "Hamburger", PIZZAS: "Pizze" },'
)


with open('constants.ts', 'w', encoding='utf-8') as f:
    f.write(c)

