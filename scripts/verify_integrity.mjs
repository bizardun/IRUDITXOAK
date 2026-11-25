import fs from 'node:fs';
import path from 'node:path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const root = process.cwd();
const failures = [];
const passes = [];

function check(label, condition, detail = '') {
    if (condition) {
        passes.push(label);
        console.log(`✅ [OK] ${label}`);
    } else {
        failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
        console.error(`❌ [FALLO] ${label}${detail ? ` — ${detail}` : ''}`);
    }
}

function readText(relPath) {
    const full = path.join(root, relPath);
    if (!fs.existsSync(full)) return null;
    return fs.readFileSync(full, 'utf8');
}

// 1. Archivos de diseño y logos oficiales
const bolinaLogoPath = path.join(root, 'public', 'logo-bolina.jpg');
const bolinaLogoOk = fs.existsSync(bolinaLogoPath) && fs.statSync(bolinaLogoPath).size > 10000;
check('Archivo oficial del logo de Boliña existe (public/logo-bolina.jpg)', bolinaLogoOk);

const clienteApp = readText('components/cliente/ClienteApp.tsx') || '';
const gestionApp = readText('components/gestion/GestionApp.tsx') || '';
const gestionLogin = readText('components/gestion/GestionLogin.tsx') || '';
const gestionHome = readText('components/gestion/GestionHome.tsx') || '';
const gestionQR = readText('components/gestion/GestionQR.tsx') || '';
const factoryDashboard = readText('components/factory/FactoryDashboard.tsx') || '';
const appTsx = readText('App.tsx') || '';
const apiTs = readText('services/api.ts') || '';

// 2. Logos en todas las vistas
check(
    'Logo de Boliña presente en Cliente, Gestión (Login/Home), Cartel QR y Panel Maestro',
    clienteApp.includes('/logo-bolina.jpg') &&
        gestionLogin.includes('/logo-bolina.jpg') &&
        gestionHome.includes('/logo-bolina.jpg') &&
        gestionQR.includes('/logo-bolina.jpg') &&
        factoryDashboard.includes('/logo-bolina.jpg')
);

const kanalaLogoUrl = 'kanala-logos_LOGO-HORIZONTAL-zuria.png';
check(
    'Logo oficial de Kanala Beach presente en Cliente, Login Gestión, Cartel QR y Panel Maestro',
    clienteApp.includes(kanalaLogoUrl) &&
        gestionLogin.includes(kanalaLogoUrl) &&
        gestionQR.includes(kanalaLogoUrl) &&
        factoryDashboard.includes(kanalaLogoUrl)
);

// 3. Rutas y QR intactos (Cliente y Propietario)
check(
    'Rutas QR intactas (&client=true y &admin=true en GestionQR y FactoryDashboard)',
    gestionQR.includes('&client=true') &&
        gestionQR.includes('&admin=true') &&
        factoryDashboard.includes('&client=true') &&
        factoryDashboard.includes('&admin=true') &&
        appTsx.includes("get('admin') === 'true'")
);

// 4. Frase oficial del cartel QR
check(
    'Frase oficial del cartel QR intacta',
    gestionQR.includes('Para ver nuestra oferta gastronómica actualizada a día de hoy.')
);

// 5. Contraseña de propietario activa y editable desde Panel Maestro
check(
    'Acceso con contraseña de propietario activo en GestionApp y GestionLogin',
    gestionApp.includes('<GestionLogin') &&
        gestionApp.includes('admin_auth_') &&
        gestionLogin.includes('api.login(') &&
        apiTs.includes('adminPassword') &&
        factoryDashboard.includes('updateAppById')
);

// 6. Alérgenos visibles en Carta Cliente
check(
    'Alérgenos visibles y filtrables en ClienteApp',
    clienteApp.includes('p.Alergenos') &&
        clienteApp.includes('allergensToDisplay') &&
        clienteApp.includes('allergenColors')
);

// 7. Reglas de traducción IA (5 idiomas obligatorios + diccionario Kanala + Elhuyar)
const kanalaDictExists = fs.existsSync(path.join(root, 'src', 'data', 'kanala_dictionary.json'));
check(
    'Esquema de traducción IA exige los 5 idiomas (EU, EN, FR, DE, IT), diccionario Kanala y Elhuyar',
    kanalaDictExists &&
        apiTs.includes('required: ["EU", "EN", "FR", "DE", "IT"]') &&
        apiTs.includes('Elhuyar') &&
        apiTs.includes('kanalaDictionary')
);

// 8. Enlace a Web Oficial en Panel Maestro y Cliente
check(
    'Configuración y visualización de Web Oficial intactas',
    factoryDashboard.includes('Configurar Web Oficial') &&
        clienteApp.includes('officialWebsite')
);

// 9. Prohibición de Drag & Drop en Gestión
const gestionDir = path.join(root, 'components', 'gestion');
let hasDragDrop = false;
if (fs.existsSync(gestionDir)) {
    for (const file of fs.readdirSync(gestionDir)) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(path.join(gestionDir, file), 'utf8');
            if (/\bdraggable\b|onDragStart/.test(content)) {
                hasDragDrop = true;
            }
        }
    }
}
check('Sin Drag & Drop en Gestión (reordenamiento solo con flechas)', !hasDragDrop);

// 10. Verificación en vivo de traducciones y alérgenos en Firestore (solo lectura)
async function verifyFirestore() {
    const cfgRaw = readText('firebase-applet-config.json');
    if (!cfgRaw) {
        console.log('ℹ️  [INFO] firebase-applet-config.json no encontrado; omitiendo chequeo en vivo de Firestore.');
        return;
    }
    try {
        const cfg = JSON.parse(cfgRaw);
        const app = initializeApp(cfg);
        const db = getFirestore(app, cfg.firestoreDatabaseId || '(default)');
        const targets = ['kanala-beach', 'bolina_viejo_v1'];
        const langs = ['EU_Nombre', 'EN_Nombre', 'FR_Nombre', 'DE_Nombre', 'IT_Nombre'];

        for (const restId of targets) {
            const snap = await getDocs(collection(db, `restaurants/${restId}/platos`));
            let total = 0;
            let missingLang = 0;
            let withAllergens = 0;

            snap.forEach((docSnap) => {
                total++;
                const d = docSnap.data();
                const hasMissing = langs.some((k) => !d[k] || !String(d[k]).trim());
                if (hasMissing) missingLang++;
                if (Array.isArray(d.Alergenos) && d.Alergenos.length > 0) withAllergens++;
            });

            check(
                `Firestore [${restId}]: ${total} platos, 0 traducciones vacías y alérgenos presentes (${withAllergens} platos con alérgenos)`,
                total > 0 && missingLang === 0 && withAllergens > 0,
                `total=${total}, sinTraduccion=${missingLang}, conAlergenos=${withAllergens}`
            );
        }
    } catch (err) {
        console.warn(`⚠️  [AVISO] No se pudo conectar a Firestore para la verificación en vivo: ${err.message}`);
    }
}

await verifyFirestore();

console.log('\n----------------------------------------');
if (failures.length === 0) {
    console.log(`🎉 VERIFICACIÓN COMPLETADA: ${passes.length}/${passes.length} controles OK.`);
    process.exit(0);
} else {
    console.error(`🚨 VERIFICACIÓN FALLIDA: ${failures.length} problema(s) detectado(s).`);
    process.exit(1);
}
