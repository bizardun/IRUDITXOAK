import re

with open('types.ts', 'r') as f:
    content = f.read()

old_dict = """export interface TranslationDictionary {
    menuDelDia: string;
    carta: string;
    raciones: string;
    primerosPlatos: string;
    segundosPlatos: string;
    postres: string;
    precioPersona: string;
    infoAlergenos: string;
    mostrarAlergenos: string;
    ocultarAlergenos: string;
    tipos: { [key: string]: string };
    alergenos: { [key: string]: string };
    gestion?: GestionTranslations;
}"""

new_dict = """export interface TranslationDictionary {
    menuDelDia: string;
    carta: string;
    raciones: string;
    primerosPlatos: string;
    segundosPlatos: string;
    postres: string;
    precioPersona: string;
    infoAlergenos: string;
    mostrarAlergenos: string;
    ocultarAlergenos: string;
    ivaYDatos: string;
    visitarWeb: string;
    tipos: { [key: string]: string };
    alergenos: { [key: string]: string };
    gestion?: GestionTranslations;
}"""

if old_dict in content:
    content = content.replace(old_dict, new_dict)
    with open('types.ts', 'w') as f:
        f.write(content)
    print("Updated types.ts")
else:
    print("Could not find TranslationDictionary in types.ts")

with open('constants.ts', 'r') as f:
    constants = f.read()

# Add ES
constants = constants.replace(
    'ocultarAlergenos: "Ocultar Alérgenos",',
    'ocultarAlergenos: "Ocultar Alérgenos",\n        ivaYDatos: "I.V.A. INCLUIDO • DATOS EN TIEMPO REAL",\n        visitarWeb: "VISITAR WEB OFICIAL",'
)
# Add EU
constants = constants.replace(
    'ocultarAlergenos: "Alergenoak Ezkutatu",',
    'ocultarAlergenos: "Alergenoak Ezkutatu",\n        ivaYDatos: "BEZ BARNE • DATUAK DENBORA ERREALEAN",\n        visitarWeb: "WEB OFIZIALA BISITATU",'
)
# Add EN
constants = constants.replace(
    'ocultarAlergenos: "Hide Allergens",',
    'ocultarAlergenos: "Hide Allergens",\n        ivaYDatos: "V.A.T. INCLUDED • REAL-TIME DATA",\n        visitarWeb: "VISIT OFFICIAL WEBSITE",'
)
# Add FR
constants = constants.replace(
    'ocultarAlergenos: "Masquer Allergènes",',
    'ocultarAlergenos: "Masquer Allergènes",\n        ivaYDatos: "T.V.A. INCLUSE • DONNÉES EN TEMPS RÉEL",\n        visitarWeb: "VISITER LE SITE WEB OFFICIEL",'
)
# Add DE
constants = constants.replace(
    'ocultarAlergenos: "Allergene ausblenden",',
    'ocultarAlergenos: "Allergene ausblenden",\n        ivaYDatos: "MWST. INKLUSIVE • ECHTZEITDATEN",\n        visitarWeb: "OFFIZIELLE WEBSITE BESUCHEN",'
)
# Add IT
constants = constants.replace(
    'ocultarAlergenos: "Nascondi Allergeni",',
    'ocultarAlergenos: "Nascondi Allergeni",\n        ivaYDatos: "I.V.A. INCLUSA • DATI IN TEMPO REALE",\n        visitarWeb: "VISITA IL SITO UFFICIALE",'
)

with open('constants.ts', 'w') as f:
    f.write(constants)
print("Updated constants.ts")

