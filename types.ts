
import type React from 'react';

export type RolMenu = "PRIMERO" | "SEGUNDO" | "POSTRE" | "RACION" | null;
export type TipoPlato = "ENTRANTE" | "ENSALADA" | "ARROZ" | "MARISCO" | "PESCADO" | "CARNE" | "POSTRE";
export type TipoPlatoInput = TipoPlato | "PRIMERO" | "SEGUNDO";

export type Alergeno = "GLUTEN" | "CRUSTACEOS" | "HUEVOS" | "PESCADO" | "CACAHUETES" | "SOJA" | "LACTEOS" | "APIO" | "MOSTAZA" | "SESAMO" | "SULFITOS" | "ALTRAMUCES" | "MOLUSCOS";

export interface Plato {
    ID_Plato: number;
    Precio: number;
    ES_Nombre: string;
    EU_Nombre: string;
    EN_Nombre: string;
    FR_Nombre: string;
    DE_Nombre: string;
    IT_Nombre: string;
    Categoria: string; // "CARTA", "MENU", "CARTA,MENU", etc.
    Tipo: TipoPlato;
    Activo_Dia: boolean;
    Rol_Menu: RolMenu;
    Es_Racion: boolean; 
    Alergenos: Alergeno[];
    [key: string]: string | number | boolean | null | undefined | Alergeno[];
}

export interface ThemeConfig {
    font: 'font-lora' | 'font-inter' | 'font-serif' | 'font-sans';
    style: 'classic' | 'modern' | 'fresh';
}

export interface RestaurantConfig {
    id: string;
    name: string;
    slogan: string;
    initialPlatos: Plato[];
    theme?: ThemeConfig;
}

export interface Language {
    code: 'ES' | 'EU' | 'EN' | 'FR' | 'DE' | 'IT';
    name: string;
    flag: React.ComponentType;
}

export interface GestionTranslations {
    panel: string;
    volver: string;
    anadir: string;
    precioMenu: string;
    guardar: string;
    plato: string;
    rol: string;
    precio: string;
    activo: string;
    sinPlatos: string;
    actualizar: string;
    buscando: string;
    traduciendo: string;
}

export interface TranslationDictionary {
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
}

export interface Translations {
    [key: string]: TranslationDictionary;
}