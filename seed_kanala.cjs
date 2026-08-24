const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, writeBatch, collection } = require("firebase/firestore");

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

const kanala = {
    id: "kanala-beach",
    name: "Kanala Beach",
    slogan: "Propuesta gastronómica Jon Otxandio",
    theme: { font: "font-sans", style: "modern" },
    adminPassword: "1234",
    initialPlatos: [
        { ID_Plato: 1, ES_Nombre: "PALETILLA JOSELITO", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 24, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "100% Ibérico de bellota con pan tumaca" },
        { ID_Plato: 2, ES_Nombre: "CECINA WAGYU JAPONÉS", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 30, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "con pan de cristal" },
        { ID_Plato: 3, ES_Nombre: "CHORIZO IBÉRICO", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 16, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "corte a cuchillo" },
        { ID_Plato: 4, ES_Nombre: "FOIE MICUIT DE LA CASA", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 24, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "mermelada de manzana y jengibre" },
        { ID_Plato: 5, ES_Nombre: "ANCHOA DEL CANTÁBRICO ROYO", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 23, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["PESCADO"], Descripcion: "del golfo de Bizkaia, en salazón, método ancestral" },
        { ID_Plato: 6, ES_Nombre: "GAMBAS DE HUELVA A LA SAL (1 docena)", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 33, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["CRUSTACEOS"], Descripcion: "" },
        
        { ID_Plato: 7, ES_Nombre: "OSTRAS NATURAL", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 6, Categoria: "CARTA", Tipo: "MARISCO", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["MOLUSCOS"], Descripcion: "" },
        { ID_Plato: 8, ES_Nombre: "OSTRAS CON ATÚN", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 8, Categoria: "CARTA", Tipo: "MARISCO", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["MOLUSCOS", "PESCADO"], Descripcion: "salsa ponzu y ralladura de lima" },
        { ID_Plato: 9, ES_Nombre: "OSTRAS A LA BRASA", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 8, Categoria: "CARTA", Tipo: "MARISCO", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["MOLUSCOS"], Descripcion: "pil-pil, parmentier y wakame" },
        { ID_Plato: 10, ES_Nombre: "TOSTADA DE ATÚN", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 10, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["PESCADO"], Descripcion: "cremoso de aguacate y mayonesa chipotle" },
        { ID_Plato: 11, ES_Nombre: "TATAKI DE ATÚN ROJO", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 22, Categoria: "CARTA", Tipo: "PESCADO", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["PESCADO", "SOJA", "SESAMO"], Descripcion: "marinado en soja, emulsión de mango picante, salteado de algas y sésamo" },
        { ID_Plato: 12, ES_Nombre: "TALLARINES DE BEGIHANDI", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 15, Categoria: "CARTA", Tipo: "PESCADO", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["MOLUSCOS"], Descripcion: "sobre velo de su tinta y marmita de txipirón" },
        { ID_Plato: 13, ES_Nombre: "PULPO ASADO AL JOSPER", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 32, Categoria: "CARTA", Tipo: "PESCADO", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["MOLUSCOS"], Descripcion: "patata, pimentón crujiente y caldo dashi texturizado" },
        
        { ID_Plato: 14, ES_Nombre: "HONGOS SALTEADOS", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 24, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["HUEVOS"], Descripcion: "huevo a baja temperatura, royal de foie y jugo de champiñones" },
        { ID_Plato: 15, ES_Nombre: "ALCACHOFAS DE NAVARRA A LA BRASA", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 25, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["HUEVOS", "LACTEOS"], Descripcion: "yema de caserío y queso ganador del Último Lunes de Gernika" },
        { ID_Plato: 16, ES_Nombre: "VERDINAS GUISADAS", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 18, Categoria: "CARTA", Tipo: "ENTRANTE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["CRUSTACEOS"], Descripcion: "shiitake, oreja y gamba roja" },
        
        { ID_Plato: 17, ES_Nombre: "ARROZ DEL CHEF (Ración)", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 40, Categoria: "CARTA", Tipo: "ARROZ", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "Mínimo 2 personas. Propuesta refinada de temporada." },
        
        { ID_Plato: 18, ES_Nombre: "KOKOTXAS DE MERLUZA", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 32, Categoria: "CARTA", Tipo: "PESCADO", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["PESCADO"], Descripcion: "al pil-pil" },
        { ID_Plato: 19, ES_Nombre: "BACALAO CONFITADO", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 30, Categoria: "CARTA", Tipo: "PESCADO", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["PESCADO", "MOLUSCOS"], Descripcion: "sobre marmita de txipirones a lo Pelayo y tirabeques" },
        { ID_Plato: 20, ES_Nombre: "LUBINA", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 33, Categoria: "CARTA", Tipo: "PESCADO", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: ["PESCADO"], Descripcion: "salsa de curry verde, lima y patatas asadas" },
        
        { ID_Plato: 21, ES_Nombre: "PALETILLA DE CORDERO", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 36, Categoria: "CARTA", Tipo: "CARNE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "cocción a baja temperatura" },
        { ID_Plato: 22, ES_Nombre: "RABO DE GANADO MAYOR DESHUESADO", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 26, Categoria: "CARTA", Tipo: "CARNE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "pesto de choriceros, avellanas y kétchup de piquillos" },
        { ID_Plato: 23, ES_Nombre: "PECHUGA DE PICHÓN A LA BRASA", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 35, Categoria: "CARTA", Tipo: "CARNE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "muslos confitados, paté de sus hígados y puré de manzana" },
        { ID_Plato: 24, ES_Nombre: "COSTILLA DE ANGUS A BAJA TEMPERATURA", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 29.50, Categoria: "CARTA", Tipo: "CARNE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "glaseada con puré de boniato" },
        { ID_Plato: 25, ES_Nombre: "TXULETA DE VACA PREMIUM (Kg)", EU_Nombre: "", EN_Nombre: "", FR_Nombre: "", DE_Nombre: "", IT_Nombre: "", Precio: 90, Categoria: "CARTA", Tipo: "CARNE", Activo_Dia: true, Rol_Menu: null, Es_Racion: false, Alergenos: [], Descripcion: "maduración 30 días, con su guarnición" }
    ]
};

async function run() {
    console.log("Saving Kanala Beach app...");
    await setDoc(doc(db, 'restaurants', kanala.id), kanala);
    const batch = writeBatch(db);
    kanala.initialPlatos.forEach(p => {
        const docRef = doc(collection(db, `restaurants/${kanala.id}/platos`), p.ID_Plato.toString());
        batch.set(docRef, p);
    });
    await batch.commit();
    console.log("Kanala Beach saved successfully!");
    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
