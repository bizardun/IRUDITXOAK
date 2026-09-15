import re

with open('constants.ts', 'r', encoding='utf-8') as f:
    c = f.read()

# ES
c = c.replace(
    'PRODUCTO: "Producto", "PARA PICAR": "Para Picar", "DEL MAR": "Del Mar", "DE LA TIERRA": "De la Tierra", ARROCES: "Arroces", HAMBURGUESAS: "Hamburguesas", PIZZAS: "Pizzas"',
    'PRODUCTO: "Producto", "PARA PICAR": "Para Picar", "DEL MAR": "Del Mar", "DE LA TIERRA": "De la Tierra", ARROCES: "Arroces", HAMBURGUESAS: "Hamburguesas", PIZZAS: "Pizzas", CARNES: "Carnes", PESCADOS: "Pescados", POSTRES: "Postres", "BRASA JOSPER": "Brasa Josper", GUARNICIONES: "Guarniciones", OTROS: "Otros"'
)

# EU
c = c.replace(
    'PRODUCTO: "Produktua", "PARA PICAR": "Pikatzeko", "DEL MAR": "Itsasokoak", "DE LA TIERRA": "Lurrekoak", ARROCES: "Arrozak", HAMBURGUESAS: "Hanburgesak", PIZZAS: "Pizzak"',
    'PRODUCTO: "Produktua", "PARA PICAR": "Pikatzeko", "DEL MAR": "Itsasokoak", "DE LA TIERRA": "Lurrekoak", ARROCES: "Arrozak", HAMBURGUESAS: "Hanburgesak", PIZZAS: "Pizzak", CARNES: "Okelak", PESCADOS: "Arrainak", POSTRES: "Azkenburukoak", "BRASA JOSPER": "Josper Txingarra", GUARNICIONES: "Hornigaiak", OTROS: "Beste batzuk"'
)

# EN
c = c.replace(
    'PRODUCTO: "Snacks", "PARA PICAR": "To Share", "DEL MAR": "From the sea", "DE LA TIERRA": "From the land", ARROCES: "Rice dishes", HAMBURGUESAS: "Hamburgers", PIZZAS: "Pizzas"',
    'PRODUCTO: "Snacks", "PARA PICAR": "To Share", "DEL MAR": "From the sea", "DE LA TIERRA": "From the land", ARROCES: "Rice dishes", HAMBURGUESAS: "Hamburgers", PIZZAS: "Pizzas", CARNES: "Meat", PESCADOS: "Fish", POSTRES: "Desserts", "BRASA JOSPER": "Josper Charcoal Grill", GUARNICIONES: "Sides", OTROS: "Others"'
)

# FR
c = c.replace(
    'PRODUCTO: "À grignoter", "PARA PICAR": "Pour picorer", "DEL MAR": "De la mer", "DE LA TIERRA": "De la terre", ARROCES: "Plats de riz", HAMBURGUESAS: "Hamburgers", PIZZAS: "Pizzas"',
    'PRODUCTO: "À grignoter", "PARA PICAR": "Pour picorer", "DEL MAR": "De la mer", "DE LA TIERRA": "De la terre", ARROCES: "Plats de riz", HAMBURGUESAS: "Hamburgers", PIZZAS: "Pizzas", CARNES: "Viandes", PESCADOS: "Poissons", POSTRES: "Desserts", "BRASA JOSPER": "Grillade Josper", GUARNICIONES: "Accompagnements", OTROS: "Autres"'
)

# DE
c = c.replace(
    'PRODUCTO: "Produkt", "PARA PICAR": "Für den kleinen Hunger", "DEL MAR": "Aus dem Meer", "DE LA TIERRA": "Vom Land", ARROCES: "Reisgerichte", HAMBURGUESAS: "Hamburger", PIZZAS: "Pizzas"',
    'PRODUCTO: "Produkt", "PARA PICAR": "Für den kleinen Hunger", "DEL MAR": "Aus dem Meer", "DE LA TIERRA": "Vom Land", ARROCES: "Reisgerichte", HAMBURGUESAS: "Hamburger", PIZZAS: "Pizzas", CARNES: "Fleisch", PESCADOS: "Fisch", POSTRES: "Desserts", "BRASA JOSPER": "Josper Holzkohlegrill", GUARNICIONES: "Beilagen", OTROS: "Andere"'
)

# IT
c = c.replace(
    'PRODUCTO: "Prodotto", "PARA PICAR": "Stuzzichini", "DEL MAR": "Dal mare", "DE LA TIERRA": "Dalla terra", ARROCES: "Piatti di riso", HAMBURGUESAS: "Hamburger", PIZZAS: "Pizze"',
    'PRODUCTO: "Prodotto", "PARA PICAR": "Stuzzichini", "DEL MAR": "Dal mare", "DE LA TIERRA": "Dalla terra", ARROCES: "Piatti di riso", HAMBURGUESAS: "Hamburger", PIZZAS: "Pizze", CARNES: "Carne", PESCADOS: "Pesce", POSTRES: "Dolci", "BRASA JOSPER": "Griglia Josper", GUARNICIONES: "Contorni", OTROS: "Altro"'
)

with open('constants.ts', 'w', encoding='utf-8') as f:
    f.write(c)

