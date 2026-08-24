const { initializeApp } = require("firebase/app");
const { getFirestore, getDocs, collection, doc, writeBatch } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCvxipZmbXASjjZ-NvdrfUYKaZHcjwiUOk",
  authDomain: "gen-lang-client-0960122101.firebaseapp.com",
  projectId: "gen-lang-client-0960122101",
  storageBucket: "gen-lang-client-0960122101.firebasestorage.app",
  messagingSenderId: "774356504936",
  appId: "1:774356504936:web:34416f05126a7f917786dd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-gestinderestaura-0bf9c0e9-a516-4b52-ab72-7f00b5b37c6d");

// A predefined dictionary of accurate translations to save API calls and ensure accuracy
const translations = {
    "PALETILLA JOSELITO": { EU_Nombre: "JOSELITO BESALDEA", EN_Nombre: "JOSELITO SHOULDER", FR_Nombre: "ÉPAULE JOSELITO", DE_Nombre: "JOSELITO-SCHULTER", IT_Nombre: "SPALLA JOSELITO" },
    "100% Ibérico de bellota con pan tumaca": { EU_Descripcion: "% 100 ezkur iberikoa, ogia eta tomatearekin", EN_Descripcion: "100% Acorn-fed Iberian with pan tumaca", FR_Descripcion: "100% Ibérique de bellota avec pain tomate", DE_Descripcion: "100% Iberico aus Eichelmast mit Pan Tumaca", IT_Descripcion: "100% Iberico di ghianda con pan tumaca" },
    
    "CECINA WAGYU JAPONÉS": { EU_Nombre: "JAPONIAKO WAGYU ZEZINA", EN_Nombre: "JAPANESE WAGYU CECINA", FR_Nombre: "CÉCINE DE WAGYU JAPONAIS", DE_Nombre: "JAPANISCHES WAGYU CECINA", IT_Nombre: "CECINA DI WAGYU GIAPPONESE" },
    "con pan de cristal": { EU_Descripcion: "kristal ogiarekin", EN_Descripcion: "with crystal bread", FR_Descripcion: "avec pain de cristal", DE_Descripcion: "mit Kristallbrot", IT_Descripcion: "con pane di cristallo" },
    
    "CHORIZO IBÉRICO": { EU_Nombre: "TXORIZO IBERIKOA", EN_Nombre: "IBERIAN CHORIZO", FR_Nombre: "CHORIZO IBÉRIQUE", DE_Nombre: "IBERISCHE CHORIZO", IT_Nombre: "CHORIZO IBERICO" },
    "corte a cuchillo": { EU_Descripcion: "labanaz moztua", EN_Descripcion: "knife-cut", FR_Descripcion: "coupé au couteau", DE_Descripcion: "handgeschnitten", IT_Descripcion: "tagliato al coltello" },
    
    "FOIE MICUIT DE LA CASA": { EU_Nombre: "ETXEKO FOIE MICUITA", EN_Nombre: "HOUSE FOIE MICUIT", FR_Nombre: "FOIE GRAS MI-CUIT MAISON", DE_Nombre: "HAUSGEMACHTES FOIE MICUIT", IT_Nombre: "FOIE MICUIT DELLA CASA" },
    "mermelada de manzana y jengibre": { EU_Descripcion: "sagar eta jengibre mermelada", EN_Descripcion: "apple and ginger jam", FR_Descripcion: "confiture de pomme et gingembre", DE_Descripcion: "Apfel-Ingwer-Marmelade", IT_Descripcion: "marmellata di mele e zenzero" },
    
    "ANCHOA DEL CANTÁBRICO ROYO": { EU_Nombre: "KANTABRIKO ITSASOKO ANTXOA", EN_Nombre: "CANTABRIAN ANCHOVY", FR_Nombre: "ANCHOIS DU CANTABRIQUE", DE_Nombre: "KANTABRISCHE SARDELLEN", IT_Nombre: "ACCIUGA DEL CANTABRICO" },
    "del golfo de Bizkaia, en salazón, método ancestral": { EU_Descripcion: "Bizkaiko golkokoa, gazitua, antzinako metodoa", EN_Descripcion: "from the Bay of Biscay, salted, ancestral method", FR_Descripcion: "du golfe de Gascogne, salé, méthode ancestrale", DE_Descripcion: "aus dem Golf von Biskaya, gesalzen, uralte Methode", IT_Descripcion: "del Golfo di Biscaglia, sotto sale, metodo ancestrale" },
    
    "GAMBAS DE HUELVA A LA SAL (1 docena)": { EU_Nombre: "HUELVAKO GANBAK GATZETAN (dozena bat)", EN_Nombre: "SALTED HUELVA PRAWNS (1 dozen)", FR_Nombre: "CREVETTES DE HUELVA AU SEL (1 douzaine)", DE_Nombre: "HUELVA-GARNELEN IN SALZ (1 Dutzend)", IT_Nombre: "GAMBERI DI HUELVA AL SALE (1 dozzina)" },
    
    "OSTRAS NATURAL": { EU_Nombre: "OSTRA NATURALAK", EN_Nombre: "NATURAL OYSTERS", FR_Nombre: "HUÎTRES NATURELLES", DE_Nombre: "NATUR-AUSTERN", IT_Nombre: "OSTRICHE NATURALI" },
    "OSTRAS CON ATÚN": { EU_Nombre: "OSTRAK HEGALUZEAREKIN", EN_Nombre: "OYSTERS WITH TUNA", FR_Nombre: "HUÎTRES AU THON", DE_Nombre: "AUSTERN MIT THUNFISCH", IT_Nombre: "OSTRICHE CON TONNO" },
    "salsa ponzu y ralladura de lima": { EU_Descripcion: "ponzu saltsa eta lima birrindua", EN_Descripcion: "ponzu sauce and lime zest", FR_Descripcion: "sauce ponzu et zeste de citron vert", DE_Descripcion: "Ponzu-Sauce und Limettenschale", IT_Descripcion: "salsa ponzu e scorza di lime" },
    "OSTRAS A LA BRASA": { EU_Nombre: "OSTRAK BRASAN", EN_Nombre: "GRILLED OYSTERS", FR_Nombre: "HUÎTRES BRAISÉES", DE_Nombre: "GEGRILLTE AUSTERN", IT_Nombre: "OSTRICHE ALLA BRACE" },
    "pil-pil, parmentier y wakame": { EU_Descripcion: "pil-pil saltsa, parmentiera eta wakamea", EN_Descripcion: "pil-pil, parmentier and wakame", FR_Descripcion: "pil-pil, parmentier et wakame", DE_Descripcion: "Pil-Pil, Parmentier und Wakame", IT_Descripcion: "pil-pil, parmentier e wakame" },
    
    "TOSTADA DE ATÚN": { EU_Nombre: "HEGALUZE TOSTADA", EN_Nombre: "TUNA TOAST", FR_Nombre: "TOAST AU THON", DE_Nombre: "THUNFISCH-TOAST", IT_Nombre: "TOAST DI TONNO" },
    "cremoso de aguacate y mayonesa chipotle": { EU_Descripcion: "ahuakate krematsua eta chipotle maionesa", EN_Descripcion: "creamy avocado and chipotle mayonnaise", FR_Descripcion: "avocat crémeux et mayonnaise chipotle", DE_Descripcion: "Cremige Avocado und Chipotle-Mayonnaise", IT_Descripcion: "avocado cremoso e maionese chipotle" },
    
    "TATAKI DE ATÚN ROJO": { EU_Nombre: "HEGALUZE GORRIAREN TATAKIA", EN_Nombre: "RED TUNA TATAKI", FR_Nombre: "TATAKI DE THON ROUGE", DE_Nombre: "ROTER THUNFISCH-TATAKI", IT_Nombre: "TATAKI DI TONNO ROSSO" },
    "marinado en soja, emulsión de mango picante, salteado de algas y sésamo": { EU_Descripcion: "sojan ondua, mango pikante emultsioa, alga eta sesamo salteatua", EN_Descripcion: "marinated in soy, spicy mango emulsion, sautéed seaweed and sesame", FR_Descripcion: "mariné au soja, émulsion de mangue épicée, poêlée d'algues et sésame", DE_Descripcion: "mariniert in Soja, scharfe Mangoemulsion, sautierte Algen und Sesam", IT_Descripcion: "marinato nella soia, emulsione di mango piccante, alghe saltate e sesamo" },
    
    "TALLARINES DE BEGIHANDI": { EU_Nombre: "BEGIHANDI TALLARINAK", EN_Nombre: "SQUID TALLARINES", FR_Nombre: "TAGLIATELLES D'ENCORNET", DE_Nombre: "TINTENFISCH-NUDELN", IT_Nombre: "TAGLIATELLE DI CALAMARO" },
    "sobre velo de su tinta y marmita de txipirón": { EU_Descripcion: "bere tintaren belo gainean eta txipiroi marmita", EN_Descripcion: "over a veil of its ink and squid stew", FR_Descripcion: "sur un voile de son encre et marmite de calamar", DE_Descripcion: "auf einem Schleier aus eigener Tinte und Tintenfisch-Eintopf", IT_Descripcion: "su un velo del proprio inchiostro e zuppa di calamari" },
    
    "PULPO ASADO AL JOSPER": { EU_Nombre: "OLAGARROA JOSPERRAN ERREA", EN_Nombre: "JOSPER ROASTED OCTOPUS", FR_Nombre: "POULPE RÔTI AU JOSPER", DE_Nombre: "JOSPER GEGRILLTER OKTOPUS", IT_Nombre: "POLPO ARROSTO AL JOSPER" },
    "patata, pimentón crujiente y caldo dashi texturizado": { EU_Descripcion: "patata, piperrauts kurruskaria eta dashi salda testurizatua", EN_Descripcion: "potato, crispy paprika and textured dashi broth", FR_Descripcion: "pomme de terre, paprika croustillant et bouillon dashi texturé", DE_Descripcion: "Kartoffel, knuspriger Paprika und strukturierte Dashi-Brühe", IT_Descripcion: "patata, paprika croccante e brodo dashi strutturato" },
    
    "HONGOS SALTEADOS": { EU_Nombre: "ONDDO SALTEATUAK", EN_Nombre: "SAUTÉED MUSHROOMS", FR_Nombre: "CHAMPIGNONS SAUTÉS", DE_Nombre: "SAUTIERTE PILZE", IT_Nombre: "FUNGHI SALTATI" },
    "huevo a baja temperatura, royal de foie y jugo de champiñones": { EU_Descripcion: "tenperatura baxuko arrautza, foie royala eta txanpiñoi zukua", EN_Descripcion: "low temperature egg, foie royal and mushroom jus", FR_Descripcion: "œuf basse température, royale de foie et jus de champignons", DE_Descripcion: "Niedertemperatur-Ei, Foie Royal und Pilzjus", IT_Descripcion: "uovo a bassa temperatura, royal di foie e succo di funghi" },
    
    "ALCACHOFAS DE NAVARRA A LA BRASA": { EU_Nombre: "NAFARROAKO ORBURUAK BRASAN", EN_Nombre: "GRILLED NAVARRE ARTICHOKES", FR_Nombre: "ARTICHAUTS DE NAVARRE BRAISÉS", DE_Nombre: "GEGRILLTE ARTISCHOCKEN AUS NAVARRA", IT_Nombre: "CARCIOFI DI NAVARRA ALLA BRACE" },
    "yema de caserío y queso ganador del Último Lunes de Gernika": { EU_Descripcion: "baserriko gorringoa eta Gernikako Azken Astelehena irabazi duen gazta", EN_Descripcion: "farmhouse egg yolk and winning cheese from the Last Monday of Gernika", FR_Descripcion: "jaune d'œuf de ferme et fromage lauréat du Dernier Lundi de Gernika", DE_Descripcion: "Eigelb vom Bauernhof und preisgekrönter Käse vom Letzten Montag in Gernika", IT_Descripcion: "tuorlo di fattoria e formaggio vincitore dell'Ultimo Lunedì di Gernika" },
    
    "VERDINAS GUISADAS": { EU_Nombre: "BERDINA GISATUAK", EN_Nombre: "STEWED VERDINAS", FR_Nombre: "VERDINAS MIJOTÉES", DE_Nombre: "GESCHMORTE VERDINAS-BOHNEN", IT_Nombre: "VERDINAS IN UMIDO" },
    "shiitake, oreja y gamba roja": { EU_Descripcion: "shiitakea, belarria eta ganba gorria", EN_Descripcion: "shiitake, ear and red prawn", FR_Descripcion: "shiitake, oreille et crevette rouge", DE_Descripcion: "Shiitake, Ohr und rote Garnele", IT_Descripcion: "shiitake, orecchia e gambero rosso" },
    
    "ARROZ DEL CHEF (Ración)": { EU_Nombre: "CHEF-AREN ARROZA", EN_Nombre: "CHEF's RICE", FR_Nombre: "RIZ DU CHEF", DE_Nombre: "REIS DES CHEFKOCHS", IT_Nombre: "RISO DEL CHEF" },
    "Mínimo 2 personas. Propuesta refinada de temporada.": { EU_Descripcion: "Gutxienez 2 pertsona. Garaiko proposamen findua.", EN_Descripcion: "Minimum 2 people. Refined seasonal proposal.", FR_Descripcion: "Minimum 2 personnes. Proposition de saison raffinée.", DE_Descripcion: "Minimum 2 Personen. Raffinierter saisonaler Vorschlag.", IT_Descripcion: "Minimo 2 persone. Proposta stagionale raffinata." },
    
    "KOKOTXAS DE MERLUZA": { EU_Nombre: "LEGATZ KOKOTXAK", EN_Nombre: "HAKE KOKOTXAS", FR_Nombre: "KOKOTXAS DE MERLU", DE_Nombre: "SEEHECHT-KOKOTXAS", IT_Nombre: "KOKOTXAS DI NASELLO" },
    "al pil-pil": { EU_Descripcion: "pil-pil erara", EN_Descripcion: "in pil-pil sauce", FR_Descripcion: "au pil-pil", DE_Descripcion: "im Pil-Pil", IT_Descripcion: "al pil-pil" },
    
    "BACALAO CONFITADO": { EU_Nombre: "BAKAILAOA KONFITATUA", EN_Nombre: "CONFIT COD", FR_Nombre: "MORUE CONFITE", DE_Nombre: "KONFIERTER KABELJAU", IT_Nombre: "BACCALÀ CONFIT" },
    "sobre marmita de txipirones a lo Pelayo y tirabeques": { EU_Descripcion: "Pelayo erako txipiroi marmita eta tirabeke gainean", EN_Descripcion: "over Pelayo style squid stew and snow peas", FR_Descripcion: "sur marmite de calamars à la Pelayo et pois gourmands", DE_Descripcion: "auf Tintenfisch-Eintopf nach Pelayo-Art und Zuckerschoten", IT_Descripcion: "su zuppa di calamari alla Pelayo e taccole" },
    
    "LUBINA": { EU_Nombre: "LUPINA", EN_Nombre: "SEA BASS", FR_Nombre: "BAR", DE_Nombre: "WOLFSBARSCH", IT_Nombre: "BRANZINO" },
    "salsa de curry verde, lima y patatas asadas": { EU_Descripcion: "curry berde saltsa, lima eta patata erreak", EN_Descripcion: "green curry sauce, lime and roasted potatoes", FR_Descripcion: "sauce curry vert, citron vert et pommes de terre rôties", DE_Descripcion: "grüne Currysauce, Limette und Bratkartoffeln", IT_Descripcion: "salsa al curry verde, lime e patate arrosto" },
    
    "PALETILLA DE CORDERO": { EU_Nombre: "ARKUME BESALDEA", EN_Nombre: "LAMB SHOULDER", FR_Nombre: "ÉPAULE D'AGNEAU", DE_Nombre: "LAMMSCHULTER", IT_Nombre: "SPALLA DI AGNELLO" },
    "cocción a baja temperatura": { EU_Descripcion: "tenperatura baxuan egosia", EN_Descripcion: "low temperature cooking", FR_Descripcion: "cuisson à basse température", DE_Descripcion: "Niedertemperaturgaren", IT_Descripcion: "cottura a bassa temperatura" },
    
    "RABO DE GANADO MAYOR DESHUESADO": { EU_Nombre: "GANADU NAGUSIKO BUZTAN HEZURGABEA", EN_Nombre: "BONELESS OX TAIL", FR_Nombre: "QUEUE DE BOEUF DÉSOSSÉE", DE_Nombre: "KNOCHENLOSER OCHSSCHWANZ", IT_Nombre: "CODA DI BUE DISOSSATA" },
    "pesto de choriceros, avellanas y kétchup de piquillos": { EU_Descripcion: "txorizero pestoa, hurrak eta pikillo ketchup-a", EN_Descripcion: "choricero pepper pesto, hazelnuts and piquillo ketchup", FR_Descripcion: "pesto de poivrons choricero, noisettes et ketchup de piquillos", DE_Descripcion: "Choricero-Paprika-Pesto, Haselnüsse und Piquillo-Ketchup", IT_Descripcion: "pesto di peperoni choricero, nocciole e ketchup di piquillo" },
    
    "PECHUGA DE PICHÓN A LA BRASA": { EU_Nombre: "USO BULARRA BRASAN", EN_Nombre: "GRILLED SQUAB BREAST", FR_Nombre: "PIGEONNEAU BRAISÉ", DE_Nombre: "GEGRILLTE TAUBENBRUST", IT_Nombre: "PETTO DI PICCIONE ALLA BRACE" },
    "muslos confitados, paté de sus hígados y puré de manzana": { EU_Descripcion: "izter konfitatuak, gibelen patea eta sagar purea", EN_Descripcion: "confit thighs, liver pâté and apple purée", FR_Descripcion: "cuisses confites, pâté de ses foies et purée de pommes", DE_Descripcion: "konfierte Keulen, Leberpastete und Apfelpüree", IT_Descripcion: "cosce confit, paté di fegatini e purè di mele" },
    
    "COSTILLA DE ANGUS A BAJA TEMPERATURA": { EU_Nombre: "ANGUS SAIHESKIA TENPERATURA BAXUAN", EN_Nombre: "LOW TEMP ANGUS RIB", FR_Nombre: "CÔTE D'ANGUS BASSE TEMPÉRATURE", DE_Nombre: "ANGUS-RIPPE BEI NIEDRIGER TEMPERATUR", IT_Nombre: "COSTOLETTA DI ANGUS A BASSA TEMPERATURA" },
    "glaseada con puré de boniato": { EU_Descripcion: "boniato purearekin glaseatua", EN_Descripcion: "glazed with sweet potato purée", FR_Descripcion: "glacée à la purée de patate douce", DE_Descripcion: "glasiert mit Süßkartoffelpüree", IT_Descripcion: "glassata con purè di patate dolci" },
    
    "TXULETA DE VACA PREMIUM (Kg)": { EU_Nombre: "BEHI TXULETA PREMIUM (Kg)", EN_Nombre: "PREMIUM BEEF RIBEYE (Kg)", FR_Nombre: "CÔTE DE BOEUF PREMIUM (Kg)", DE_Nombre: "PREMIUM RINDERKOTULETT (Kg)", IT_Nombre: "COSTATA DI MANZO PREMIUM (Kg)" },
    "maduración 30 días, con su guarnición": { EU_Descripcion: "30 eguneko heltzea, bere garnizioarekin", EN_Descripcion: "30 days aged, with its garnish", FR_Descripcion: "maturation 30 jours, avec sa garniture", DE_Descripcion: "30 Tage gereift, mit Beilage", IT_Descripcion: "frollatura 30 giorni, con contorno" }
};

async function run() {
    console.log("Saving full translations...");
    const platosRef = collection(db, "restaurants/kanala-beach/platos");
    const snapshot = await getDocs(platosRef);
    
    const batch = writeBatch(db);
    let count = 0;
    
    snapshot.docs.forEach(d => {
        const p = d.data();
        const updates = {};
        let updated = false;
        
        // Name translations
        if (translations[p.ES_Nombre]) {
            Object.assign(updates, translations[p.ES_Nombre]);
            updated = true;
        }
        
        // Description translations
        if (p.Descripcion && translations[p.Descripcion]) {
            Object.assign(updates, translations[p.Descripcion]);
            updated = true;
        }
        
        if (updated) {
            batch.update(d.ref, updates);
            count++;
        }
    });
    
    if (count > 0) {
        await batch.commit();
        console.log(`Updated ${count} items with full translations!`);
    } else {
        console.log("No items needed updating.");
    }
    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
