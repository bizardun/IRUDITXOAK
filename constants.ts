
import type { Language, Translations } from './types';
import { FlagDE, FlagEN, FlagES, FlagEU, FlagFR, FlagIT } from './components/icons';

export const languages: Language[] = [
    { code: 'EU', name: 'Euskera', flag: FlagEU },
    { code: 'EN', name: 'English', flag: FlagEN },
    { code: 'FR', name: 'Français', flag: FlagFR },
    { code: 'DE', name: 'Deutsch', flag: FlagDE },
    { code: 'IT', name: 'Italiano', flag: FlagIT },
    { code: 'ES', name: 'Español', flag: FlagES },
];

export const translations: Translations = {
    ES: {
        menuDelDia: "Menú del Día",
        carta: "Carta",
        raciones: "Raciones",
        primerosPlatos: "Primeros",
        segundosPlatos: "Segundos",
        postres: "Postres",
        precioPersona: "Precio por persona",
        infoAlergenos: "Información de Alérgenos",
        mostrarAlergenos: "Mostrar Alérgenos",
        ocultarAlergenos: "Ocultar Alérgenos",
        tipos: { ENTRANTE: "Entrantes", ENSALADA: "Ensaladas", ARROZ: "Arroces", MARISCO: "Mariscos", PESCADO: "Pescados", CARNE: "Carnes", POSTRE: "Postres" },
        alergenos: {
            GLUTEN: "Gluten", CRUSTACEOS: "Crustáceos", HUEVOS: "Huevos", PESCADO: "Pescado", 
            CACAHUETES: "Cacahuetes", SOJA: "Soja", LACTEOS: "Lácteos", 
            APIO: "Apio", MOSTAZA: "Mostaza", SESAMO: "Sésamo", SULFITOS: "Sulfitos", 
            ALTRAMUCES: "Altramuces", MOLUSCOS: "Moluscos"
        },
        gestion: {
            panel: "Gestión",
            volver: "Volver",
            anadir: "Añadir",
            precioMenu: "Precio Menú",
            guardar: "Guardar",
            plato: "Plato",
            rol: "Rol",
            precio: "Precio",
            activo: "Activo",
            sinPlatos: "No hay platos activos aquí.",
            actualizar: "Publicar Cambios",
            buscando: "Buscando...",
            traduciendo: "Traduciendo..."
        }
    },
    EU: {
        menuDelDia: "Eguneko Menua",
        carta: "Karta",
        raciones: "Razioak",
        primerosPlatos: "Lehenengoak",
        segundosPlatos: "Bigarrenak",
        postres: "Postreak",
        precioPersona: "Prezioa pertsonako",
        infoAlergenos: "Alergenoen Informazioa",
        mostrarAlergenos: "Alergenoak Erakutsi",
        ocultarAlergenos: "Alergenoak Ezkutatu",
        tipos: { ENTRANTE: "Hasierakoak", ENSALADA: "Entsaladak", ARROZ: "Arrozak", MARISCO: "Itsaskiak", PESCADO: "Arrainak", CARNE: "Haragiak", POSTRE: "Postreak" },
        alergenos: {
            GLUTEN: "Glutena", CRUSTACEOS: "Krustazeoak", HUEVOS: "Arrautzak", PESCADO: "Arraina", 
            CACAHUETES: "Kakahueteak", SOJA: "Soja", LACTEOS: "Esnekiak", 
            APIO: "Apioa", MOSTAZA: "Ziapea", SESAMO: "Sesamoa", SULFITOS: "Sulfitoak", 
            ALTRAMUCES: "Altramuzak", MOLUSCOS: "Moluskuak"
        }
    },
    EN: {
        menuDelDia: "Daily Menu",
        carta: "Menu",
        raciones: "Tapas",
        primerosPlatos: "Starters",
        segundosPlatos: "Mains",
        postres: "Desserts",
        precioPersona: "Price per person",
        infoAlergenos: "Allergen Information",
        mostrarAlergenos: "Show Allergens",
        ocultarAlergenos: "Hide Allergens",
        tipos: { ENTRANTE: "Starters", ENSALADA: "Salads", ARROZ: "Rice", MARISCO: "Seafood", PESCADO: "Fish", CARNE: "Meats", POSTRE: "Desserts" },
        alergenos: {
            GLUTEN: "Gluten", CRUSTACEOS: "Crustaceans", HUEVOS: "Eggs", PESCADO: "Fish", 
            CACAHUETES: "Peanuts", SOJA: "Soy", LACTEOS: "Dairy", 
            APIO: "Celery", MOSTAZA: "Mustard", SESAMO: "Sesame", SULFITOS: "Sulphites", 
            ALTRAMUCES: "Lupins", MOLUSCOS: "Molluscs"
        }
    },
    FR: {
        menuDelDia: "Menu du Jour",
        carta: "Carte",
        raciones: "Rations",
        primerosPlatos: "Entrées",
        segundosPlatos: "Plats",
        postres: "Desserts",
        precioPersona: "Prix par personne",
        infoAlergenos: "Information Allergènes",
        mostrarAlergenos: "Afficher Allergènes",
        ocultarAlergenos: "Masquer Allergènes",
        tipos: { ENTRANTE: "Entrées", ENSALADA: "Salades", ARROZ: "Riz", MARISCO: "Fruits de mer", PESCADO: "Poissons", CARNE: "Viandes", POSTRE: "Desserts" },
        alergenos: {
            GLUTEN: "Gluten", CRUSTACEOS: "Crustacés", HUEVOS: "Œufs", PESCADO: "Poisson", 
            CACAHUETES: "Arachides", SOJA: "Soja", LACTEOS: "Produits laitiers", 
            APIO: "Céleri", MOSTAZA: "Moutarde", SESAMO: "Sésame", SULFITOS: "Sulfites", 
            ALTRAMUCES: "Lupins", MOLUSCOS: "Mollusques"
        }
    },
    DE: {
        menuDelDia: "Tagesmenü",
        carta: "Speisekarte",
        raciones: "Portionen",
        primerosPlatos: "Vorspeisen",
        segundosPlatos: "Hauptgerichte",
        postres: "Desserts",
        precioPersona: "Preis pro Person",
        infoAlergenos: "Allergieinformationen",
        mostrarAlergenos: "Allergene anzeigen",
        ocultarAlergenos: "Allergene ausblenden",
        tipos: { ENTRANTE: "Vorspeisen", ENSALADA: "Salate", ARROZ: "Reis", MARISCO: "Meeresfrüchte", PESCADO: "Fisch", CARNE: "Fleisch", POSTRE: "Desserts" },
        alergenos: {
            GLUTEN: "Gluten", CRUSTACEOS: "Krebstiere", HUEVOS: "Eier", PESCADO: "Fisch", 
            CACAHUETES: "Erdnüsse", SOJA: "Soja", LACTEOS: "Milchprodukte", 
            APIO: "Sellerie", MOSTAZA: "Senf", SESAMO: "Sesam", SULFITOS: "Sulfite", 
            ALTRAMUCES: "Lupinen", MOLUSCOS: "Weichtiere"
        }
    },
    IT: {
        menuDelDia: "Menu del Giorno",
        carta: "Carta",
        raciones: "Porzioni",
        primerosPlatos: "Primi",
        segundosPlatos: "Secondi",
        postres: "Dolci",
        precioPersona: "Prezzo a persona",
        infoAlergenos: "Informazioni Allergeni",
        mostrarAlergenos: "Mostra Allergeni",
        ocultarAlergenos: "Nascondi Allergeni",
        tipos: { ENTRANTE: "Antipasti", ENSALADA: "Insalate", ARROZ: "Riso", MARISCO: "Frutti di mare", PESCADO: "Pesce", CARNE: "Carne", POSTRE: "Dolci" },
        alergenos: {
            GLUTEN: "Glutine", CRUSTACEOS: "Crostacei", HUEVOS: "Uova", PESCADO: "Pesce", 
            CACAHUETES: "Arachidi", SOJA: "Soia", LACTEOS: "Latticini", 
            APIO: "Sedano", MOSTAZA: "Senape", SESAMO: "Sesamo", SULFITOS: "Solfiti", 
            ALTRAMUCES: "Lupini", MOLUSCOS: "Molluschi"
        }
    }
};