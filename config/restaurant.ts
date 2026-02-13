
import { Plato, TipoPlato, RestaurantConfig, Alergeno } from '../types';

// Helper para crear platos rápidamente y mantener el archivo legible
const createPlato = (
    id: number, 
    precio: number, 
    tipo: TipoPlato, 
    es: string, 
    eu: string, 
    en: string, 
    fr: string, 
    it: string, 
    de: string, 
    esRacion: boolean = false,
    alergenos: Alergeno[] = []
): Plato => {
    return {
        ID_Plato: id,
        Precio: precio,
        ES_Nombre: es,
        EU_Nombre: eu,
        EN_Nombre: en,
        FR_Nombre: fr,
        IT_Nombre: it,
        DE_Nombre: de,
        Categoria: "CARTA",
        Tipo: tipo,
        Activo_Dia: true, // Por defecto activos
        Rol_Menu: null,
        Es_Racion: esRacion, // Forzamos si es ración o no desde el helper
        Alergenos: alergenos
    };
};

// Datos Originales de Boliña el Viejo (Master Template)
export const bolinaConfig: RestaurantConfig = {
    id: 'bolina_viejo_v1',
    name: 'Boliña el Viejo',
    slogan: '',
    theme: {
        font: 'font-lora',
        style: 'classic'
    },
    initialPlatos: [
        // --- ENTRANTES Y RACIONES (1-30) ---
        createPlato(1, 22.00, "ENTRANTE", "Jamón Ibérico de Bellota", "Urdaiazpiko iberikoa", "Acorn-fed Iberian Ham", "Jambon ibérique", "Prosciutto iberico", "Iberischer Schinken", true),
        createPlato(2, 14.00, "ENTRANTE", "Lomo Ibérico de Bellota", "Solomo iberikoa", "Iberian Pork Loin", "Longe de porc ibérique", "Lombo iberico", "Iberische Lende", true),
        createPlato(3, 10.00, "ENTRANTE", "Chorizo Ibérico", "Txorizo iberikoa", "Iberian Chorizo", "Chorizo ibérique", "Chorizo iberico", "Iberische Chorizo", true),
        createPlato(4, 9.50, "ENTRANTE", "Salchichón Ibérico", "Saltxitxoi iberikoa", "Iberian Salchichon", "Saucisson ibérique", "Salame iberico", "Iberische Salami", true),
        createPlato(5, 12.00, "ENTRANTE", "Tabla de Ibéricos", "Iberikoen taula", "Iberian Cured Meat Platter", "Assiette de charcuterie", "Piatto di salumi", "Iberische Wurstplatte", true),
        createPlato(6, 14.50, "ENTRANTE", "Queso Manchego Curado", "Mantxako gazta ondua", "Cured Manchego Cheese", "Fromage Manchego affiné", "Formaggio Manchego", "Gereifter Manchego-Käse", true, ["LACTEOS"]),
        createPlato(7, 8.50, "ENTRANTE", "Queso del País (Idiazabal)", "Idiazabal gazta", "Idiazabal Cheese", "Fromage Idiazabal", "Formaggio Idiazabal", "Idiazabal-Käse", true, ["LACTEOS"]),
        createPlato(8, 12.00, "ENTRANTE", "Croquetas de Jamón (10 ud)", "Urdaiazpiko kroketak", "Ham Croquettes", "Croquettes de jambon", "Crocchette di prosciutto", "Schinkenkroketten", true, ["GLUTEN", "LACTEOS", "HUEVOS"]),
        createPlato(9, 12.00, "ENTRANTE", "Croquetas de Bacalao (10 ud)", "Bakailao kroketak", "Cod Croquettes", "Croquettes de morue", "Crocchette di baccalà", "Kabeljau-Kroketten", true, ["GLUTEN", "LACTEOS", "HUEVOS", "PESCADO"]),
        createPlato(10, 12.00, "ENTRANTE", "Croquetas de Setas (10 ud)", "Onddo kroketak", "Mushroom Croquettes", "Croquettes aux champignons", "Crocchette di funghi", "Pilzkroketten", true, ["GLUTEN", "LACTEOS", "HUEVOS"]),
        createPlato(11, 9.50, "ENTRANTE", "Pimientos de Padrón", "Padrón piperrak", "Padrón Peppers", "Poivrons de Padrón", "Peperoni Padrón", "Padrón-Paprika", true),
        createPlato(12, 10.50, "ENTRANTE", "Pimientos Rojos Asados", "Piper gorriak", "Roasted Red Peppers", "Poivrons rouges rôtis", "Peperoni rossi arrostiti", "Geröstete rote Paprika", true),
        createPlato(13, 8.00, "ENTRANTE", "Patatas Bravas / Ali-Oli", "Patata minak", "Spicy Potatoes", "Pommes de terre bravas", "Patate piccanti", "Pikante Kartoffeln", true, ["HUEVOS"]),
        createPlato(14, 11.00, "ENTRANTE", "Chorizo a la Sidra", "Txorizoa sagardotan", "Chorizo in Cider", "Chorizo au cidre", "Chorizo al sidro", "Chorizo in Apfelwein", true, ["SULFITOS"]),
        createPlato(15, 10.50, "ENTRANTE", "Morcilla de Burgos", "Burgosko odolkiak", "Black Pudding", "Boudin noir", "Sanguinaccio", "Blutwurst", true),
        createPlato(16, 9.50, "ENTRANTE", "Tortilla de Patata (entera)", "Patata tortila", "Spanish Omelette", "Omelette espagnole", "Frittata di patate", "Spanisches Omelett", true, ["HUEVOS"]),
        createPlato(17, 10.50, "ENTRANTE", "Tortilla de Chorizo", "Txorizo tortila", "Chorizo Omelette", "Omelette au chorizo", "Frittata al chorizo", "Chorizo-Omelett", true, ["HUEVOS"]),
        createPlato(18, 14.00, "ENTRANTE", "Calamares a la Romana", "Kalamarrak erromatar eran", "Fried Squid Rings", "Calamars frits", "Calamari fritti", "Frittierte Tintenfischringe", true, ["GLUTEN", "HUEVOS", "MOLUSCOS"]),
        createPlato(19, 15.50, "ENTRANTE", "Rabas de Calamar Fresco", "Txipiroi rabak", "Fresh Squid Strips", "Lanières de calamar frais", "Strisce di calamaro", "Frische Tintenfischstreifen", true, ["GLUTEN", "MOLUSCOS"]),
        createPlato(20, 16.00, "ENTRANTE", "Chopitos Fritos", "Txopitoak", "Fried Baby Squid", "Bébés calamars frits", "Calamaretti fritti", "Frittierte kleine Tintenfische", true, ["GLUTEN", "MOLUSCOS"]),
        createPlato(21, 11.00, "ENTRANTE", "Mejillones Tigre (Picantes)", "Tigre muskuiluak", "Spicy Stuffed Mussels", "Moules farcies piquantes", "Cozze ripiene piccanti", "Scharf gefüllte Muscheln", true, ["GLUTEN", "MOLUSCOS", "HUEVOS"]),
        createPlato(22, 10.00, "ENTRANTE", "Mejillones al Vapor", "Muskuiluak lurrunetan", "Steamed Mussels", "Moules à la vapeur", "Cozze al vapore", "Gedämpfte Muscheln", true, ["MOLUSCOS"]),
        createPlato(23, 12.50, "ENTRANTE", "Mejillones en Salsa", "Muskuiluak saltsan", "Mussels in Sauce", "Moules en sauce", "Cozze in salsa", "Muscheln in Soße", true, ["MOLUSCOS", "GLUTEN"]),
        createPlato(24, 16.00, "ENTRANTE", "Gambas al Ajillo", "Ganbak ajillo", "Garlic Prawns", "Crevettes à l'ail", "Gamberi all'aglio", "Knoblauchgarnelen", true, ["CRUSTACEOS"]),
        createPlato(25, 18.00, "ENTRANTE", "Gambas a la Plancha", "Ganbak plantxan", "Grilled Prawns", "Crevettes grillées", "Gamberi alla griglia", "Gegrillter Garnelen", true, ["CRUSTACEOS"]),
        createPlato(26, 24.00, "ENTRANTE", "Pulpo a la Gallega", "Olagarroa galiziar eran", "Galician Style Octopus", "Poulpe à la galicienne", "Polpo alla galiziana", "Oktopus nach galizischer Art", true, ["MOLUSCOS"]),
        createPlato(27, 26.00, "ENTRANTE", "Pulpo a la Brasa", "Olagarroa parrillan", "Grilled Octopus", "Poulpe grillé", "Polpo alla brace", "Gegrillter Oktopus", true, ["MOLUSCOS"]),
        createPlato(28, 14.00, "ENTRANTE", "Revuelto de Setas y Gambas", "Perretxiko eta ganba nahaskia", "Scrambled Eggs w/ Mushrooms", "Brouillade champignons/crevettes", "Uova strapazzate funghi/gamberi", "Rührei mit Pilzen/Garnelen", true, ["HUEVOS", "CRUSTACEOS"]),
        createPlato(29, 13.00, "ENTRANTE", "Revuelto de Ajetes", "Baratxuri fresko nahaskia", "Scrambled Eggs w/ Garlic Shoots", "Brouillade d'ail tendre", "Uova strapazzate all'aglio", "Rührei mit jungem Knoblauch", true, ["HUEVOS"]),
        createPlato(30, 15.00, "ENTRANTE", "Espárragos de Navarra (6ud)", "Nafarroako zainzuriak", "Navarra Asparagus", "Asperges de Navarre", "Asparagi di Navarra", "Spargel aus Navarra", true),

        // --- ENSALADAS (31-40) ---
        createPlato(31, 8.50, "ENSALADA", "Ensalada Simple", "Entsalada arrunta", "Simple Salad", "Salade simple", "Insalata semplice", "Einfacher Salat", true),
        createPlato(32, 11.50, "ENSALADA", "Ensalada Mixta Completa", "Entsalada mistoa", "Mixed Salad", "Salade mixte", "Insalata mista", "Gemischter Salat", true, ["HUEVOS", "PESCADO"]),
        createPlato(33, 14.50, "ENSALADA", "Ensalada de Ventresca", "Hegaluze-mendrezka entsalada", "Tuna Belly Salad", "Salade de ventrèche", "Insalata di ventresca", "Thunfischbauchsalat", true, ["PESCADO"]),
        createPlato(34, 13.50, "ENSALADA", "Ensalada de Queso de Cabra", "Ahuntz-gazta entsalada", "Goat Cheese Salad", "Salade de chèvre", "Insalata di formaggio di capra", "Ziegenkäsesalat", true, ["LACTEOS"]),
        createPlato(35, 12.00, "ENSALADA", "Ensalada César", "Zesar entsalada", "Caesar Salad", "Salade César", "Insalata Caesar", "Caesar-Salat", true, ["GLUTEN", "LACTEOS", "PESCADO", "MOSTAZA"]),
        createPlato(36, 12.50, "ENSALADA", "Ensalada de Tomate y Bonito", "Tomate eta hegaluze entsalada", "Tomato & Tuna Salad", "Salade de tomates et thon", "Insalata di pomodoro e tonno", "Tomaten-Thunfisch-Salat", true, ["PESCADO"]),
        createPlato(37, 15.00, "ENSALADA", "Ensalada Templada de Gulas", "Gula entsalada epela", "Warm Eel Salad", "Salade tiède d'anguilles", "Insalata tiepida di anguille", "Warmer Aal-Salat", true, ["PESCADO", "CRUSTACEOS"]),
        createPlato(38, 16.00, "ENSALADA", "Ensalada de Marisco", "Itsaski entsalada", "Seafood Salad", "Salade de fruits de mer", "Insalata di mare", "Meeresfrüchtesalat", true, ["CRUSTACEOS", "MOLUSCOS", "PESCADO"]),

        // --- SOPAS Y CUCHARA (41-50) ---
        createPlato(41, 12.00, "ENTRANTE", "Sopa de Pescado Donostiarra", "Donostiar arrain zopa", "Donostia Style Fish Soup", "Soupe de poisson", "Zuppa di pesce", "Fischsuppe", false, ["PESCADO", "CRUSTACEOS", "MOLUSCOS"]),
        createPlato(42, 8.00, "ENTRANTE", "Sopa de Cocido", "Eltzekari zopa", "Stew Soup", "Soupe de pot-au-feu", "Zuppa di stufato", "Eintopfsuppe", false, ["GLUTEN"]),
        createPlato(43, 7.50, "ENTRANTE", "Consomé al Jerez", "Salda", "Consommé with Sherry", "Consommé au Xérès", "Consommé allo Sherry", "Consommé mit Sherry", false, ["SULFITOS"]),
        createPlato(44, 9.50, "ENTRANTE", "Crema de Verduras", "Barazki krema", "Vegetable Cream Soup", "Velouté de légumes", "Crema di verdure", "Gemüsecremesuppe", false),
        createPlato(45, 14.00, "ENTRANTE", "Alubias de Tolosa (con Sacr.)", "Tolosako babarrunak", "Tolosa Beans w/ Sides", "Haricots de Tolosa", "Fagioli di Tolosa", "Bohnen aus Tolosa", false),
        createPlato(46, 11.00, "ENTRANTE", "Lentejas Estofadas", "Dilistak", "Stewed Lentils", "Lentilles étuvées", "Lenticchie stufate", "Geschmorte Linsen", false, ["GLUTEN"]),
        createPlato(47, 12.00, "ENTRANTE", "Marmitako de Bonito", "Marmitakoa", "Tuna Pot Stew", "Marmitako de thon", "Marmitako di tonno", "Thunfisch-Marmitako", false, ["PESCADO"]),

        // --- ARROCES Y PASTA (51-60) ---
        createPlato(51, 16.00, "ARROZ", "Paella de Marisco (min 2)", "Itsaski-paella", "Seafood Paella", "Paella aux fruits de mer", "Paella di frutti di mare", "Meeresfrüchte-Paella", true, ["CRUSTACEOS", "MOLUSCOS", "PESCADO"]),
        createPlato(52, 14.50, "ARROZ", "Paella Mixta (min 2)", "Paella mistoa", "Mixed Paella", "Paella mixte", "Paella mista", "Gemischte Paella", true, ["CRUSTACEOS", "MOLUSCOS", "PESCADO"]),
        createPlato(53, 15.00, "ARROZ", "Arroz Negro con Chipirones", "Arroz beltza", "Black Rice w/ Squid", "Riz noir aux calamars", "Riso al nero di seppia", "Schwarzer Reis", true, ["MOLUSCOS", "PESCADO"]),
        createPlato(54, 13.00, "ARROZ", "Arroz a la Cubana", "Arroza kubatar eran", "Cuban Style Rice", "Riz à la cubaine", "Riso alla cubana", "Reis nach kubanischer Art", false, ["HUEVOS"]),
        createPlato(55, 12.00, "ARROZ", "Espaguetis Boloñesa", "Espagetiak boloniar eran", "Spaghetti Bolognese", "Spaghettis bolognaise", "Spaghetti alla bolognese", "Spaghetti Bolognese", false, ["GLUTEN"]),
        createPlato(56, 12.50, "ARROZ", "Espaguetis Carbonara", "Espagetiak karbonara", "Spaghetti Carbonara", "Spaghettis carbonara", "Spaghetti alla carbonara", "Spaghetti Carbonara", false, ["GLUTEN", "LACTEOS", "HUEVOS"]),
        createPlato(57, 11.00, "ARROZ", "Macarrones con Tomate", "Makarroiak tomatearekin", "Macaroni w/ Tomato", "Macaronis à la tomate", "Maccheroni al pomodoro", "Makkaroni mit Tomate", false, ["GLUTEN"]),
        createPlato(58, 14.00, "ARROZ", "Lasaña de Carne Casera", "Haragi-lasaña", "Homemade Meat Lasagna", "Lasagnes à la viande", "Lasagne di carne", "Fleischlasagne", false, ["GLUTEN", "LACTEOS", "HUEVOS"]),

        // --- PESCADOS (61-80) ---
        createPlato(61, 22.00, "PESCADO", "Merluza a la Vasca", "Legatza saltsa berdean", "Hake Basque Style", "Merlu à la basque", "Nasello alla basca", "Seehecht baskische Art", false, ["PESCADO", "GLUTEN"]),
        createPlato(62, 21.00, "PESCADO", "Merluza a la Romana", "Legatza erromatar eran", "Fried Hake", "Merlu à la romaine", "Nasello alla romana", "Frittierter Seehecht", false, ["PESCADO", "GLUTEN", "HUEVOS"]),
        createPlato(63, 20.00, "PESCADO", "Merluza a la Plancha", "Legatza plantxan", "Grilled Hake", "Merlu à la plancha", "Nasello alla griglia", "Gegrillter Seehecht", false, ["PESCADO"]),
        createPlato(64, 23.00, "PESCADO", "Merluza Ondarresa", "Legatza ondarresa", "Ondarresa Style Hake", "Merlu Ondarresa", "Nasello Ondarresa", "Seehecht Ondarresa", false, ["PESCADO"]),
        createPlato(65, 24.00, "PESCADO", "Bacalao al Pil-Pil", "Bakailaoa pil-pilean", "Cod Pil-Pil Style", "Morue au Pil-Pil", "Baccalà al Pil-Pil", "Kabeljau Pil-Pil", false, ["PESCADO"]),
        createPlato(66, 23.50, "PESCADO", "Bacalao a la Vizcaína", "Bakailaoa bizkaitar eran", "Cod Biscay Style", "Morue à la biscayenne", "Baccalà alla biscaglina", "Kabeljau nach Biskaya-Art", false, ["PESCADO", "GLUTEN"]),
        createPlato(67, 24.50, "PESCADO", "Bacalao Club Ranero", "Bakailaoa Club Ranero", "Cod Club Ranero", "Morue Club Ranero", "Baccalà Club Ranero", "Kabeljau Club Ranero", false, ["PESCADO"]),
        createPlato(68, 26.00, "PESCADO", "Rape a la Parrilla", "Zapo parrillan", "Grilled Monkfish", "Lotte grillée", "Rana pescatrice alla griglia", "Gegrillter Seeteufel", false, ["PESCADO"]),
        createPlato(69, 27.00, "PESCADO", "Rape a la Americana", "Zapoa amerikar eran", "Monkfish American Style", "Lotte à l'américaine", "Rana pescatrice all'americana", "Seeteufel amerikanische Art", false, ["PESCADO", "CRUSTACEOS"]),
        createPlato(70, 28.00, "PESCADO", "Rodaballo a la Brasa", "Erreboiloa parrillan", "Grilled Turbot", "Turbot à la braise", "Rombo alla brace", "Gegrillter Steinbutt", false, ["PESCADO"]),
        createPlato(71, 30.00, "PESCADO", "Besugo al Horno (s/m)", "Bisigua labean", "Baked Sea Bream", "Dorade au four", "Orata al forno", "Gebackene Seebrasse", false, ["PESCADO"]),
        createPlato(72, 18.50, "PESCADO", "Chipirones en su Tinta", "Txipiroiak bere tintan", "Squid in Ink Sauce", "Calamars à l'encre", "Calamari al nero", "Tintenfisch in Tinte", true, ["MOLUSCOS", "GLUTEN"]),
        createPlato(73, 17.50, "PESCADO", "Chipirones a la Plancha", "Txipiroiak plantxan", "Grilled Squid", "Calamars grillés", "Calamari alla griglia", "Gegrillter Tintenfisch", true, ["MOLUSCOS"]),
        createPlato(74, 19.00, "PESCADO", "Bonito con Tomate (Temp.)", "Hegaluzea tomatearekin", "Tuna with Tomato", "Thon à la tomate", "Tonno al pomodoro", "Thunfisch mit Tomate", false, ["PESCADO"]),
        createPlato(75, 16.00, "PESCADO", "Anchoas del Cantábrico", "Kantauriko antxoak", "Cantabrian Anchovies", "Anchois de Cantabrie", "Acciughe del Cantabrico", "Kantabrische Sardellen", true, ["PESCADO"]),

        // --- CARNES (81-100) ---
        createPlato(81, 45.00, "CARNE", "Chuletón de Viejo Premium (kg)", "Txuleta", "Premium T-Bone Steak (kg)", "Côte de bœuf Premium", "Bistecca Premium", "Premium T-Bone-Steak", false),
        createPlato(82, 22.00, "CARNE", "Entrecot a la Plancha", "Entrekota", "Grilled Sirloin Steak", "Entrecôte grillée", "Entrecote alla griglia", "Gegrilltes Entrecôte", false),
        createPlato(83, 24.00, "CARNE", "Entrecot al Roquefort", "Entrekota roquefort eran", "Sirloin w/ Roquefort", "Entrecôte au Roquefort", "Entrecote al Roquefort", "Entrecôte mit Roquefort", false, ["LACTEOS"]),
        createPlato(84, 26.00, "CARNE", "Solomillo de Ternera", "Azpizuna", "Beef Tenderloin", "Filet de bœuf", "Filetto di manzo", "Rinderfilet", false),
        createPlato(85, 28.00, "CARNE", "Solomillo al Foie", "Azpizuna foiearekin", "Tenderloin w/ Foie", "Filet au foie gras", "Filetto al foie gras", "Filet mit Foie Gras", false),
        createPlato(86, 14.00, "CARNE", "Filete de Ternera y Patatas", "Txahal xerra", "Beef Steak w/ Chips", "Steak de veau", "Bistecca di vitello", "Kalbssteak", false),
        createPlato(87, 15.00, "CARNE", "Escalope de Ternera", "Eskalopea", "Breaded Veal Cutlet", "Escalope de veau", "Scaloppina di vitello", "Wiener Schnitzel vom Kalb", false, ["GLUTEN", "HUEVOS"]),
        createPlato(88, 18.00, "CARNE", "Chuletillas de Cordero", "Arkume txuletak", "Lamb Chops", "Côtelettes d'agneau", "Costolette di agnello", "Lammkoteletts", false),
        createPlato(89, 22.00, "CARNE", "Cordero Asado (Ración)", "Arkume errea", "Roast Lamb", "Agneau rôti", "Agnello arrosto", "Lammbraten", false),
        createPlato(90, 16.50, "CARNE", "Carrilleras al Vino Tinto", "Masailekoak ardo beltzean", "Beef Cheeks in Red Wine", "Joues de bœuf au vin", "Guance al vino rosso", "Rinderbäckchen in Rotwein", false, ["SULFITOS"]),
        createPlato(91, 18.50, "CARNE", "Rabo de Toro Estofado", "Zezen buztana", "Stewed Oxtail", "Queue de taureau", "Coda di toro", "Ochsenschwanzragout", false, ["SULFITOS", "GLUTEN"]),
        createPlato(92, 15.00, "CARNE", "Codillo Asado", "Ukondo errea", "Roast Knuckle", "Jarret rôti", "Stinco arrosto", "Eisbein", false),
        createPlato(93, 12.00, "CARNE", "Pollo Asado con Guarnición", "Oilasko errea", "Roast Chicken", "Poulet rôti", "Pollo arrosto", "Brathähnchen", false),
        createPlato(94, 11.00, "CARNE", "Pechuga de Pollo Plancha", "Oilasko bularra", "Grilled Chicken Breast", "Blanc de poulet", "Petto di pollo", "Hähnchenbrust", false),
        createPlato(95, 14.00, "CARNE", "Secreto Ibérico", "Sekretu iberikoa", "Iberian Pork Secret", "Secret ibérique", "Segreto iberico", "Iberisches Secreto", false),

        // --- POSTRES (101-115) ---
        createPlato(101, 6.50, "POSTRE", "Tarta de Queso Casera", "Gazta-tarta", "Homemade Cheesecake", "Gâteau au fromage", "Cheesecake", "Käsekuchen", false, ["LACTEOS", "HUEVOS", "GLUTEN"]),
        createPlato(102, 6.00, "POSTRE", "Tarta de Manzana", "Sagar-tarta", "Apple Pie", "Tarte aux pommes", "Torta di mele", "Apfelkuchen", false, ["GLUTEN", "HUEVOS"]),
        createPlato(103, 6.50, "POSTRE", "Tarta de Chocolate", "Txokolate-tarta", "Chocolate Cake", "Gâteau au chocolat", "Torta al cioccolato", "Schokoladenkuchen", false, ["GLUTEN", "HUEVOS", "LACTEOS"]),
        createPlato(104, 5.00, "POSTRE", "Flan de Huevo", "Arrautza-flana", "Egg Flan", "Flan aux œufs", "Budino all'uovo", "Eierflan", false, ["HUEVOS", "LACTEOS"]),
        createPlato(105, 5.50, "POSTRE", "Arroz con Leche", "Arroz-esnea", "Rice Pudding", "Riz au lait", "Riso al latte", "Milchreis", false, ["LACTEOS"]),
        createPlato(106, 5.50, "POSTRE", "Cuajada con Miel", "Mamia eztiarekin", "Curd with Honey", "Caillé au miel", "Cagliata con miele", "Quark mit Honig", false, ["LACTEOS"]),
        createPlato(107, 4.50, "POSTRE", "Natillas Caseras", "Natillak", "Custard", "Crème anglaise", "Crema pasticcera", "Vanillepudding", false, ["LACTEOS", "HUEVOS"]),
        createPlato(108, 4.00, "POSTRE", "Helado Variado", "Izozkia", "Ice Cream", "Glace", "Gelato", "Eis", false, ["LACTEOS"]),
        createPlato(109, 3.50, "POSTRE", "Fruta del Tiempo", "Fruta", "Seasonal Fruit", "Fruits de saison", "Frutta di stagione", "Obst der Saison", false),
        createPlato(110, 7.00, "POSTRE", "Queso con Membrillo", "Gazta irasagarrarekin", "Cheese w/ Quince Jelly", "Fromage et pâte de coing", "Formaggio con cotognata", "Käse mit Quittengelee", false, ["LACTEOS"]),
        createPlato(111, 6.50, "POSTRE", "Pantxineta", "Pantxineta", "Pantxineta (Cream Puff)", "Pantxineta", "Pantxineta", "Pantxineta", false, ["GLUTEN", "HUEVOS", "LACTEOS"]),
        createPlato(112, 6.00, "POSTRE", "Goxua", "Goxua", "Goxua (Basque Trifle)", "Goxua", "Goxua", "Goxua", false, ["GLUTEN", "HUEVOS", "LACTEOS"]),
        createPlato(113, 5.00, "POSTRE", "Yogur Natural Artesano", "Jogurta", "Natural Yogurt", "Yaourt nature", "Yogurt naturale", "Naturjoghurt", false, ["LACTEOS"]),
        createPlato(114, 7.50, "POSTRE", "Fresas con Nata (Temp.)", "Marrubiak", "Strawberries & Cream", "Fraises à la crème", "Fragole con panna", "Erdbeeren mit Sahne", false, ["LACTEOS"]),
        createPlato(115, 8.00, "POSTRE", "Escocés / Irlandés", "Eskoziarra / Irlandarra", "Scottish / Irish Coffee", "Café Écossais / Irlandais", "Caffè Scozzese / Irlandese", "Schottischer / Irischer Kaffee", false, ["LACTEOS"])
    ]
};

