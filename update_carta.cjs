const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const firebaseConfig = require('./firebase-applet-config.json');

const app = initializeApp({
  projectId: firebaseConfig.projectId,
});
const db = getFirestore(app);

const APP_ID = 'bolina_viejo_v1';

const platosList = [
    { ES: "Anchoas en salazón \"Karmelo Toja\"", EU: "\"Karmelo Toja\" antxoa", EN: "Salted anchovies \"Karmelo Toja\"", FR: "Anchois salés « Karmelo Toja »", IT: "Acciughe sotto sale \"Karmelo Toja\"", DE: "Eingesalzene Sardellen \"Karmelo Toja\"", Alergenos: ["PESCADO"], Precio: 22.00, Tipo: "ENTRANTE" },
    { ES: "Consomé", EU: "Haragi-salda", EN: "Consomme", FR: "Consommé", IT: "Consommé", DE: "Consommé", Alergenos: [], Precio: 3.00, Tipo: "ENTRANTE" },
    { ES: "Sopa de pescado", EU: "Arrain-zopa", EN: "Fish soup", FR: "Soupe de poisson", IT: "Zuppa di pesce", DE: "Fischsuppe", Alergenos: ["GLUTEN", "CRUSTACEOS", "PESCADO", "MOLUSCOS"], Precio: 13.00, Tipo: "ENTRANTE" },
    { ES: "Croquetas caseras", EU: "Etxeko kroketak", EN: "Home-made croquettes", FR: "Croquettes maison", IT: "Crocchette fatte in casa", DE: "Hausgemachte Kroketten", Alergenos: ["GLUTEN", "LACTEOS", "HUEVOS"], Precio: 10.00, Tipo: "ENTRANTE" },
    { ES: "Fritos variados", EU: "Askotariko frijituak", EN: "Fried varieties", FR: "Frits variés", IT: "Frittura mista", DE: "Verschiedene frittierte Speisen", Alergenos: ["GLUTEN", "LACTEOS", "HUEVOS"], Precio: 20.00, Tipo: "ENTRANTE" },
    { ES: "Alcachofas naturales", EU: "Alkatxofa naturalak", EN: "Natural artichokes", FR: "Artichauts naturels", IT: "Carciofi naturali", DE: "Natürliche Artischocken", Alergenos: [], Precio: 16.00, Tipo: "ENTRANTE" },
    { ES: "Espárragos naturales", EU: "Esparrago naturalak", EN: "Natural asparagus", FR: "Asperges naturels", IT: "Asparagi naturali", DE: "Natürlicher Spargel", Alergenos: [], Precio: 16.00, Tipo: "ENTRANTE" },
    { ES: "Alcachofas en conserva", EU: "Alkatxofak kontserban", EN: "Artichokes in conserve", FR: "Artichauts en conserve", IT: "Carciofi sott'olio", DE: "Eingelegte Artischocken", Alergenos: ["SULFITOS"], Precio: 14.00, Tipo: "ENTRANTE" },
    { ES: "Espárragos de Navarra con denominación de origen", EU: "Jatorri deituradun Nafarroako esparragoak", EN: "Asparagus from Navarra D.O.O.", FR: "Asperges de Navarre appellation d'origine", IT: "Asparagi di Navarra D.O.C.", DE: "Spargel aus Navarra mit Herkunftsbezeichnung", Alergenos: ["SULFITOS"], Precio: 17.00, Tipo: "ENTRANTE" },
    { ES: "Paella (solo mediodía)", EU: "Paella (eguerdietan soilik)", EN: "Chorizo and meat rice (only to lunch)", FR: "Chorizo et riz à la viande (déjeuner seulement)", IT: "Paella (solo a pranzo)", DE: "Paella (nur mittags)", Alergenos: ["GLUTEN"], Precio: 12.00, Tipo: "ARROZ" },
    { ES: "Cocido y legumbres (solo mediodía)", EU: "Eltzekoak eta lekaleak (eguerdietan)", EN: "Cooked and legumes (only to lunch)", FR: "Pot-au-feu (déjeuner seulement)", IT: "Bollito e legumi (solo a pranzo)", DE: "Eintopf und Hülsenfrüchte (nur mittags)", Alergenos: [], Precio: 15.00, Tipo: "ENTRANTE" },
    { ES: "Mollejas de cordero", EU: "Arkume-mollejak", EN: "Lamb sweetbreads", FR: "Mollejas d'agneau", IT: "Animelle di agnello", DE: "Lammbries", Alergenos: [], Precio: 22.00, Tipo: "ENTRANTE" },
    { ES: "Hongos salteados", EU: "Onddo erregosiak", EN: "Sautéed mushrooms", FR: "Champignons sautés", IT: "Funghi saltati", DE: "Sautierte Pilze", Alergenos: [], Precio: 20.00, Tipo: "ENTRANTE" },
    { ES: "Hongos a la plancha y foie", EU: "Onddoak plantxan eta foie", EN: "Grilled mushrooms and foie", FR: "Champignons grillés et foie", IT: "Funghi alla griglia e foie gras", DE: "Gegrillte Pilze und Foie gras", Alergenos: [], Precio: 28.00, Tipo: "ENTRANTE" },
    { ES: "Revuelto de hongos", EU: "Onddo nahaskia", EN: "Scrambled mushrooms", FR: "Champignons brouillés", IT: "Uova strapazzate con funghi", DE: "Rührei mit Pilzen", Alergenos: ["HUEVOS"], Precio: 22.00, Tipo: "ENTRANTE" },
    { ES: "Pulpo a la gallega", EU: "Olagarroa galizierara", EN: "Galician octopus", FR: "Poulpe galicien", IT: "Polpo alla galiziana", DE: "Oktopus nach galizischer Art", Alergenos: ["MOLUSCOS"], Precio: 22.00, Tipo: "ENTRANTE" },
    { ES: "Ensalada natural", EU: "Entsalada naturala", EN: "Green salad", FR: "Salade verte", IT: "Insalata verde", DE: "Grüner Salat", Alergenos: [], Precio: 7.00, Tipo: "ENSALADA" },
    { ES: "Ensalada mixta", EU: "Entsalada mixtoa", EN: "Mixed salad", FR: "Salade mixte", IT: "Insalata mista", DE: "Gemischter Salat", Alergenos: ["HUEVOS", "PESCADO"], Precio: 16.00, Tipo: "ENSALADA" },
    { ES: "Ensalada de tomate con ventresca de bonito", EU: "Tomatea, hegaluzea eta mendrezka", EN: "Tomato and tuna salad", FR: "Salade: tomate, bonite", IT: "Insalata di pomodori con ventresca di tonno", DE: "Tomatensalat mit Thunfischbauch", Alergenos: ["PESCADO"], Precio: 18.00, Tipo: "ENSALADA" },
    { ES: "Terrina de micuit", EU: "Mikuit terrina", EN: "Micuit terrine", FR: "Terrine de mi-cuit", IT: "Terrina di micuit", DE: "Micuit-Terrine", Alergenos: ["GLUTEN", "SULFITOS"], Precio: 20.00, Tipo: "ENTRANTE" },
    { ES: "Jamón ibérico", EU: "Urdaiazpiko iberikoa", EN: "Iberico ham shoulder", FR: "Épaule, jambon ibérique", IT: "Prosciutto iberico", DE: "Iberischer Schinken", Alergenos: [], Precio: 21.00, Tipo: "ENTRANTE" },
    { ES: "Caña de lomo ibérico", EU: "Solomo iberikoaren kanabera", EN: "Iberian loin shank", FR: "Jarret de longe ibérique", IT: "Lombo iberico", DE: "Iberische Lende", Alergenos: [], Precio: 21.00, Tipo: "ENTRANTE" },
    { ES: "Cecina de Leon", EU: "Leongo zezina", EN: "Cecina from León", FR: "Cecina de León", IT: "Cecina di León", DE: "Cecina aus León", Alergenos: [], Precio: 21.00, Tipo: "ENTRANTE" },
    
    // MARISCO
    { ES: "Gambas a la plancha", EU: "Ganbak plantxan", EN: "Grilled prawns", FR: "Crevettes grillées", IT: "Gamberi alla griglia", DE: "Gegrillte Garnelen", Alergenos: ["CRUSTACEOS"], Precio: 25.00, Tipo: "MARISCO" },
    { ES: "Gambas Rojas Alistadas", EU: "Ganba gorri marradunak", EN: "Red prawns", FR: "Crevettes rouges", IT: "Gamberi rossi", DE: "Rote Garnelen", Alergenos: ["CRUSTACEOS"], Precio: 28.00, Tipo: "MARISCO" },
    { ES: "Langostinos a la plancha", EU: "Langostinoak plantxan", EN: "Grilled prawns", FR: "Crevettes grillées", IT: "Scampi alla griglia", DE: "Gegrillte Riesengarnelen", Alergenos: ["CRUSTACEOS"], Precio: 3.00, Tipo: "MARISCO" },
    { ES: "Langostino Tigre", EU: "Tigre Otarrainxka", EN: "“Tiger” prawn", FR: "Crevette “tigrée”", IT: "Gamberone tigre", DE: "Tigergarnele", Alergenos: ["CRUSTACEOS"], Precio: 6.00, Tipo: "MARISCO" },
    { ES: "Nécoras cocidas", EU: "Nekora egosiak", EN: "Cooked crabs", FR: "Crabes cuits", IT: "Necore bollite", DE: "Gekochte Schwimmkrabben", Alergenos: ["CRUSTACEOS"], Precio: 9.00, Tipo: "MARISCO" },
    { ES: "Nécoras a la plancha", EU: "Nekorak plantxan", EN: "Grilled crabs", FR: "Crabes grillés", IT: "Necore alla griglia", DE: "Gegrillte Schwimmkrabben", Alergenos: ["CRUSTACEOS"], Precio: 10.00, Tipo: "MARISCO" },
    { ES: "Centollo cocido", EU: "Armiarma karramarro egosia", EN: "Cooked spider crab", FR: "Araignée de mer cuit", IT: "Granseola bollita", DE: "Gekochte Meeresspinne", Alergenos: ["CRUSTACEOS"], Precio: 45.00, Tipo: "MARISCO" },
    { ES: "Almejas a la marinera", EU: "Txirlak marinel erara", EN: "Seafood clams", FR: "Palourdes à la marinera", IT: "Vongole alla marinara", DE: "Venusmuscheln nach Seemannsart", Alergenos: ["MOLUSCOS"], Precio: 25.00, Tipo: "MARISCO" },
    { ES: "Almejas a la plancha", EU: "Txirlak plantxan", EN: "Grilled clams", FR: "Palourdes grillées", IT: "Vongole alla griglia", DE: "Gegrillte Venusmuscheln", Alergenos: ["MOLUSCOS"], Precio: 25.00, Tipo: "MARISCO" },
    { ES: "Almejas especiales", EU: "Txirla bereziak", EN: "Special clams", FR: "Palourdes spéciales", IT: "Vongole speciali", DE: "Spezielle Venusmuscheln", Alergenos: ["MOLUSCOS"], Precio: 33.00, Tipo: "MARISCO" },
    
    // PESCADO (Piezas)
    { ES: "Rey", EU: "Erregea", EN: "John Dory", FR: "Saint-Pierre", IT: "Pesce San Pietro", DE: "Petersfisch", Alergenos: ["PESCADO"], Precio: 0.00, Tipo: "PESCADO" },
    { ES: "Besugo a la plancha", EU: "Bisigua plantxan", EN: "Grilled sea bream", FR: "Dorade grillé", IT: "Pagello alla griglia", DE: "Gegrillte Meerbrasse", Alergenos: ["PESCADO"], Precio: 0.00, Tipo: "PESCADO" },
    { ES: "Rodaballo a la plancha", EU: "Erreboiloa plantxan", EN: "Grilled turbot", FR: "Turbot grillé", IT: "Rombo alla griglia", DE: "Gegrillter Steinbutt", Alergenos: ["PESCADO"], Precio: 0.00, Tipo: "PESCADO" },
    { ES: "Rape", EU: "Zapoa", EN: "Monkfish", FR: "Lotte", IT: "Rana pescatrice", DE: "Seeteufel", Alergenos: ["PESCADO"], Precio: 0.00, Tipo: "PESCADO" },
    { ES: "Lubina", EU: "Lupia", EN: "Sea bass", FR: "Loup de mer", IT: "Branzino", DE: "Wolfsbarsch", Alergenos: ["PESCADO"], Precio: 0.00, Tipo: "PESCADO" },
    
    // PESCADO (Raciones)
    { ES: "Merluza (Frita)", EU: "Legatza (Frijitua)", EN: "Fried hake", FR: "Hake frit", IT: "Nasello fritto", DE: "Frittierter Seehecht", Alergenos: ["GLUTEN", "PESCADO", "HUEVOS"], Precio: 22.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Merluza (A la plancha)", EU: "Legatza (Plantxan)", EN: "Grilled hake", FR: "Hake grillé", IT: "Nasello alla griglia", DE: "Gegrillter Seehecht", Alergenos: ["PESCADO"], Precio: 22.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Merluza (En salsa verde)", EU: "Legatza (Saltsa berdean)", EN: "Hake in green sauce", FR: "Sauce verte", IT: "Nasello in salsa verde", DE: "Seehecht in grüner Soße", Alergenos: ["GLUTEN", "PESCADO"], Precio: 22.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Chipirones (En su tinta)", EU: "Txipiroiak (Tintan)", EN: "Baby squid in their ink", FR: "Dans leur encre", IT: "Calamaretti nel loro nero", DE: "Kleine Tintenfische in eigener Tinte", Alergenos: ["MOLUSCOS"], Precio: 20.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Chipirones (A la plancha)", EU: "Txipiroiak (Plantxan)", EN: "Grilled baby squid", FR: "Grillé", IT: "Calamaretti alla griglia", DE: "Gegrillte kleine Tintenfische", Alergenos: ["MOLUSCOS"], Precio: 20.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Rape (A la plancha)", EU: "Zapoa (Plantxan)", EN: "Grilled monkfish", FR: "Lotte grillée", IT: "Rana pescatrice alla griglia", DE: "Gegrillter Seeteufel", Alergenos: ["PESCADO"], Precio: 24.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Rape (A la americana)", EU: "Zapoa (Amerikar erara)", EN: "Monkfish in sauce", FR: "Lotte en sauce", IT: "Rana pescatrice all'americana", DE: "Seeteufel nach amerikanischer Art", Alergenos: ["GLUTEN", "PESCADO"], Precio: 24.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Bonito (A la plancha)", EU: "Hegaluzea (Plantxan)", EN: "Grilled tuna", FR: "Thon grillé", IT: "Tonno alla griglia", DE: "Gegrillter Thunfisch", Alergenos: ["PESCADO"], Precio: 0.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Bonito (Con tomate)", EU: "Hegaluzea (Tomatearekin)", EN: "Tuna with tomato", FR: "À la sauce tomate", IT: "Tonno al pomodoro", DE: "Thunfisch mit Tomaten", Alergenos: ["GLUTEN", "PESCADO"], Precio: 0.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Bacalao (A la plancha)", EU: "Bakailaoa (Plantxan)", EN: "Grilled cod", FR: "Morue grillée", IT: "Merluzzo alla griglia", DE: "Gegrillter Kabeljau", Alergenos: ["PESCADO"], Precio: 22.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Bacalao (A la vizcaína)", EU: "Bakailaoa (Bizkaitar erara)", EN: "Cod Biscay styled", FR: "À la biscayenne", IT: "Merluzzo alla biscaglina", DE: "Kabeljau nach baskischer Art", Alergenos: ["PESCADO"], Precio: 22.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Bacalao (Al pil-pil)", EU: "Bakailaoa (Pil-pilean)", EN: "Cod pil-pil styled", FR: "Au pil-pil", IT: "Merluzzo al pil-pil", DE: "Kabeljau al Pil-Pil", Alergenos: ["PESCADO"], Precio: 22.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Bacalao (Revuelto)", EU: "Bakailaoa (Nahaskia)", EN: "Scrambled cod", FR: "Morue brouillée", IT: "Uova strapazzate con merluzzo", DE: "Rührei mit Kabeljau", Alergenos: ["GLUTEN", "PESCADO", "HUEVOS"], Precio: 18.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Begi-handi (En su tinta)", EU: "Begi-handia (Tintan)", EN: "Big squid in its own ink", FR: "Dans leur encre", IT: "Calamaro gigante nel suo nero", DE: "Riesenkalmar in eigener Tinte", Alergenos: ["MOLUSCOS"], Precio: 24.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Begi-handi (A la plancha)", EU: "Begi-handia (Plantxan)", EN: "Grilled big squid", FR: "Grillé", IT: "Calamaro gigante alla griglia", DE: "Gegrillter Riesenkalmar", Alergenos: ["MOLUSCOS"], Precio: 24.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Lenguado a la Menier", EU: "Mihia Menier erara", EN: "Grilled sole", FR: "Sole à la meunière", IT: "Sogliola alla mugnaia", DE: "Seezunge nach Müllerinart", Alergenos: ["GLUTEN", "PESCADO"], Precio: 0.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Cabracho a la plancha", EU: "Kabrarroka plantxan", EN: "Grilled red scorpion fish", FR: "Rascasse grillée", IT: "Scorfano alla griglia", DE: "Gegrillter Drachenkopf", Alergenos: ["PESCADO"], Precio: 0.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Salmonetes fritos", EU: "Salmonete frijituak", EN: "Fried red mullet", FR: "Rougets frits", IT: "Triglie fritte", DE: "Frittierte Rotbarben", Alergenos: ["GLUTEN", "PESCADO"], Precio: 0.00, Tipo: "PESCADO", Es_Racion: true },
    { ES: "Mero a la plancha", EU: "Meroa plantxan", EN: "Grilled grouper", FR: "Mérou grillé", IT: "Cernia alla griglia", DE: "Gegrillter Zackenbarsch", Alergenos: ["PESCADO"], Precio: 0.00, Tipo: "PESCADO", Es_Racion: true },
    
    // CARNES
    { ES: "Chuleta de vaca", EU: "Behi-txuleta", EN: "Cow chop", FR: "Côtelette de vache (700gr)", IT: "Costata di manzo", DE: "Rinderkotelett", Alergenos: [], Precio: 42.00, Tipo: "CARNE" },
    { ES: "Chuleta de vaca \"Premium\"", EU: "Premium Behi-txuleta", EN: "Premium Cow chop", FR: "Côtelette de vache Premium (900gr)", IT: "Costata di manzo Premium", DE: "Premium Rinderkotelett", Alergenos: [], Precio: 69.00, Tipo: "CARNE" },
    { ES: "Chuleta de ternera", EU: "Txahal-txuleta", EN: "Veal chop", FR: "Côte de veau", IT: "Costoletta di vitello", DE: "Kalbskotelett", Alergenos: [], Precio: 24.00, Tipo: "CARNE" },
    { ES: "Filete de ternera", EU: "Txahal-xerra", EN: "Beef fillet", FR: "Filet de veau", IT: "Bistecca di vitello", DE: "Kalbsfilet", Alergenos: [], Precio: 16.00, Tipo: "CARNE" },
    { ES: "Escalope de ternera", EU: "Txahal-eskalopea", EN: "Veal escalope", FR: "Escalope de veau", IT: "Scaloppina di vitello", DE: "Kalbsschnitzel", Alergenos: ["GLUTEN", "HUEVOS"], Precio: 18.00, Tipo: "CARNE" },
    { ES: "Solomillo de vaca", EU: "Behi-azpizuna", EN: "Cow tenderloin", FR: "Filet de vache", IT: "Filetto di manzo", DE: "Rinderfilet", Alergenos: [], Precio: 26.00, Tipo: "CARNE" },
    { ES: "Lomo de cerdo", EU: "Txerri solomoa", EN: "Pork loin", FR: "Longe de porc", IT: "Lombo di maiale", DE: "Schweinelende", Alergenos: [], Precio: 13.00, Tipo: "CARNE" },
    { ES: "Chuleta de cerdo", EU: "Txerri-txuleta", EN: "Pork chop", FR: "Côte de porc", IT: "Braciola di maiale", DE: "Schweinekotelett", Alergenos: [], Precio: 13.00, Tipo: "CARNE" },
    { ES: "Chuletillas de cordero", EU: "Arkume txuletak", EN: "Small lamb chop", FR: "Côtelettes d'agneau", IT: "Costolette di agnello", DE: "Lammkoteletts", Alergenos: [], Precio: 24.00, Tipo: "CARNE" },
    { ES: "Pechuga de pollo", EU: "Oilasko bularkia", EN: "Chicken breast", FR: "Blanc de poulet", IT: "Petto di pollo", DE: "Hähnchenbrust", Alergenos: [], Precio: 13.00, Tipo: "CARNE" },
    { ES: "Redondo de ternera en salsa", EU: "Txahal-koxkorra saltsan", EN: "Beef with vegetables", FR: "Viande étouffée à la jardinière", IT: "Girello di vitello in salsa", DE: "Kalbsbraten in Soße", Alergenos: ["SULFITOS"], Precio: 17.00, Tipo: "CARNE" },
    { ES: "Lengua de ternera en salsa", EU: "Txahal-mihia saltsan", EN: "Beef tongue in sauce", FR: "Langue de veau en sauce", IT: "Lingua di vitello in salsa", DE: "Kalbszunge in Soße", Alergenos: ["GLUTEN", "SULFITOS"], Precio: 17.00, Tipo: "CARNE" },
    { ES: "Carrilleras de ternera al vino tinto", EU: "Txahal-masaila ardo beltzean", EN: "Beef cheek in red wine", FR: "Joues de bœuf au vin rouge", IT: "Guance di vitello al vino rosso", DE: "Kalbsbäckchen in Rotwein", Alergenos: ["SULFITOS"], Precio: 23.00, Tipo: "CARNE" },
    { ES: "Rabo de ternera guisada", EU: "Txahal-buztan gisatua", EN: "Stewed beef tail", FR: "Ragoût de bœuf", IT: "Coda di vitello in umido", DE: "Geschmorter Ochsenschwanz", Alergenos: ["SULFITOS"], Precio: 23.00, Tipo: "CARNE" },
    { ES: "Carrillera de cerdo ibérico", EU: "Iberiar txerri masaila", EN: "Iberian pork cheek", FR: "Joue de porc ibérique", IT: "Guancia di maiale iberico", DE: "Iberische Schweinebäckchen", Alergenos: ["SULFITOS"], Precio: 20.00, Tipo: "CARNE" },
    { ES: "Manitas de cerdo a la vizcaína", EU: "Txerri-hankak bizkaitar erara", EN: "Biscay pig trotters", FR: "Pieds de porc de Gascogne", IT: "Zampini di maiale alla biscaglina", DE: "Schweinefüße nach baskischer Art", Alergenos: ["SULFITOS"], Precio: 22.00, Tipo: "CARNE" },
    { ES: "Callos de ternera a la vizcaína", EU: "Txahalkiak bizkaitar erara", EN: "Tripe at Biscayne style", FR: "Tripes à la biscayenne", IT: "Trippa di vitello alla biscaglina", DE: "Kutteln nach baskischer Art", Alergenos: ["SULFITOS"], Precio: 19.00, Tipo: "CARNE" },
    { ES: "Morros de ternera a la vizcaína", EU: "Txerri-muturrak bizkaitar erara", EN: "Biscay styled veal cheeks", FR: "Museau à la biscayenne", IT: "Musetti di vitello alla biscaglina", DE: "Kalbsschnauze nach baskischer Art", Alergenos: ["SULFITOS"], Precio: 20.00, Tipo: "CARNE" },
    { ES: "Entrecot", EU: "Entrekot", EN: "Ribeye steak", FR: "Entrecôte", IT: "Entrecôte", DE: "Entrecôte", Alergenos: [], Precio: 20.00, Tipo: "CARNE" },
    
    // POSTRES
    { ES: "Arroz con leche", EU: "Arroz esnea", EN: "Rice pudding", FR: "Riz au lait", IT: "Riso al latte", DE: "Milchreis", Alergenos: ["LACTEOS", "SULFITOS"], Precio: 5.00, Tipo: "POSTRE" },
    { ES: "Cuajada casera", EU: "Etxeko gatzatua", EN: "Homemade curd", FR: "Caillé fait maison", IT: "Cagliata fatta in casa", DE: "Hausgemachter Quark", Alergenos: ["LACTEOS"], Precio: 5.00, Tipo: "POSTRE" },
    { ES: "Flan casero", EU: "Etxeko flana", EN: "Homemade cream caramel", FR: "Flan maison", IT: "Crème caramel della casa", DE: "Hausgemachter Flan", Alergenos: ["LACTEOS", "HUEVOS"], Precio: 5.00, Tipo: "POSTRE" },
    { ES: "Natillas caseras", EU: "Etxeko natilak", EN: "Homemade custard", FR: "Crème anglaise", IT: "Crema pasticcera fatta in casa", DE: "Hausgemachter Pudding", Alergenos: ["LACTEOS", "HUEVOS"], Precio: 5.00, Tipo: "POSTRE" },
    { ES: "Tostadas de crema", EU: "Kremazko torradak", EN: "Homemade cream toasts", FR: "Pain grillé maison", IT: "French toast alla crema", DE: "Arme Ritter mit Creme", Alergenos: ["GLUTEN", "LACTEOS", "HUEVOS"], Precio: 6.00, Tipo: "POSTRE" },
    { ES: "Hojaldre con crema pastelera", EU: "Hostorea pastel-kremarekin", EN: "Puff pastry with pastry cream", FR: "Pâte feuilletée à la crème pâtissière", IT: "Millefoglie con crema pasticcera", DE: "Blätterteig mit Konditorcreme", Alergenos: ["GLUTEN", "LACTEOS", "HUEVOS"], Precio: 5.00, Tipo: "POSTRE" },
    { ES: "Tarta de queso", EU: "Gazta tarta", EN: "Cheesecake", FR: "Tarte au fromage", IT: "Torta al formaggio (Cheesecake)", DE: "Käsekuchen", Alergenos: ["GLUTEN", "LACTEOS", "HUEVOS"], Precio: 6.00, Tipo: "POSTRE" },
    { ES: "Tarta de manzana", EU: "Sagar tarta", EN: "Apple pie", FR: "Tarte aux pommes", IT: "Torta di mele", DE: "Apfelkuchen", Alergenos: ["GLUTEN", "LACTEOS", "HUEVOS"], Precio: 6.00, Tipo: "POSTRE" },
    { ES: "Queso con membrillo", EU: "Gazta irasagarrarekin", EN: "Cheese with quiche", FR: "Fromage de coing", IT: "Formaggio con mela cotogna", DE: "Käse mit Quittenbrot", Alergenos: ["LACTEOS"], Precio: 7.00, Tipo: "POSTRE" },
    { ES: "Frutas variadas", EU: "Askotariko frutak", EN: "Fruit", FR: "Fruit", IT: "Frutta mista", DE: "Verschiedene Früchte", Alergenos: [], Precio: 4.00, Tipo: "POSTRE" },
    { ES: "Macedonia de frutas", EU: "Fruta-mazedonia", EN: "Fruit salad", FR: "Salade de fruits", IT: "Macedonia di frutta", DE: "Obstsalat", Alergenos: [], Precio: 4.00, Tipo: "POSTRE" },
    { ES: "Tarta de whisky", EU: "Whisky tarta", EN: "Ice whisky cake", FR: "Gâteau au whisky", IT: "Torta al whisky", DE: "Whisky-Torte", Alergenos: ["GLUTEN", "LACTEOS", "HUEVOS", "SULFITOS", "CACAHUETES"], Precio: 6.00, Tipo: "POSTRE" },
    { ES: "Tarta contesa", EU: "Kontesa tarta", EN: "Ice cream and chocolate cake", FR: "Gâteau à la crème glacée et au chocolat", IT: "Torta gelato Contessa", DE: "Contessa-Eistorte", Alergenos: ["GLUTEN", "LACTEOS", "HUEVOS", "CACAHUETES"], Precio: 5.00, Tipo: "POSTRE" },
    { ES: "Helados variados", EU: "Askotariko izozkiak", EN: "Varied ice creams", FR: "Glace variée", IT: "Gelati misti", DE: "Verschiedene Eissorten", Alergenos: ["GLUTEN", "LACTEOS", "HUEVOS"], Precio: 5.00, Tipo: "POSTRE" },
    { ES: "Escocés", EU: "Eskozesa", EN: "Scottish (ice and coffee with whiskey)", FR: "Écossais (glace à la vanille, café et whisky)", IT: "Scozzese (gelato, caffè e whisky)", DE: "Schottisch (Eis, Kaffee und Whisky)", Alergenos: ["LACTEOS"], Precio: 9.00, Tipo: "POSTRE" },
    { ES: "Valenciano", EU: "Valentziarra", EN: "Valencian (orange juice with ice and Cointreau)", FR: "Valencien (glacé à la vanille, Cointreau du jus d'orange)", IT: "Valenciano (succo d'arancia, gelato e Cointreau)", DE: "Valencianisch (Orangensaft, Eis und Cointreau)", Alergenos: ["LACTEOS"], Precio: 9.00, Tipo: "POSTRE" },
    { ES: "Café", EU: "Kafea", EN: "Coffee", FR: "Café", IT: "Caffè", DE: "Kaffee", Alergenos: [], Precio: 2.00, Tipo: "POSTRE" }
];

async function updateMenu() {
    try {
        console.log("Starting menu update for", APP_ID);
        const platosRef = db.collection('restaurants').doc(APP_ID).collection('platos');
        
        // 1. Get all current plates
        const snapshot = await platosRef.get();
        console.log(`Found ${snapshot.size} plates currently in DB.`);

        // 2. Delete plates with Categoria === "CARTA"
        let deleted = 0;
        let menuCount = 0;
        let startId = 1000;
        
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const id = parseInt(doc.id, 10);
            if (!isNaN(id) && id >= startId) {
                startId = id + 1;
            }
            if (data.Categoria && data.Categoria.includes("CARTA")) {
                let newCat = data.Categoria.split(',').filter(c => c.trim() !== 'CARTA').join(',');
                if (newCat === '') {
                    await doc.ref.delete();
                    deleted++;
                } else {
                    await doc.ref.update({ Categoria: newCat });
                    menuCount++;
                }
            } else {
                menuCount++;
            }
        }
        
        console.log(`Deleted ${deleted} CARTA plates. Kept ${menuCount} MENU plates. Starting ID at ${startId}`);

        // 3. Add new plates
        let added = 0;
        for (const p of platosList) {
            const newId = startId++;
            const newPlato = {
                ID_Plato: newId,
                Precio: p.Precio,
                ES_Nombre: p.ES,
                EU_Nombre: p.EU,
                EN_Nombre: p.EN,
                FR_Nombre: p.FR,
                IT_Nombre: p.IT,
                DE_Nombre: p.DE,
                Categoria: "CARTA",
                Tipo: p.Tipo,
                Activo_Dia: true,
                Rol_Menu: null,
                Es_Racion: p.Es_Racion || false,
                Alergenos: p.Alergenos
            };
            
            await platosRef.doc(newId.toString()).set(newPlato);
            added++;
        }
        
        console.log(`Added ${added} new plates to CARTA.`);
        console.log("Done.");
        
    } catch (error) {
        console.error("Error updating menu:", error);
    }
}

updateMenu();