// --- NUEVO HELPER ---
// Recupera la lista de platos de Boliña el Viejo, prefiriendo la versión editada (LocalStorage) sobre la estática.
export const getMasterPlatos = (): Plato[] => {
    if (typeof localStorage === 'undefined') return bolinaConfig.initialPlatos;
    
    // Intentamos cargar la versión guardada por el usuario (donde están sus ediciones)
    const stored = localStorage.getItem(bolinaConfig.id);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            console.error("Error leyendo DB Maestra del storage", e);
        }
    }
    // Si no hay ediciones guardadas, devolvemos la lista estática
    return bolinaConfig.initialPlatos;
};

// Función dinámica para obtener la configuración activa
export const getActiveConfig = (): RestaurantConfig => {
    let active = bolinaConfig;
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const savedId = localStorage.getItem('current_active_app_id');
            const savedRegistry = localStorage.getItem('global_apps_registry');
            
            if (savedId && savedRegistry) {
                const registry = JSON.parse(savedRegistry);
                if (savedId === bolinaConfig.id) {
                    active = bolinaConfig;
                } else {
                    const found = Array.isArray(registry) ? registry.find((a: any) => a.id === savedId) : null;
                    if (found) {
                        active = found;
                    }
                }
            }
        } catch (e) {
            console.error("Error recuperando configuración de App Factory", e);
            // En caso de error crítico, volver a la configuración segura por defecto
            active = bolinaConfig;
        }
    }
    return active;
};
