import React, { useState, useEffect } from "react";
import {
  CalendarDays, PlusCircle, MessageCircle, User, MapPin, Clock, Users,
  BadgeCheck, ChevronLeft, Send, Search, HeartHandshake,
  ShieldCheck, FileCheck, Inbox, Star, Sparkles, ShieldAlert,
  Crown, Building2, Check, Bus, TreePine, Landmark, Accessibility,
  Map as MapIcon, List, ChevronRight, Navigation, Phone, Play, Square, X,
  LogOut, Loader2, Eye, EyeOff, Upload, CreditCard,
} from "lucide-react";
import { supabase, errorAuthEnEspanol } from "./lib/supabase.js";
import { APIProvider, Map as GoogleMap, AdvancedMarker } from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/* ------------------------------------------------------------------ */
/*  Ronda — prototipo completo: registro por rol + app AT + app familia */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap');
.rd-root { font-family: 'Nunito', system-ui, sans-serif; color: #242B54; }
.rd-display { font-family: 'Baloo 2', 'Nunito', sans-serif; }
.rd-card { background: #FFFFFF; border: 1px solid #E7E8F3; border-radius: 20px; box-shadow: 0 1px 3px rgba(36,43,84,0.05); }
.rd-input { background:#FFFFFF; border:1px solid #D9DBEC; color:#242B54; width:100%; }
.rd-input:focus { outline: 2px solid #17A398; outline-offset: 1px; }
button:focus-visible { outline: 2px solid #17A398; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

const VERDE = "#17A398";           /* teal del logo */
const CORAL = "#F0565A";           /* coral del corazón — acciones principales */
const NAVY = "#242B54";            /* navy del wordmark — headers */
const PAPEL = "#F0F1F9";
const TINTA = "#242B54";
const GRIS = "#767C9B";
const AMBAR = "#F2A71B";

/* logo oficial de la marca, sin fondo blanco. "blanco" para fondos navy/oscuros */
const LogoRondas = ({ size = 44, variant = "color" }) => (
  <img src={variant === "blanco" ? "/logo-blanco.png" : "/logo-color.png"} width={size} height={size}
    alt="rondas — Red de acompañamiento terapéutico" style={{ objectFit: "contain" }} />
);

export const RONDAS_BRAND = { VERDE, CORAL, NAVY, PAPEL, TINTA, GRIS, AMBAR };
export { LogoRondas };

const POB_COLOR = {
  "Niñez": "#F2A71B",
  "Adolescencia": "#8B6FC9",
  "Adultos": "#2E86C1",
  "Adultos mayores": "#EF5A5A",
};

/* cobertura geográfica: provincia -> ciudades/barrios. "zona" en los datos sigue
   siendo el nombre de ciudad/barrio, para no romper el filtrado existente. */
const PROVINCIAS = {
  "Buenos Aires (CABA, GBA e interior)": ["Palermo", "Recoleta", "Caballito", "Belgrano", "San Telmo", "Villa Urquiza", "Flores", "San Isidro", "Vicente López", "La Plata", "Mar del Plata", "Bahía Blanca"],
  "Catamarca": ["San Fernando del Valle de Catamarca"],
  "Chaco": ["Resistencia"],
  "Chubut": ["Comodoro Rivadavia", "Trelew"],
  "Córdoba": ["Córdoba Capital", "Villa Carlos Paz", "Río Cuarto"],
  "Corrientes": ["Corrientes Capital"],
  "Entre Ríos": ["Paraná", "Concordia"],
  "Formosa": ["Formosa Capital"],
  "Jujuy": ["San Salvador de Jujuy"],
  "La Pampa": ["Santa Rosa"],
  "La Rioja": ["La Rioja Capital"],
  "Mendoza": ["Mendoza Capital", "Godoy Cruz"],
  "Misiones": ["Posadas", "Puerto Iguazú"],
  "Neuquén": ["Neuquén Capital", "Plottier"],
  "Río Negro": ["Bariloche", "Viedma"],
  "Salta": ["Salta Capital"],
  "San Juan": ["San Juan Capital"],
  "San Luis": ["San Luis Capital"],
  "Santa Cruz": ["Río Gallegos"],
  "Santa Fe": ["Rosario", "Santa Fe Capital"],
  "Santiago del Estero": ["Santiago del Estero Capital"],
  "Tierra del Fuego": ["Ushuaia", "Río Grande"],
  "Tucumán": ["San Miguel de Tucumán", "Yerba Buena"],
};
const ZONAS = Object.values(PROVINCIAS).flat();

/* coordenadas reales (lat, lng) de cada ciudad/barrio, para el mapa de Google */
const COORDS_REALES = {
  "Palermo": [-34.5875, -58.4205], "Recoleta": [-34.5875, -58.3931], "Caballito": [-34.6178, -58.4413],
  "Belgrano": [-34.5627, -58.4583], "San Telmo": [-34.6212, -58.3731], "Villa Urquiza": [-34.5751, -58.4864],
  "Flores": [-34.6289, -58.4633], "San Isidro": [-34.4708, -58.5074], "Vicente López": [-34.5267, -58.4772],
  "La Plata": [-34.9215, -57.9545], "Mar del Plata": [-38.0055, -57.5426], "Bahía Blanca": [-38.7183, -62.2663],
  "San Fernando del Valle de Catamarca": [-28.4696, -65.7852],
  "Resistencia": [-27.4512, -58.9867],
  "Comodoro Rivadavia": [-45.8641, -67.4966], "Trelew": [-43.2489, -65.3051],
  "Córdoba Capital": [-31.4201, -64.1888], "Villa Carlos Paz": [-31.4241, -64.4978], "Río Cuarto": [-33.1232, -64.3496],
  "Corrientes Capital": [-27.4692, -58.8306],
  "Paraná": [-31.7333, -60.5238], "Concordia": [-31.3928, -58.0209],
  "Formosa Capital": [-26.1775, -58.1781],
  "San Salvador de Jujuy": [-24.1858, -65.2995],
  "Santa Rosa": [-36.6167, -64.2833],
  "La Rioja Capital": [-29.4130, -66.8506],
  "Mendoza Capital": [-32.8895, -68.8458], "Godoy Cruz": [-32.9264, -68.8508],
  "Posadas": [-27.3671, -55.8961], "Puerto Iguazú": [-25.5952, -54.5734],
  "Neuquén Capital": [-38.9516, -68.0591], "Plottier": [-38.9667, -68.2333],
  "Bariloche": [-41.1335, -71.3103], "Viedma": [-40.8135, -63.0000],
  "Salta Capital": [-24.7859, -65.4117],
  "San Juan Capital": [-31.5375, -68.5364],
  "San Luis Capital": [-33.2950, -66.3356],
  "Río Gallegos": [-51.6230, -69.2168],
  "Rosario": [-32.9468, -60.6393], "Santa Fe Capital": [-31.6333, -60.7000],
  "Santiago del Estero Capital": [-27.7951, -64.2615],
  "Ushuaia": [-54.8019, -68.3030], "Río Grande": [-53.7877, -67.7085],
  "San Miguel de Tucumán": [-26.8241, -65.2226], "Yerba Buena": [-26.8167, -65.3167],
};

/* distancia real entre dos coordenadas (fórmula de Haversine) */
const distanciaKm = (a, b) => {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLng = (b[1] - a[1]) * Math.PI / 180;
  const lat1 = a[0] * Math.PI / 180, lat2 = b[0] * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};
const ZonaOptions = () => (
  <>
    {Object.entries(PROVINCIAS).map(([prov, ciudades]) => (
      <optgroup key={prov} label={prov}>
        {ciudades.map((z) => <option key={z} value={z}>{z}</option>)}
      </optgroup>
    ))}
  </>
);

const POBLACIONES = ["Niñez", "Adolescencia", "Adultos", "Adultos mayores"];
const AREAS = ["TEA", "TDAH", "Salud mental", "Discapacidad motriz", "Deterioro cognitivo", "Integración escolar"];

/* ---------- datos demo ---------- */

const SALIDAS_INICIALES = [
  { id: 1, titulo: "Museo Participativo de Ciencias", zona: "Recoleta", lugar: "Junín 1930 — entrada del CC Recoleta", fecha: "Sáb 4 Jul", hora: "15:00", poblacion: "Niñez", rango: "6 a 10 años", cupo: 4, participantes: ["Marina L.", "Diego S."], notas: "Espacio con mucho estímulo sonoro; hay sala tranquila disponible. Entrada accesible.", creador: "Marina L." },
  { id: 2, titulo: "Tarde en Plaza Armenia", zona: "Palermo", lugar: "Punto de encuentro: la calesita", fecha: "Dom 5 Jul", hora: "16:30", poblacion: "Niñez", rango: "4 a 8 años", cupo: 3, participantes: ["Julián R."], notas: "Juegos inclusivos renovados. Cada AT lleva merienda para su acompañado.", creador: "Julián R." },
  { id: 3, titulo: "Recorrido Jardín Botánico", zona: "Palermo", lugar: "Entrada Av. Santa Fe 3951", fecha: "Sáb 11 Jul", hora: "10:30", poblacion: "Adultos mayores", rango: "65+", cupo: 3, participantes: ["Carmen A.", "Pablo N."], notas: "Ritmo pausado, con paradas en bancos cada tramo. Sombra casi todo el recorrido.", creador: "Carmen A." },
  { id: 4, titulo: "Museo Moderno + café", zona: "San Telmo", lugar: "Av. San Juan 350", fecha: "Dom 12 Jul", hora: "14:00", poblacion: "Adultos", rango: "25 a 45 años", cupo: 4, participantes: ["Lucía F."], notas: "Grupo de salud mental. Visita guiada corta y café en el bar del museo después.", creador: "Lucía F." },
  { id: 5, titulo: "Mañana en el Ecoparque", zona: "Palermo", lugar: "Entrada Av. Sarmiento 2725", fecha: "Sáb 18 Jul", hora: "11:00", poblacion: "Adolescencia", rango: "12 a 16 años", cupo: 3, participantes: ["Nico T.", "Vera M."], notas: "Recorrido corto con foco en la socialización entre pares.", creador: "Nico T." },
];

const CHATS_INICIALES = {
  1: [
    { autor: "Marina L.", texto: "¡Hola! Confirmo punto de encuentro en la entrada del CC Recoleta, 14:45.", hora: "10:12" },
    { autor: "Diego S.", texto: "Perfecto. Llevo pictogramas de anticipación por si alguno los necesita.", hora: "10:30" },
  ],
  2: [{ autor: "Julián R.", texto: "Si llueve lo pasamos al domingo siguiente, ¿ok?", hora: "09:05" }],
  3: [
    { autor: "Carmen A.", texto: "Reservé la visita guiada de las 11. Somos flexibles con el ritmo.", hora: "18:40" },
    { autor: "Pablo N.", texto: "Genial. Mi acompañado usa bastón, el recorrido corto le viene bien.", hora: "19:02" },
  ],
  4: [{ autor: "Lucía F.", texto: "La guiada dura 40 min. Después el café es opcional pero suma un montón.", hora: "12:15" }],
  5: [{ autor: "Vera M.", texto: "Los chicos ya se conocen de la salida anterior, va a estar bueno.", hora: "17:20" }],
};

const DIRECTORIO_ATS = [
  { nombre: "Marina López", zona: "Recoleta", poblaciones: ["Niñez"], areas: ["TEA", "Integración escolar"], salidas: 24, exp: "8 años de experiencia", dispo: "Lunes a viernes por la tarde", verificado: true, bio: "Trabajo con niños dentro del espectro autista, con foco en salidas recreativas como espacio terapéutico. Articulo con escuelas y equipos tratantes." },
  { nombre: "Diego Suárez", zona: "Caballito", poblaciones: ["Niñez", "Adolescencia"], areas: ["TEA", "TDAH"], salidas: 18, exp: "5 años de experiencia", dispo: "Fines de semana", verificado: true, bio: "Acompaño procesos de niños y adolescentes con TEA y TDAH. Uso apoyos visuales y anticipación para que cada salida sea predecible y disfrutable." },
  { nombre: "Carmen Aguirre", zona: "Palermo", poblaciones: ["Adultos mayores"], areas: ["Deterioro cognitivo", "Discapacidad motriz"], salidas: 31, exp: "12 años de experiencia", dispo: "Mañanas", verificado: true, bio: "Especializada en adultos mayores. Diseño salidas a ritmo pausado que sostienen la autonomía, la memoria y el vínculo con el barrio." },
  { nombre: "Lucía Ferreyra", zona: "San Telmo", poblaciones: ["Adultos"], areas: ["Salud mental"], salidas: 15, exp: "6 años de experiencia", dispo: "Tardes y fines de semana", verificado: true, bio: "Acompaño a adultos en tratamiento de salud mental. Las salidas culturales grupales son parte central de mi forma de trabajar la reinserción social." },
  { nombre: "Julián Ríos", zona: "Palermo", poblaciones: ["Niñez"], areas: ["TEA", "Integración escolar"], salidas: 9, exp: "3 años de experiencia", dispo: "Horarios flexibles", verificado: false, bio: "AT recibido en 2023. Trabajo con niños pequeños, coordinando siempre con la familia y el equipo terapéutico." },
  { nombre: "Vera Molina", zona: "Belgrano", poblaciones: ["Adolescencia", "Adultos"], areas: ["Salud mental", "TDAH"], salidas: 21, exp: "7 años de experiencia", dispo: "Lunes a sábado", verificado: true, bio: "Acompaño adolescentes y adultos jóvenes. Creo en el grupo entre pares como motor del proceso: por eso organizo muchas salidas compartidas." },
  { nombre: "Rocío Medina", zona: "Córdoba Capital", poblaciones: ["Niñez", "Adolescencia"], areas: ["TEA", "Integración escolar"], salidas: 12, exp: "4 años de experiencia", dispo: "Lunes a viernes por la mañana", verificado: true, bio: "Acompaño a niños y adolescentes con TEA en escuelas y salidas recreativas por el centro y las sierras de Córdoba." },
  { nombre: "Tomás Ibarra", zona: "Rosario", poblaciones: ["Adultos"], areas: ["Salud mental"], salidas: 8, exp: "4 años de experiencia", dispo: "Tardes", verificado: true, bio: "Trabajo con adultos en tratamiento de salud mental, organizando salidas grupales por la costanera y el centro de Rosario." },
  { nombre: "Florencia Reyes", zona: "Mendoza Capital", poblaciones: ["Adultos mayores"], areas: ["Deterioro cognitivo"], salidas: 14, exp: "6 años de experiencia", dispo: "Mañanas", verificado: false, bio: "Especializada en adultos mayores, con salidas de ritmo pausado por los parques y espacios verdes de Mendoza." },
];

/* ---------- guía "Gratis con CUD": cobertura federal ---------- */

const CUD_PROVINCIAS = [
  "Nacional", "CABA", "GBA / PBA", "Mar del Plata", "Córdoba",
  "Rosario / Santa Fe", "Patagonia (Río Negro)", "NOA (Salta)", "Misiones",
];

const CUD_BADGES = {
  "gratis-cud": { label: "Gratis con CUD", color: VERDE },
  "descuento-cud": { label: "Descuento con CUD", color: AMBAR },
  "gratis-todos": { label: "Gratis para todos", color: GRIS },
};

const CUD_ACTIVIDADES_INICIALES = [
  // --- NACIONAL ---
  { id: 1, nombre: "Transporte urbano (colectivos, subte, trenes)", provincia: "Nacional", zona: "Todo el país", tipo: "transporte", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Sin cargo mostrando CUD y DNI al ascender. Acompañante gratis si el CUD lo indica.", acompanante: "Si el CUD lo indica", reserva: null, estado: "aprobada" },
  { id: 2, nombre: "Micros y trenes de larga distancia", provincia: "Nacional", zona: "Todo el país", tipo: "transporte", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Pasaje sin cargo a cualquier destino nacional. Acompañante incluido si el CUD lo indica.", acompanante: "Si el CUD lo indica", reserva: "Gestionar mínimo 48hs antes (online en Trenes Argentinos con N° de CUD, o en boletería)", estado: "aprobada" },
  { id: 3, nombre: "Parques Nacionales (Iguazú, Nahuel Huapi, Los Glaciares y todos)", provincia: "Nacional", zona: "Todo el país", tipo: "parque", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Entrada gratuita. Acompañante incluido si consta en el CUD.", acompanante: "Si consta en el CUD", reserva: null, estado: "aprobada" },
  { id: 4, nombre: "Cines, teatros, recitales y eventos deportivos", provincia: "Nacional", zona: "Todo el país", tipo: "espectaculo", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Ley 22.431: ingreso sin costo con CUD físico o digital, con ubicaciones preferenciales. En eventos privados puede variar según normativa local.", acompanante: null, reserva: "Algunos requieren acreditación previa", estado: "aprobada" },

  // --- CABA ---
  { id: 5, nombre: "Museo Participativo de Ciencias \"Prohibido NO Tocar\"", provincia: "CABA", zona: "Recoleta", tipo: "museo", poblaciones: ["Niñez", "Adolescencia"], badge: "gratis-cud", descripcion: "Entrada gratuita para la persona con CUD.", acompanante: "Sí", reserva: "Grupos de +10: reservar con un mes de anticipación", estado: "aprobada" },
  { id: 6, nombre: "Teatro Colón - visita guiada", provincia: "CABA", zona: "San Nicolás", tipo: "cultural", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Visita guiada sin cargo con CUD.", acompanante: "Sí", reserva: null, estado: "aprobada" },
  { id: 7, nombre: "Museo de los Niños Abasto", provincia: "CABA", zona: "Abasto", tipo: "museo", poblaciones: ["Niñez"], badge: "gratis-cud", descripcion: "Entrada gratuita para la persona con CUD.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 8, nombre: "Planetario Galileo Galilei", provincia: "CABA", zona: "Palermo", tipo: "espectaculo", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Entrada sin cargo para personas con CUD y su acompañante, en todas las funciones.", acompanante: "Sí", reserva: "Sacar entrada sin cargo online", estado: "aprobada" },
  { id: 9, nombre: "MALBA", provincia: "CABA", zona: "Palermo", tipo: "museo", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Entrada gratuita con CUD.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 10, nombre: "Museo de River", provincia: "CABA", zona: "Núñez", tipo: "museo", poblaciones: ["Adolescencia", "Adultos"], badge: "gratis-cud", descripcion: "Entrada gratuita con CUD.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 11, nombre: "Museo de Boca", provincia: "CABA", zona: "La Boca", tipo: "museo", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Lunes a viernes con certificado y DNI.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 12, nombre: "Ecoparque", provincia: "CABA", zona: "Palermo", tipo: "parque", poblaciones: POBLACIONES, badge: "gratis-todos", descripcion: "Entrada gratuita para todo público.", acompanante: null, reserva: "Reserva online", estado: "aprobada" },
  { id: 13, nombre: "Museo Nacional de Bellas Artes", provincia: "CABA", zona: "Recoleta", tipo: "museo", poblaciones: POBLACIONES, badge: "gratis-todos", descripcion: "Entrada siempre gratuita para todo público.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 14, nombre: "Museo Histórico Nacional", provincia: "CABA", zona: "San Telmo", tipo: "museo", poblaciones: POBLACIONES, badge: "gratis-todos", descripcion: "Entrada gratuita todos los días para todo público.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 15, nombre: "Usina del Arte y Centro Cultural Recoleta", provincia: "CABA", zona: "La Boca / Recoleta", tipo: "cultural", poblaciones: POBLACIONES, badge: "gratis-todos", descripcion: "Espacios con rampas, entrada libre.", acompanante: null, reserva: null, estado: "aprobada" },

  // --- GBA / PBA ---
  { id: 16, nombre: "Temaikén", provincia: "GBA / PBA", zona: "Escobar", tipo: "parque", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Acompañante gratis SOLO si el CUD lo indica; si no, paga entrada regular.", acompanante: "Solo si el CUD lo indica", reserva: null, estado: "aprobada" },
  { id: 17, nombre: "Parque de la Costa", provincia: "GBA / PBA", zona: "Tigre", tipo: "parque", poblaciones: POBLACIONES, badge: "descuento-cud", descripcion: "Pasaporte bonificado para persona con certificado y acompañante.", acompanante: "Incluido en el pasaporte bonificado", reserva: null, estado: "aprobada" },
  { id: 18, nombre: "Tecnópolis", provincia: "GBA / PBA", zona: "Villa Martelli", tipo: "parque", poblaciones: POBLACIONES, badge: "gratis-todos", descripcion: "Entradas gratuitas con reserva online; algunas propuestas son pagas.", acompanante: null, reserva: "Entradas gratuitas con reserva online", estado: "aprobada" },
  { id: 19, nombre: "Planetario de La Plata", provincia: "GBA / PBA", zona: "La Plata", tipo: "espectaculo", poblaciones: POBLACIONES, badge: "gratis-todos", descripcion: "Funciones gratuitas fines de semana.", acompanante: null, reserva: null, estado: "aprobada" },

  // --- MAR DEL PLATA ---
  { id: 20, nombre: "Aquarium", provincia: "Mar del Plata", zona: "Mar del Plata", tipo: "parque", poblaciones: POBLACIONES, badge: "descuento-cud", descripcion: "40% de descuento con CUD en boletería; acompañante con igual descuento si el CUD lo indica.", acompanante: "Igual descuento si el CUD lo indica", reserva: null, estado: "aprobada" },
  { id: 21, nombre: "Aquopolis", provincia: "Mar del Plata", zona: "Mar del Plata", tipo: "parque", poblaciones: POBLACIONES, badge: "descuento-cud", descripcion: "Una única entrada para la persona y su acompañante (ordenanza municipal).", acompanante: "Incluido en la única entrada", reserva: null, estado: "aprobada" },

  // --- CÓRDOBA ---
  { id: 22, nombre: "Museos Caraffa, Palacio Ferreyra y Palacio Dionisi", provincia: "Córdoba", zona: "Córdoba Capital", tipo: "museo", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Gratis todos los días con CUD; miércoles gratis para todos.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 23, nombre: "Museo Histórico de la UNC", provincia: "Córdoba", zona: "Córdoba Capital", tipo: "museo", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Entrada gratuita con CUD.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 24, nombre: "Cripta Jesuítica y Museo de la Industria", provincia: "Córdoba", zona: "Córdoba Capital", tipo: "cultural", poblaciones: POBLACIONES, badge: "gratis-todos", descripcion: "Entrada gratuita para todo público.", acompanante: null, reserva: null, estado: "aprobada" },

  // --- ROSARIO / SANTA FE ---
  { id: 25, nombre: "Acuario del Río Paraná", provincia: "Rosario / Santa Fe", zona: "Rosario", tipo: "parque", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Ingreso sin cargo para personas con discapacidad.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 26, nombre: "Costanera y parques públicos", provincia: "Rosario / Santa Fe", zona: "Rosario", tipo: "parque", poblaciones: POBLACIONES, badge: "gratis-todos", descripcion: "Espacios públicos de acceso libre y gratuito.", acompanante: null, reserva: null, estado: "aprobada" },

  // --- PATAGONIA (RÍO NEGRO) ---
  { id: 27, nombre: "Parque Nacional Nahuel Huapi", provincia: "Patagonia (Río Negro)", zona: "Bariloche", tipo: "parque", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Entrada gratuita para personas con CUD y su acompañante.", acompanante: "Sí", reserva: null, estado: "aprobada" },
  { id: 28, nombre: "Cerro Catedral - medios de elevación", provincia: "Patagonia (Río Negro)", zona: "Bariloche", tipo: "parque", poblaciones: POBLACIONES, badge: "descuento-cud", descripcion: "50% con CUD (físico o digital en Mi Argentina) + DNI; acompañante certificado: 30%.", acompanante: "30% de descuento", reserva: null, estado: "aprobada" },
  { id: 29, nombre: "Teleférico Cerro Otto", provincia: "Patagonia (Río Negro)", zona: "Bariloche", tipo: "parque", poblaciones: POBLACIONES, badge: "descuento-cud", descripcion: "Persona con CUD sin cargo en promociones vigentes; acompañante abona tarifa. Confirmar condiciones del día.", acompanante: "Abona tarifa", reserva: null, estado: "aprobada" },

  // --- NOA (SALTA) ---
  { id: 30, nombre: "Tren a las Nubes", provincia: "NOA (Salta)", zona: "Salta Capital", tipo: "transporte", poblaciones: POBLACIONES, badge: "descuento-cud", descripcion: "Descuento con CUD para la persona y su acompañante certificado.", acompanante: null, reserva: "Iniciar trámite 30 días antes por mail a ventas o en oficina comercial, con certificado, DNI y datos del acompañante", estado: "aprobada" },

  // --- MISIONES ---
  { id: 31, nombre: "Cine IMAX y Las Tipas", provincia: "Misiones", zona: "Posadas", tipo: "espectaculo", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Entrada gratuita con CUD.", acompanante: null, reserva: null, estado: "aprobada" },
  { id: 32, nombre: "Parque Nacional Iguazú", provincia: "Misiones", zona: "Puerto Iguazú", tipo: "parque", poblaciones: POBLACIONES, badge: "gratis-cud", descripcion: "Entrada gratuita para personas con CUD y su acompañante.", acompanante: "Sí", reserva: null, estado: "aprobada" },

  // --- PENDIENTES: la IA las encontró pero todavía no fueron revisadas por un humano.
  // En producción, este listado se alimenta de la API de Anthropic con la
  // herramienta de web search, y cada resultado cae en una cola de moderación
  // en la base de datos hasta que alguien del equipo lo aprueba o descarta acá.
  { id: 33, nombre: "Teleférico San Bernardo", provincia: "NOA (Salta)", zona: "Salta Capital", tipo: "parque", poblaciones: POBLACIONES, badge: "descuento-cud", descripcion: "Posible beneficio CUD, sin confirmación oficial publicada.", acompanante: null, reserva: null, estado: "pendiente" },
  { id: 34, nombre: "Tríptico de la Infancia", provincia: "Rosario / Santa Fe", zona: "Rosario", tipo: "museo", poblaciones: POBLACIONES, badge: "descuento-cud", descripcion: "Entrada de bajo costo; beneficio CUD a confirmar en boletería.", acompanante: null, reserva: null, estado: "pendiente" },
];

/* ---------- piezas ---------- */

const MapsProvider = ({ children }) =>
  GOOGLE_MAPS_KEY ? <APIProvider apiKey={GOOGLE_MAPS_KEY}>{children}</APIProvider> : <>{children}</>;

function Avatar({ nombre, size = 32, destacado = false }) {
  const ini = nombre.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center justify-center rounded-full font-semibold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38, background: destacado ? VERDE : "#DFF3F1", color: destacado ? "#fff" : VERDE, border: "2px solid #fff" }}
      title={nombre}>
      {ini}
    </div>
  );
}

function ChipPob({ poblacion, rango }) {
  const c = POB_COLOR[poblacion];
  return (
    <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: c + "1F", color: c }}>
      {poblacion}{rango ? ` · ${rango}` : ""}
    </span>
  );
}

function CupoDots({ salida, joined, yo }) {
  const libres = salida.cupo - salida.participantes.length;
  return (
    <div className="flex items-center gap-2">
      <div className="flex" style={{ marginLeft: 2 }}>
        {salida.participantes.map((p, i) => (
          <div key={p + i} style={{ marginLeft: i === 0 ? 0 : -8 }}>
            <Avatar nombre={p} size={28} destacado={p === yo && joined} />
          </div>
        ))}
        {Array.from({ length: Math.max(libres, 0) }).map((_, i) => (
          <div key={"v" + i} className="rounded-full flex items-center justify-center"
            style={{ width: 28, height: 28, marginLeft: -8, border: "2px dashed #C9C7BB", background: "#FAFBFE", color: "#9BA0BC", fontSize: 13 }}>
            +
          </div>
        ))}
      </div>
      <span className="text-xs" style={{ color: libres > 0 ? GRIS : "#E14D50", fontWeight: 600 }}>
        {libres > 0 ? `${libres} lugar${libres > 1 ? "es" : ""} libre${libres > 1 ? "s" : ""}` : "Cupo completo"}
      </span>
    </div>
  );
}

function MultiChips({ opciones, valores, onToggle, colorMap }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => {
        const activo = valores.includes(o);
        const c = colorMap ? colorMap[o] : VERDE;
        return (
          <button key={o} type="button" onClick={() => onToggle(o)}
            className="text-xs px-3 py-2 rounded-full font-semibold flex items-center gap-1.5"
            style={activo ? { background: c || VERDE, color: "#fff" } : { background: "#fff", border: "1px solid #D8D6CB", color: TINTA }}>
            {activo && <Check size={12} strokeWidth={3} />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Checkbox({ checked, onChange, disabled, children }) {
  return (
    <button type="button" disabled={disabled} onClick={onChange}
      className="flex items-start gap-2.5 text-left w-full"
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      <span className="flex-shrink-0 flex items-center justify-center rounded-md"
        style={{ width: 20, height: 20, marginTop: 1, background: checked ? VERDE : "#fff", border: "1.5px solid " + (checked ? VERDE : "#D9DBEC") }}>
        {checked && <Check size={13} strokeWidth={3} color="#fff" />}
      </span>
      <span className="text-sm" style={{ color: "#3C4368" }}>{children}</span>
    </button>
  );
}

function Campo({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium" style={{ color: GRIS }}>{label}</span>
      {children}
    </label>
  );
}

function CardSeccion({ titulo, children }) {
  return (
    <div className="flex flex-col gap-4" style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 2px 8px rgba(46,49,96,0.06)" }}>
      <p className="text-xs font-semibold" style={{ color: VERDE }}>{titulo}</p>
      {children}
    </div>
  );
}

function CampoPassword({ label, value, onChange, placeholder, visible, onToggleVisible }) {
  return (
    <Campo label={label}>
      <div className="relative">
        <input type={visible ? "text" : "password"} className="rd-input rounded-xl px-3 py-3 text-sm" style={{ paddingRight: 40 }}
          placeholder={placeholder} value={value} onChange={onChange} />
        <button type="button" onClick={onToggleVisible} aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute" style={{ right: 12, top: "50%", transform: "translateY(-50%)", color: GRIS }}>
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </Campo>
  );
}

function BotonPrimario({ onClick, children, icon: Icon, color = CORAL }) {
  const sombra = color === VERDE ? "rgba(23,163,152,0.3)" : "rgba(240,86,90,0.3)";
  return (
    <button onClick={onClick} className="w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2"
      style={{ background: color, color: "#fff", boxShadow: `0 4px 12px ${sombra}` }}>
      {Icon && <Icon size={16} />}{children}
    </button>
  );
}

/* ================================================================== */

export default function RondaApp() {
  /* navegación global */
  const [pantalla, setPantalla] = useState("bienvenida"); // bienvenida | login | registroAT | registroFam | app
  const [rol, setRol] = useState(null); // 'at' | 'familia'
  const [toast, setToast] = useState(null);
  const avisar = (t) => { setToast(t); setTimeout(() => setToast(null), 2400); };

  /* --- auth real (Supabase) --- */
  const [usuario, setUsuario] = useState(null); // sesión de supabase.auth
  const [perfilId, setPerfilId] = useState(null); // profiles.id (== usuario.id)
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [cargandoAuth, setCargandoAuth] = useState(false);
  const [errorAuth, setErrorAuth] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [verPassAT, setVerPassAT] = useState(false);
  const [verPassFam, setVerPassFam] = useState(false);

  useEffect(() => {
    let activo = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!activo) return;
      setUsuario(session?.user ?? null);
      setCargandoSesion(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUsuario(session?.user ?? null);
    });
    return () => { activo = false; listener.subscription.unsubscribe(); };
  }, []);

  /* al detectar una sesión activa (login o refresh de página), traer el perfil real */
  useEffect(() => {
    if (!usuario || perfilId === usuario.id) return;
    (async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", usuario.id).single();
      if (error || !data) return;
      setPerfilId(data.id);
      setRol(data.rol);
      if (data.rol === "at") {
        setRegAT((p) => ({ ...p, nombre: data.nombre, zona: data.zona || p.zona, provincia: data.provincia || p.provincia, poblaciones: data.poblaciones || [], areas: data.areas || [], exp: data.experiencia || p.exp, cert: !!data.verificado }));
      } else {
        setRegFam((p) => ({ ...p, nombre: data.nombre, zona: data.zona || p.zona, provincia: data.provincia || p.provincia, areas: data.areas || [] }));
      }
      setPantalla("app");
    })();
  }, [usuario, perfilId]);

  /* registro AT */
  const [regAT, setRegAT] = useState({ nombre: "", email: "", password: "", provincia: "Buenos Aires (CABA, GBA e interior)", zona: "Palermo", poblaciones: [], areas: [], exp: "1 a 3 años", cert: false });
  /* registro familia */
  const [regFam, setRegFam] = useState({ nombre: "", email: "", password: "", provincia: "Buenos Aires (CABA, GBA e interior)", zona: "Palermo", para: "Mi hijo/a", poblacion: "Niñez", edad: "", areas: [], horario: "Tardes" });

  const registrarse = async (rolNuevo, datos, datosPlan = null) => {
    setErrorAuth(""); setCargandoAuth(true);
    const { data, error } = await supabase.auth.signUp({
      email: datos.email,
      password: datos.password,
      options: {
        data: {
          rol: rolNuevo,
          nombre: datos.nombre,
          zona: datos.zona,
          provincia: datos.provincia,
          poblaciones: rolNuevo === "at" ? datos.poblaciones : [datos.poblacion],
          areas: datos.areas,
          experiencia: rolNuevo === "at" ? datos.exp : null,
        },
      },
    });
    setCargandoAuth(false);
    if (error) { setErrorAuth(errorAuthEnEspanol(error)); return false; }

    const userId = data?.user?.id || data?.session?.user?.id;
    if (userId && datosPlan) {
      await supabase.from("profiles").update({
        plan: datosPlan.plan,
        seguro_incluido: datosPlan.seguroIncluido,
      }).eq("id", userId);
      setPlan(datosPlan.plan);
    }

    if (!data.session) {
      avisar("Cuenta creada. Revisá tu email para confirmarla.");
      setPantalla("login");
      return true;
    }
    setRol(rolNuevo);
    avisar("Cuenta creada");
    return true;
  };

  const iniciarSesionAuth = async () => {
    setErrorAuth(""); setCargandoAuth(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginForm.email, password: loginForm.password });
    setCargandoAuth(false);
    if (error) { setErrorAuth(errorAuthEnEspanol(error)); return; }
    setLoginForm({ email: "", password: "" });
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setUsuario(null); setPerfilId(null); setRol(null);
    setPantalla("bienvenida");
    avisar("Sesión cerrada");
  };

  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const guardarPerfil = async () => {
    if (!usuario) return;
    setGuardandoPerfil(true);
    const payload = rol === "at"
      ? { nombre: regAT.nombre, zona: regAT.zona, provincia: regAT.provincia, poblaciones: regAT.poblaciones, areas: regAT.areas, experiencia: regAT.exp }
      : { nombre: regFam.nombre, zona: regFam.zona, provincia: regFam.provincia, poblaciones: [regFam.poblacion], areas: regFam.areas };
    const { error } = await supabase.from("profiles").update(payload).eq("id", usuario.id);
    setGuardandoPerfil(false);
    if (error) { avisar(errorAuthEnEspanol(error)); return; }
    setEditandoPerfil(false);
    avisar("Perfil actualizado");
  };

  /* estado app AT */
  const [tab, setTab] = useState("salidas");
  const [detalleId, setDetalleId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [salidas, setSalidas] = useState(SALIDAS_INICIALES);
  const [joined, setJoined] = useState([]);
  const [chats, setChats] = useState(CHATS_INICIALES);
  const [fZona, setFZona] = useState("Todas");
  const [fPob, setFPob] = useState("Todas");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ titulo: "", lugar: "", zona: "Palermo", fecha: "", hora: "", poblacion: "Niñez", rango: "", cupo: 3, notas: "" });
  const [revisando, setRevisando] = useState(false);
  const [revision, setRevision] = useState(null); // { riesgo, hallazgos[], version_segura }
  const [plan, setPlan] = useState("free"); // free | plus | pro
  const [verPlanes, setVerPlanes] = useState(false);

  /* planes en el onboarding (antes de crear la cuenta AT) */
  const [planOnboarding, setPlanOnboarding] = useState(null); // free | plus | pro
  const [seguroPlus, setSeguroPlus] = useState(false);
  const [seguroPro, setSeguroPro] = useState(true);
  const [antecedentesFree, setAntecedentesFree] = useState(false); // certificado propio, solo plan Free
  const [checkoutOnboarding, setCheckoutOnboarding] = useState(null); // { plan, precioBase, seguroIncluido, total } | null
  const [verCud, setVerCud] = useState(false);
  const [verAdminCud, setVerAdminCud] = useState(false);
  const [cudActividades, setCudActividades] = useState(CUD_ACTIVIDADES_INICIALES);
  const [cudProvincia, setCudProvincia] = useState("Todas");
  const [cudBadge, setCudBadge] = useState("Todas");
  const [favoritosCud, setFavoritosCud] = useState([]);
  const [vistaMapa, setVistaMapa] = useState(false);
  const [pinSel, setPinSel] = useState(null);
  const [pinSelSalida, setPinSelSalida] = useState(null);

  /* --- salida en curso (tracking por sesión) --- */
  const [sesion, setSesion] = useState(null); // { titulo, at, inicioTs, finTs, checkins[], demo, finalizada }
  const [verEnCurso, setVerEnCurso] = useState(false);
  const [tick, setTick] = useState(0);

  const horaAhora = () => new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  const elapsedSec = sesion && !sesion.finalizada ? Math.floor((Date.now() - sesion.inicioTs) / 1000) : 0;
  const fmtTiempo = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (!sesion || sesion.finalizada) return;
    const iv = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, [sesion]);

  useEffect(() => {
    if (!sesion || sesion.finalizada || !sesion.demo) return;
    const hitos = [
      [6, "Llegamos al Jardín Botánico. Todo en orden."],
      [22, "Todo bien — recorriendo el invernadero central."],
      [45, "Pausa para merienda a la sombra."],
    ];
    const h = hitos.find(([seg, txt]) => elapsedSec >= seg && !sesion.checkins.some((c) => c.texto === txt));
    if (h) setSesion((s) => ({ ...s, checkins: [...s.checkins, { texto: h[1], hora: horaAhora() }] }));
  }, [tick]); // eslint-disable-line

  /* recorrido simulado sobre el mapa */
  const WAY = [[120, 150], [150, 118], [190, 95], [235, 90], [275, 105], [292, 140], [255, 168], [205, 172], [158, 166], [120, 150]];
  const posEn = (t) => {
    const seg = WAY.length - 1;
    const tt = ((t % seg) + seg) % seg;
    const i = Math.floor(tt), f = tt - i;
    return [WAY[i][0] + (WAY[i + 1][0] - WAY[i][0]) * f, WAY[i][1] + (WAY[i + 1][1] - WAY[i][1]) * f];
  };
  const tRuta = elapsedSec * 0.08;

  const iniciarSesion = (titulo, at, demo, zona) => {
    setSesion({ titulo, at, zona, inicioTs: Date.now(), checkins: [{ texto: "Salida iniciada", hora: horaAhora() }], demo, finalizada: false });
  };
  const agregarCheckin = (texto) => {
    setSesion((s) => ({ ...s, checkins: [...s.checkins, { texto, hora: horaAhora() }] }));
    avisar("Aviso enviado a las familias");
  };
  const finalizarSesion = () => {
    setSesion((s) => ({ ...s, finalizada: true, finTs: Date.now() }));
    avisar("Salida finalizada · resumen enviado");
  };

  const MapaVivo = ({ alto = 210 }) => {
    const [px, py] = posEn(tRuta);
    const trail = [0.9, 0.6, 0.3].map((d) => posEn(Math.max(tRuta - d, 0)));
    const tituloCorto = sesion?.titulo && sesion.titulo.length > 30 ? sesion.titulo.slice(0, 28) + "…" : sesion?.titulo;
    const etiqueta = [tituloCorto, sesion?.zona].filter(Boolean).join(" · ");
    return (
      <svg viewBox="0 0 400 230" width="100%" height={alto} role="img" aria-label="Ubicación de la salida en curso">
        <rect width="400" height="230" fill="#EAEBF5" />
        {[60, 130, 200, 270, 340].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="230" stroke="#DFE1F0" strokeWidth="1.5" />)}
        {[50, 115, 180].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#DFE1F0" strokeWidth="1.5" />)}
        <ellipse cx="205" cy="128" rx="128" ry="78" fill="#D6F0E7" />
        <text x="205" y="215" fontSize="10" fill="#7FB9A6" textAnchor="middle">{etiqueta}</text>
        <polyline points={WAY.map((p) => p.join(",")).join(" ")} fill="none" stroke="#A9D8CE" strokeWidth="2.5" strokeDasharray="5 5" />
        {trail.map(([tx, ty], i) => (
          <circle key={i} cx={tx} cy={ty} r={3 + i} fill={VERDE} opacity={0.15 + i * 0.1} />
        ))}
        <circle cx={px} cy={py} r="14" fill={VERDE} opacity="0.2">
          <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={px} cy={py} r="8" fill={VERDE} stroke="#fff" strokeWidth="2.5" />
      </svg>
    );
  };

  /* estado app familia */
  const [tabFam, setTabFam] = useState("buscar");
  const [atSel, setAtSel] = useState(null);
  const [bZona, setBZona] = useState("Todas");
  const [bPob, setBPob] = useState("Todas");
  const [solicitudes, setSolicitudes] = useState([]);
  const [msjSolicitud, setMsjSolicitud] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);

  const yoAT = regAT.nombre.trim()
    ? regAT.nombre.trim().split(" ")[0] + " " + (regAT.nombre.trim().split(" ")[1]?.[0] ? regAT.nombre.trim().split(" ")[1][0] + "." : "")
    : "Sofía P.";
  const nombrePerfilAT = regAT.nombre.trim() || "Sofía Paredes";
  const nombreFam = regFam.nombre.trim() || "Ana Gutiérrez";

  const toggle = (arr, v) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  /* ---------- acciones AT ---------- */
  const salida = salidas.find((s) => s.id === detalleId);
  const chatSalida = salidas.find((s) => s.id === chatId);

  const sumarme = (id) => {
    setSalidas((p) => p.map((s) => s.id === id ? { ...s, participantes: [...s.participantes, yoAT] } : s));
    setJoined((p) => [...p, id]);
    setChats((p) => ({ ...p, [id]: [...(p[id] || []), { autor: "sistema", texto: "Te sumaste a la salida", hora: "" }] }));
    avisar("Te sumaste a la salida");
  };
  const bajarme = (id) => {
    setSalidas((p) => p.map((s) => s.id === id ? { ...s, participantes: s.participantes.filter((x) => x !== yoAT) } : s));
    setJoined((p) => p.filter((j) => j !== id));
    avisar("Te bajaste de la salida");
  };
  const publicarDirecto = (notasFinales, toastTexto) => {
    const id = Date.now();
    setSalidas((p) => [{ id, ...form, notas: notasFinales, cupo: Number(form.cupo) || 3, participantes: [yoAT], creador: yoAT }, ...p]);
    setJoined((p) => [...p, id]);
    setChats((p) => ({ ...p, [id]: [{ autor: "sistema", texto: "Creaste esta salida", hora: "" }] }));
    setForm({ titulo: "", lugar: "", zona: "Palermo", fecha: "", hora: "", poblacion: "Niñez", rango: "", cupo: 3, notas: "" });
    setRevision(null);
    setTab("salidas");
    avisar(toastTexto || "Salida publicada");
  };

  const publicar = async () => {
    if (!form.titulo || !form.fecha || !form.hora || !form.lugar) { avisar("Completá actividad, lugar, fecha y hora"); return; }
    if (!form.notas.trim()) { publicarDirecto(""); return; }

    setRevisando(true);
    setRevision(null);
    try {
      const prompt = `Sos el guardián de privacidad de Ronda, una app donde acompañantes terapéuticos (ATs) publican salidas grupales para coordinarse entre profesionales.

REGLA CENTRAL: las publicaciones NUNCA deben incluir datos personales o clínicos de los acompañados (las personas que reciben acompañamiento). Datos sensibles a detectar:
- Nombres, apodos o iniciales de acompañados
- Edades exactas individuales (rangos etarios generales están BIEN)
- Diagnósticos, condiciones o siglas clínicas atribuidas a una persona (ej: "tiene TEA nivel 2")
- Medicación, tratamientos, obras sociales, escuelas o instituciones a las que asiste
- Direcciones de domicilio o datos de contacto de familias
- Descripciones de conducta que identifiquen a una persona concreta

Información que SÍ está permitida (no marcarla como riesgo): características de la ACTIVIDAD y del LUGAR (accesibilidad, nivel de estímulo sonoro/visual del espacio, qué llevar, ritmo de la salida, punto de encuentro público), y necesidades expresadas de forma anónima y grupal (ej: "lugar apto para hipersensibilidad auditiva").

Analizá el siguiente texto de una publicación:

TÍTULO: ${form.titulo}
RANGO ETARIO DECLARADO: ${form.rango || "no indicado"}
NOTAS: ${form.notas}

Respondé ÚNICAMENTE con JSON válido, sin markdown ni texto adicional, con esta estructura exacta:
{"riesgo": true o false, "hallazgos": ["descripción breve y clara de cada dato sensible detectado"], "version_segura": "reescritura de las NOTAS que preserva toda la información útil sobre la actividad pero elimina los datos sensibles, en el mismo tono rioplatense informal"}

Si no hay datos sensibles: riesgo false, hallazgos como lista vacía, y version_segura igual al texto original.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const texto = (data.content || []).filter((i) => i.type === "text").map((i) => i.text).join("\n");
      const limpio = texto.replace(/```json|```/g, "").trim();
      const r = JSON.parse(limpio);

      if (r.riesgo && Array.isArray(r.hallazgos) && r.hallazgos.length > 0) {
        setRevision(r);
      } else {
        publicarDirecto(form.notas, "Publicada · sin datos sensibles");
      }
    } catch (e) {
      publicarDirecto(form.notas, "Publicada (revisión no disponible)");
    }
    setRevisando(false);
  };
  const enviarMsg = () => {
    if (!msg.trim() || !chatId) return;
    setChats((p) => ({ ...p, [chatId]: [...(p[chatId] || []), { autor: yoAT, texto: msg.trim(), hora: "ahora" }] }));
    setMsg("");
  };

  /* ---------- acciones familia ---------- */
  const enviarSolicitud = (at) => {
    setSolicitudes((p) => [{ at: at.nombre, zona: at.zona, estado: "Pendiente", mensaje: msjSolicitud.trim(), fecha: "Hoy" }, ...p]);
    setMsjSolicitud(""); setEscribiendo(false); setAtSel(null); setTabFam("solicitudes");
    avisar("Solicitud enviada");
  };

  /* ================================================================ */
  /*  PANTALLA: BIENVENIDA / ELECCIÓN DE ROL                          */
  /* ================================================================ */

  const Bienvenida = (
    <div className="px-5 flex flex-col" style={{ minHeight: "100%" }}>
      <div className="flex flex-col items-center text-center" style={{ paddingTop: 56 }}>
        <img src="/logo-completo.png" width={170} height={170} alt="rondas — Red de acompañamiento terapéutico" style={{ objectFit: "contain" }} />
        <p className="text-sm mt-2 px-6" style={{ color: GRIS }}>
          Salidas compartidas, profesionales verificados.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-10">
        <button onClick={() => { setRol("at"); setCheckoutOnboarding(null); setPantalla("planesOnboarding"); }}
          className="rd-card rounded-2xl p-5 text-left flex items-start gap-4 w-full"
          style={{ borderLeft: "3px solid " + VERDE, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
          <div className="rounded-2xl p-3 flex-shrink-0" style={{ background: "#DFF3F1" }}>
            <Users size={22} color={VERDE} />
          </div>
          <div>
            <p className="rd-display text-base" style={{ fontWeight: 800 }}>Soy acompañante terapéutico/a</p>
            <p className="text-sm mt-1" style={{ color: GRIS }}>Coordiná salidas grupales con otros ATs y sumate a una red profesional verificada.</p>
          </div>
        </button>

        <button onClick={() => { setRol("familia"); setPantalla("registroFam"); }}
          className="rd-card rounded-2xl p-5 text-left flex items-start gap-4 w-full"
          style={{ borderLeft: "3px solid " + AMBAR, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
          <div className="rounded-2xl p-3 flex-shrink-0" style={{ background: "#FCF0D8" }}>
            <HeartHandshake size={22} color={AMBAR} />
          </div>
          <div>
            <p className="rd-display text-base" style={{ fontWeight: 800 }}>Busco un acompañante</p>
            <p className="text-sm mt-1" style={{ color: GRIS }}>Encontrá ATs verificados cerca tuyo, para niños, adolescentes o adultos.</p>
          </div>
        </button>
      </div>

      <div className="mt-auto pb-8 pt-10">
        <button onClick={() => { setErrorAuth(""); setPantalla("login"); }}
          className="w-full text-center text-sm font-bold py-2" style={{ color: VERDE }}>
          Ya tengo cuenta · Iniciar sesión
        </button>
        <div className="flex items-center justify-center gap-2 text-xs mt-3" style={{ color: "#9BA0BC" }}>
          <ShieldCheck size={14} />
          <span>Certificaciones revisadas manualmente antes de publicar cada perfil</span>
        </div>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  PANTALLA: LOGIN                                                 */
  /* ================================================================ */

  const Login = (
    <div className="px-4 pb-10">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => setPantalla("bienvenida")} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold" style={{ color: VERDE }}>INICIAR SESIÓN</p>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>Bienvenido/a de nuevo</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-5">
        <Campo label="Email">
          <input type="email" className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="tu@email.com"
            value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
        </Campo>
        <Campo label="Contraseña">
          <input type="password" className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="••••••••"
            value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
        </Campo>

        {errorAuth && (
          <div className="rounded-2xl p-3 text-xs font-semibold" style={{ background: "#FCE4E4", color: "#B3261E" }}>
            {errorAuth}
          </div>
        )}

        <BotonPrimario onClick={() => {
          if (!loginForm.email.trim() || !loginForm.password) { setErrorAuth("Completá email y contraseña."); return; }
          iniciarSesionAuth();
        }}>
          {cargandoAuth ? <Loader2 size={16} className="animate-spin" /> : "Iniciar sesión"}
        </BotonPrimario>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  PANTALLA: PLANES EN EL ONBOARDING (AT, antes de crear la cuenta) */
  /* ================================================================ */

  const fmtARS = (n) => "ARS " + n.toLocaleString("es-AR");

  const precioPlusTotal = 9900 + (seguroPlus ? 9900 : 0);
  const precioProTotal = 18900 + (seguroPro ? 9900 : 0);

  const elegirPlanOnboarding = (id) => {
    if (id === "free") {
      setPlanOnboarding("free"); setCheckoutOnboarding(null); setPantalla("registroAT");
      return;
    }
    if (id === "plus") {
      setPlanOnboarding("plus");
      setCheckoutOnboarding({ plan: "plus", nombre: "Plus", precioBase: 9900, seguroIncluido: seguroPlus, total: precioPlusTotal });
      return;
    }
    setPlanOnboarding("pro");
    setCheckoutOnboarding({ plan: "pro", nombre: "Pro", precioBase: 18900, seguroIncluido: seguroPro, total: precioProTotal });
  };

  const PlanesOnboarding = (
    <div className="px-4 pb-28">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => checkoutOnboarding ? setCheckoutOnboarding(null) : setPantalla("bienvenida")}
          className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold" style={{ color: VERDE }}>REGISTRO · ACOMPAÑANTE TERAPÉUTICO/A</p>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>{checkoutOnboarding ? "Confirmá tu plan" : "Elegí tu plan"}</h1>
        </div>
      </div>

      {!checkoutOnboarding ? (
        <div className="flex flex-col gap-3 mt-5">
          {/* FREE */}
          <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #E4E2D8" }}>
            <div className="flex items-baseline justify-between">
              <p className="rd-display text-lg" style={{ fontWeight: 800 }}>Free</p>
              <div className="text-right">
                <p className="rd-display text-lg" style={{ fontWeight: 800, color: VERDE }}>$0</p>
                <p style={{ fontSize: 10, color: "#9BA0BC" }}>para siempre</p>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5 mt-3">
              {["Perfil verificado", "Salidas ilimitadas", "Chats de coordinación", "Guardián de privacidad con IA", "1 informe con IA por mes", "Hasta 2 solicitudes de familias por mes"].map((f) => (
                <li key={f} className="text-sm flex items-start gap-2" style={{ color: "#3C4368" }}>
                  <Check size={14} color={VERDE} style={{ flexShrink: 0, marginTop: 3 }} />{f}
                </li>
              ))}
              {["Sin seguro de responsabilidad civil", "Sin antecedentes penales incluidos"].map((f) => (
                <li key={f} className="text-sm flex items-start gap-2" style={{ color: "#B3B8D1" }}>
                  <X size={14} style={{ flexShrink: 0, marginTop: 3 }} />{f}
                </li>
              ))}
            </ul>
            <button onClick={() => elegirPlanOnboarding("free")}
              className="w-full rounded-2xl py-3 font-bold text-sm mt-3" style={{ background: "#fff", border: "1px solid " + VERDE, color: VERDE }}>
              Elegir Free
            </button>
          </div>

          {/* PLUS */}
          <div className="rounded-2xl p-4 relative" style={{ background: "#fff", border: "2px solid " + CORAL }}>
            <span className="absolute text-xs font-bold px-3 py-1 rounded-full" style={{ top: -10, right: 16, background: CORAL, color: "#fff" }}>
              Más elegido
            </span>
            <div className="flex items-baseline justify-between">
              <p className="rd-display text-lg" style={{ fontWeight: 800 }}>Plus</p>
              <div className="text-right">
                <p className="rd-display text-lg" style={{ fontWeight: 800, color: VERDE }}>{fmtARS(precioPlusTotal)}</p>
                <p style={{ fontSize: 10, color: "#9BA0BC" }}>por mes</p>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5 mt-3">
              {["Todo lo de Free", "Informes con IA ilimitados", "Planificador de salidas con IA", "Solicitudes de familias ilimitadas", "Verificación express (24 hs)", "Estadísticas de tu perfil"].map((f) => (
                <li key={f} className="text-sm flex items-start gap-2" style={{ color: "#3C4368" }}>
                  <Check size={14} color={VERDE} style={{ flexShrink: 0, marginTop: 3 }} />{f}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #F0F1F9" }}>
              <Checkbox checked={seguroPlus} onChange={() => setSeguroPlus(!seguroPlus)}>
                Sumar seguro de responsabilidad civil <span style={{ color: "#9BA0BC" }}>(+{fmtARS(9900)}/mes)</span>
              </Checkbox>
            </div>
            <button onClick={() => elegirPlanOnboarding("plus")}
              className="w-full rounded-2xl py-3 font-bold text-sm mt-3" style={{ background: CORAL, color: "#fff" }}>
              Elegir Plus
            </button>
          </div>

          {/* PRO */}
          <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #E4E2D8" }}>
            <div className="flex items-baseline justify-between">
              <p className="rd-display text-lg" style={{ fontWeight: 800 }}>Pro</p>
              <div className="text-right">
                <p className="rd-display text-lg" style={{ fontWeight: 800, color: VERDE }}>{fmtARS(precioProTotal)}</p>
                <p style={{ fontSize: 10, color: "#9BA0BC" }}>por mes</p>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5 mt-3">
              {["Todo lo de Plus", "Video de presentación en tu perfil", "Agenda y recordatorios de salidas", "Exportación de informes para obras sociales", "Reseñas destacadas", "Soporte prioritario", "Antecedentes penales sin costo extra"].map((f) => (
                <li key={f} className="text-sm flex items-start gap-2" style={{ color: "#3C4368" }}>
                  <Check size={14} color={VERDE} style={{ flexShrink: 0, marginTop: 3 }} />{f}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid #F0F1F9" }}>
              <Checkbox checked={seguroPro} onChange={() => setSeguroPro(!seguroPro)}>
                Sumar seguro de responsabilidad civil <span style={{ color: "#9BA0BC" }}>(+{fmtARS(9900)}/mes)</span>
              </Checkbox>
            </div>
            <button onClick={() => elegirPlanOnboarding("pro")}
              className="w-full rounded-2xl py-3 font-bold text-sm mt-3" style={{ background: "#fff", border: "1px solid " + VERDE, color: VERDE }}>
              Elegir Pro
            </button>
          </div>

          {/* INSTITUCIÓN */}
          <div className="rounded-2xl p-5" style={{ background: NAVY }}>
            <div className="flex items-center gap-2">
              <Building2 size={20} color="#fff" />
              <p className="rd-display text-base" style={{ fontWeight: 800, color: "#fff" }}>Institución</p>
            </div>
            <p className="text-sm mt-2" style={{ color: "#B9BEDC" }}>
              Cuentas para todo el staff, informes centralizados con supervisión, exportación por obra social y perfil institucional.
            </p>
            <p className="text-xs mt-2 font-bold" style={{ color: "#fff" }}>Desde {fmtARS(150000)}/mes · hasta 10 ATs</p>
            <button onClick={() => avisar("Te contactamos en 24 hs (demo)")}
              className="mt-3 rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: "#fff", color: NAVY }}>
              Hablar con nosotros
            </button>
          </div>

          <p className="text-xs text-center px-4" style={{ color: "#9BA0BC" }}>
            Suscripción vía MercadoPago. Cancelás cuando quieras. La verificación de certificados es gratuita en todos los planes.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-5">
          <CardSeccion titulo="Resumen de tu compra">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#3C4368" }}>Plan {checkoutOnboarding.nombre}</span>
              <span className="font-semibold">{fmtARS(checkoutOnboarding.precioBase)}/mes</span>
            </div>
            {checkoutOnboarding.seguroIncluido && (
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#3C4368" }}>Seguro de responsabilidad civil</span>
                <span className="font-semibold">+{fmtARS(9900)}/mes</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #F0F1F9" }}>
              <span className="text-sm font-bold">Total</span>
              <span className="rd-display text-lg" style={{ fontWeight: 800, color: VERDE }}>{fmtARS(checkoutOnboarding.total)}/mes</span>
            </div>
          </CardSeccion>

          <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#F0F1F9" }}>
            <CreditCard size={20} color={NAVY} />
            <p className="text-xs" style={{ color: "#3C4368" }}>Vas a pagar de forma segura con MercadoPago. Cancelás cuando quieras.</p>
          </div>

          <BotonPrimario color={VERDE} icon={CreditCard} onClick={() => setPantalla("registroAT")}>
            Confirmar y pagar con MercadoPago
          </BotonPrimario>
        </div>
      )}
    </div>
  );

  /* ================================================================ */
  /*  PANTALLA: REGISTRO AT                                           */
  /* ================================================================ */

  const RegistroAT = (
    <div className="px-4 pb-10">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => setPantalla("planesOnboarding")} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold" style={{ color: VERDE }}>REGISTRO · ACOMPAÑANTE TERAPÉUTICO/A</p>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>Creá tu perfil profesional</h1>
        </div>
      </div>

      {planOnboarding && (
        <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold px-3 py-1.5 rounded-full w-fit" style={{ background: "#DFF3F1", color: VERDE }}>
          <Crown size={12} />
          Plan {planOnboarding === "free" ? "Free" : planOnboarding === "plus" ? "Plus" : "Pro"} elegido
        </div>
      )}

      <div className="flex flex-col gap-4 mt-5">
        <CardSeccion titulo="Tu cuenta">
          <Campo label="Nombre y apellido">
            <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="Ej: Sofía Paredes"
              value={regAT.nombre} onChange={(e) => setRegAT({ ...regAT, nombre: e.target.value })} />
          </Campo>

          <Campo label="Email">
            <input type="email" className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="tu@email.com"
              value={regAT.email} onChange={(e) => setRegAT({ ...regAT, email: e.target.value })} />
          </Campo>

          <CampoPassword label="Contraseña" placeholder="Mínimo 6 caracteres"
            value={regAT.password} onChange={(e) => setRegAT({ ...regAT, password: e.target.value })}
            visible={verPassAT} onToggleVisible={() => setVerPassAT(!verPassAT)} />
        </CardSeccion>

        <CardSeccion titulo="Tu perfil profesional">
          <Campo label="Provincia">
            <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regAT.provincia}
              onChange={(e) => setRegAT({ ...regAT, provincia: e.target.value, zona: PROVINCIAS[e.target.value][0] })}>
              {Object.keys(PROVINCIAS).map((p) => <option key={p}>{p}</option>)}
            </select>
          </Campo>
          <Campo label="Ciudad">
            <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regAT.zona} onChange={(e) => setRegAT({ ...regAT, zona: e.target.value })}>
              {PROVINCIAS[regAT.provincia].map((z) => <option key={z}>{z}</option>)}
            </select>
          </Campo>
          <span className="text-xs -mt-2" style={{ color: "#9BA0BC" }}>Se muestra tu zona, nunca una dirección exacta.</span>

          <Campo label="¿Con qué poblaciones trabajás?">
            <MultiChips opciones={POBLACIONES} valores={regAT.poblaciones} colorMap={POB_COLOR}
              onToggle={(v) => setRegAT({ ...regAT, poblaciones: toggle(regAT.poblaciones, v) })} />
          </Campo>

          <Campo label="Áreas de especialidad">
            <MultiChips opciones={AREAS} valores={regAT.areas}
              onToggle={(v) => setRegAT({ ...regAT, areas: toggle(regAT.areas, v) })} />
          </Campo>

          <Campo label="Años de experiencia">
            <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regAT.exp} onChange={(e) => setRegAT({ ...regAT, exp: e.target.value })}>
              {["Menos de 1 año", "1 a 3 años", "3 a 7 años", "Más de 7 años"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Campo>
        </CardSeccion>

        <CardSeccion titulo="Certificación">
          <Campo label="Certificación de AT">
            <button type="button" onClick={() => setRegAT({ ...regAT, cert: !regAT.cert })}
              className="rounded-xl px-3 py-3 text-sm font-semibold flex items-center gap-2 justify-center"
              style={regAT.cert
                ? { background: "#DFF3F1", color: VERDE, border: "1px solid " + VERDE }
                : { background: "#fff", border: "1px solid " + VERDE, color: VERDE }}>
              {regAT.cert ? <FileCheck size={16} /> : <Upload size={16} />}
              {regAT.cert ? "certificado-at.pdf adjuntado" : "Adjuntar certificado"}
            </button>
            <span className="text-xs" style={{ color: "#9BA0BC", fontSize: 11 }}>
              Lo revisamos manualmente. Tu perfil se publica con el badge "Verificación en curso" hasta la aprobación.
            </span>
          </Campo>

          {planOnboarding === "free" && (
            <Campo label="Certificado de antecedentes penales (opcional)">
              <button type="button" onClick={() => setAntecedentesFree(!antecedentesFree)}
                className="rounded-xl px-3 py-3 text-sm font-semibold flex items-center gap-2 justify-center"
                style={antecedentesFree
                  ? { background: "#DFF3F1", color: VERDE, border: "1px solid " + VERDE }
                  : { background: "#fff", border: "1px solid " + VERDE, color: VERDE }}>
                {antecedentesFree ? <FileCheck size={16} /> : <Upload size={16} />}
                {antecedentesFree ? "certificado-antecedentes.pdf adjuntado" : "Adjuntar certificado"}
              </button>
              <span className="text-xs" style={{ color: "#9BA0BC", fontSize: 11 }}>
                En Plus y Pro lo tramitamos nosotros sin costo extra.
              </span>
            </Campo>
          )}
        </CardSeccion>

        {errorAuth && (
          <div className="rounded-2xl p-3 text-xs font-semibold" style={{ background: "#FCE4E4", color: "#B3261E" }}>
            {errorAuth}
          </div>
        )}

        <BotonPrimario color={VERDE} onClick={async () => {
          if (!regAT.nombre.trim()) { setErrorAuth("Contanos tu nombre."); return; }
          if (!regAT.email.trim()) { setErrorAuth("Ingresá tu email."); return; }
          if (regAT.password.length < 6) { setErrorAuth("La contraseña debe tener al menos 6 caracteres."); return; }
          if (regAT.poblaciones.length === 0) { setErrorAuth("Elegí al menos una población."); return; }
          setErrorAuth("");
          const ok = await registrarse("at", regAT, {
            plan: planOnboarding || "free",
            seguroIncluido: planOnboarding === "free" ? false : !!checkoutOnboarding?.seguroIncluido,
          });
          if (ok) setTab("salidas");
        }}>
          {cargandoAuth ? <Loader2 size={16} className="animate-spin" /> : "Crear mi cuenta"}
        </BotonPrimario>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  PANTALLA: REGISTRO FAMILIA / USUARIO                            */
  /* ================================================================ */

  const RegistroFam = (
    <div className="px-4 pb-10">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => setPantalla("bienvenida")} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold" style={{ color: AMBAR }}>REGISTRO · BUSCO ACOMPAÑANTE</p>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>Contanos qué buscás</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-5">
        <CardSeccion titulo="Tu cuenta">
          <Campo label="Tu nombre">
            <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="Ej: Ana Gutiérrez"
              value={regFam.nombre} onChange={(e) => setRegFam({ ...regFam, nombre: e.target.value })} />
          </Campo>

          <Campo label="Email">
            <input type="email" className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="tu@email.com"
              value={regFam.email} onChange={(e) => setRegFam({ ...regFam, email: e.target.value })} />
          </Campo>

          <CampoPassword label="Contraseña" placeholder="Mínimo 6 caracteres"
            value={regFam.password} onChange={(e) => setRegFam({ ...regFam, password: e.target.value })}
            visible={verPassFam} onToggleVisible={() => setVerPassFam(!verPassFam)} />
        </CardSeccion>

        <CardSeccion titulo="Tu búsqueda">
          <Campo label="Provincia">
            <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regFam.provincia}
              onChange={(e) => setRegFam({ ...regFam, provincia: e.target.value, zona: PROVINCIAS[e.target.value][0] })}>
              {Object.keys(PROVINCIAS).map((p) => <option key={p}>{p}</option>)}
            </select>
          </Campo>
          <Campo label="Ciudad">
            <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regFam.zona} onChange={(e) => setRegFam({ ...regFam, zona: e.target.value })}>
              {PROVINCIAS[regFam.provincia].map((z) => <option key={z}>{z}</option>)}
            </select>
          </Campo>
          <span className="text-xs -mt-2" style={{ color: "#9BA0BC" }}>Usamos tu zona para mostrarte ATs cercanos. Nunca pedimos tu dirección.</span>

          <div className="flex gap-3">
            <Campo label="¿Para quién buscás?">
              <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regFam.para} onChange={(e) => setRegFam({ ...regFam, para: e.target.value })}>
                {["Mi hijo/a", "Un familiar", "Para mí"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Campo>
            <Campo label="Edad aproximada">
              <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="Ej: 8 años"
                value={regFam.edad} onChange={(e) => setRegFam({ ...regFam, edad: e.target.value })} />
            </Campo>
          </div>

          <Campo label="Población">
            <MultiChips opciones={POBLACIONES} valores={[regFam.poblacion]} colorMap={POB_COLOR}
              onToggle={(v) => setRegFam({ ...regFam, poblacion: v })} />
          </Campo>

          <Campo label="Área de acompañamiento (opcional)">
            <MultiChips opciones={AREAS} valores={regFam.areas}
              onToggle={(v) => setRegFam({ ...regFam, areas: toggle(regFam.areas, v) })} />
          </Campo>

          <Campo label="Preferencia horaria">
            <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regFam.horario} onChange={(e) => setRegFam({ ...regFam, horario: e.target.value })}>
              {["Mañanas", "Tardes", "Fines de semana", "Flexible"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Campo>
        </CardSeccion>

        <div className="rounded-2xl p-4 flex gap-3" style={{ background: "#FCF0D8" }}>
          <ShieldCheck size={18} color={AMBAR} style={{ flexShrink: 0, marginTop: 2 }} />
          <p className="text-xs" style={{ color: "#7C6420" }}>
            Esta información es privada: solo la ve el AT cuando le enviás una solicitud. Nunca publicamos datos de la persona que necesita acompañamiento.
          </p>
        </div>

        {errorAuth && (
          <div className="rounded-2xl p-3 text-xs font-semibold" style={{ background: "#FCE4E4", color: "#B3261E" }}>
            {errorAuth}
          </div>
        )}

        <BotonPrimario color={VERDE} onClick={async () => {
          if (!regFam.nombre.trim()) { setErrorAuth("Contanos tu nombre."); return; }
          if (!regFam.email.trim()) { setErrorAuth("Ingresá tu email."); return; }
          if (regFam.password.length < 6) { setErrorAuth("La contraseña debe tener al menos 6 caracteres."); return; }
          setErrorAuth("");
          const ok = await registrarse("familia", regFam);
          if (ok) { setBZona(regFam.zona); setTabFam("buscar"); }
        }}>
          {cargandoAuth ? <Loader2 size={16} className="animate-spin" /> : "Crear mi cuenta"}
        </BotonPrimario>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  APP FAMILIA: BUSCAR ATs                                         */
  /* ================================================================ */

  const atsFiltrados = DIRECTORIO_ATS.filter((a) =>
    (bZona === "Todas" || a.zona === bZona) && (bPob === "Todas" || a.poblaciones.includes(bPob))
  );

  const userPos = COORDS_REALES[regFam.zona] || COORDS_REALES["Palermo"];
  const distKm = (posAT) => {
    const d = distanciaKm(userPos, posAT);
    return (Math.round(Math.max(d, 0.3) * 10) / 10).toString().replace(".", ",");
  };
  /* pequeño desplazamiento para que ATs de la misma ciudad no queden pin sobre pin */
  const pinPos = (a, i) => {
    const base = COORDS_REALES[a.zona] || COORDS_REALES["Palermo"];
    const prev = atsFiltrados.slice(0, i).filter((x) => x.zona === a.zona).length;
    return [base[0] + prev * 0.004, base[1] + prev * 0.004];
  };

  const BuscarATs = (
    <div className="px-4 pb-28">
      <div className="-mx-4 px-5 pt-6 pb-5 mb-4"
        style={{ background: NAVY, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <div className="flex items-center gap-3">
          <LogoRondas size={40} variant="blanco" />
          <div>
            <h1 className="rd-display text-xl" style={{ fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>Acompañantes cerca tuyo</h1>
            <p className="text-xs" style={{ color: "#B9BEDC" }}>Certificación revisada · ordenados por cercanía</p>
          </div>
        </div>
      </div>

      <button onClick={() => setVerCud(true)}
        className="w-full rounded-2xl p-3.5 mb-3 flex items-center gap-3 text-left"
        style={{ background: "#DFF3F1", border: "1px solid #CBDCCE" }}>
        <Accessibility size={20} color={VERDE} style={{ flexShrink: 0 }} />
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: VERDE }}>Actividades gratis con CUD</p>
          <p className="text-xs" style={{ color: GRIS }}>Transporte, parques y museos sin costo</p>
        </div>
        <ChevronRight size={18} color={VERDE} />
      </button>

      <div className="flex rounded-full p-1 mb-3" style={{ background: "#DBDDEF" }}>
        {[{ id: false, label: "Lista", icon: List }, { id: true, label: "Mapa", icon: MapIcon }].map((v) => (
          <button key={v.label} onClick={() => { setVistaMapa(v.id); setPinSel(null); }}
            className="flex-1 rounded-full py-2 text-xs font-bold flex items-center justify-center gap-1.5"
            style={vistaMapa === v.id ? { background: "#fff", color: VERDE, boxShadow: "0 1px 2px rgba(0,0,0,0.08)" } : { color: GRIS }}>
            <v.icon size={14} />{v.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
        <select value={bZona} onChange={(e) => setBZona(e.target.value)}
          className="rd-input text-xs rounded-full px-3 py-2 font-semibold" style={{ width: "auto" }} aria-label="Filtrar por zona">
          <option>Todas</option>
          <ZonaOptions />
        </select>
        {["Todas", ...POBLACIONES].map((p) => (
          <button key={p} onClick={() => setBPob(p)}
            className="text-xs rounded-full px-3 py-2 font-semibold whitespace-nowrap"
            style={bPob === p ? { background: NAVY, color: "#fff" } : { background: "#fff", color: TINTA, border: "1px solid #D8D6CB" }}>
            {p}
          </button>
        ))}
      </div>

      {atsFiltrados.length === 0 && (
        <div className="rd-card rounded-2xl p-6 text-center mt-2">
          <p className="rd-display font-bold">No encontramos ATs con esos filtros</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>Probá ampliar la zona o la población.</p>
        </div>
      )}

      {vistaMapa ? (
        <div>
          <div className="rd-card rounded-2xl overflow-hidden" style={{ height: 320 }}>
            {GOOGLE_MAPS_KEY ? (
              <GoogleMap
                defaultCenter={{ lat: userPos[0], lng: userPos[1] }}
                defaultZoom={12}
                mapId="DEMO_MAP_ID"
                gestureHandling="greedy"
                disableDefaultUI
                style={{ width: "100%", height: "100%" }}
              >
                <AdvancedMarker position={{ lat: userPos[0], lng: userPos[1] }} title="Vos">
                  <div className="rounded-full" style={{ width: 16, height: 16, background: "#3B6FB5", border: "3px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.35)" }} />
                </AdvancedMarker>
                {atsFiltrados.map((a, i) => {
                  const [lat, lng] = pinPos(a, i);
                  const c = a.verificado ? VERDE : AMBAR;
                  const sel = pinSel === i;
                  return (
                    <AdvancedMarker key={a.nombre} position={{ lat, lng }} onClick={() => setPinSel(i)} title={a.nombre}>
                      <div className="rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ width: sel ? 34 : 28, height: sel ? 34 : 28, background: c, color: "#fff", border: "2.5px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.35)", cursor: "pointer" }}>
                        {a.nombre.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </div>
                    </AdvancedMarker>
                  );
                })}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full text-center px-6" style={{ color: GRIS }}>
                <p className="text-xs">Mapa no disponible: falta configurar Google Maps.</p>
              </div>
            )}
          </div>

          {pinSel !== null && atsFiltrados[pinSel] ? (
            <div className="rd-card rounded-2xl p-4 mt-3 flex items-center gap-3">
              <Avatar nombre={atsFiltrados[pinSel].nombre} size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="rd-display text-sm font-bold truncate">{atsFiltrados[pinSel].nombre}</p>
                  {atsFiltrados[pinSel].verificado && <BadgeCheck size={14} color={VERDE} />}
                </div>
                <p className="text-xs" style={{ color: GRIS }}>
                  {atsFiltrados[pinSel].zona} · a ~{distKm(pinPos(atsFiltrados[pinSel], pinSel))} km de tu zona
                </p>
              </div>
              <button onClick={() => { setAtSel(pinSel); setPinSel(null); setEscribiendo(false); }}
                className="text-xs font-bold px-3 py-2 rounded-full flex-shrink-0" style={{ background: CORAL, color: "#fff" }}>
                Ver perfil
              </button>
            </div>
          ) : (
            <p className="text-xs text-center mt-3" style={{ color: "#9BA0BC" }}>
              Tocá un pin para ver el perfil. Las ubicaciones son por zona, nunca exactas.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {atsFiltrados.map((a, i) => (
            <button key={a.nombre} onClick={() => { setAtSel(i); setEscribiendo(false); }}
              className="rd-card rounded-2xl p-4 text-left w-full">
              <div className="flex items-start gap-3">
                <Avatar nombre={a.nombre} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="rd-display text-base" style={{ fontWeight: 700 }}>{a.nombre}</p>
                    {a.verificado
                      ? <BadgeCheck size={16} color={VERDE} />
                      : <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#FCF0D8", color: AMBAR }}>Verificación en curso</span>}
                  </div>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: GRIS }}>
                    <MapPin size={12} />{a.zona} · a ~{distKm(pinPos(a, i))} km · {a.exp}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {a.poblaciones.map((p) => <ChipPob key={p} poblacion={p} />)}
                    {a.areas.slice(0, 2).map((ar) => (
                      <span key={ar} className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: PAPEL, border: "1px solid #E4E2D8" }}>{ar}</span>
                    ))}
                  </div>
                  <p className="text-xs mt-2 flex items-center gap-1" style={{ color: GRIS }}>
                    <Star size={12} color={AMBAR} fill={AMBAR} /> {a.salidas} salidas grupales realizadas en rondas
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  /* ---------- perfil de AT visto por la familia ---------- */

  const at = atSel !== null ? atsFiltrados[atSel] : null;
  const yaSolicitado = at && solicitudes.some((s) => s.at === at.nombre);

  const PerfilATPublico = at && (
    <div className="pb-28">
      <div className="px-4 pt-4 pb-5" style={{ background: "#DFF3F1" }}>
        <button onClick={() => setAtSel(null)} className="rounded-full p-2 mb-3" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-4">
          <Avatar nombre={at.nombre} size={64} destacado />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>{at.nombre}</h1>
              {at.verificado && <BadgeCheck size={18} color={VERDE} />}
            </div>
            <p className="text-sm flex items-center gap-1" style={{ color: GRIS }}><MapPin size={13} />{at.zona} · {at.exp}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-3">
        {!at.verificado && (
          <div className="rounded-2xl p-3 text-xs font-semibold" style={{ background: "#FCF0D8", color: "#7C6420" }}>
            Este perfil está en proceso de verificación de certificado.
          </div>
        )}

        <div className="rd-card rounded-2xl p-4">
          <p className="text-sm font-bold mb-1">Sobre su trabajo</p>
          <p className="text-sm" style={{ color: "#3C4368" }}>{at.bio}</p>
        </div>

        <div className="rd-card rounded-2xl p-4">
          <p className="text-sm font-bold mb-2">Poblaciones y especialidades</p>
          <div className="flex flex-wrap gap-2">
            {at.poblaciones.map((p) => <ChipPob key={p} poblacion={p} />)}
            {at.areas.map((ar) => (
              <span key={ar} className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: PAPEL, border: "1px solid #E4E2D8" }}>{ar}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="rd-card rounded-2xl p-4 flex-1 text-center">
            <p className="rd-display text-2xl" style={{ fontWeight: 800, color: VERDE }}>{at.salidas}</p>
            <p className="text-xs mt-1" style={{ color: GRIS }}>salidas grupales realizadas</p>
          </div>
          <div className="rd-card rounded-2xl p-4 flex-1">
            <p className="text-xs font-bold flex items-center gap-1"><Clock size={13} color={VERDE} /> Disponibilidad</p>
            <p className="text-sm mt-1" style={{ color: "#3C4368" }}>{at.dispo}</p>
          </div>
        </div>

        {yaSolicitado ? (
          <div className="w-full rounded-2xl py-4 text-center font-bold text-sm" style={{ background: "#E8E9F2", color: GRIS }}>
            Solicitud enviada · esperando respuesta
          </div>
        ) : escribiendo ? (
          <div className="rd-card rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-sm font-bold">Mensaje para {at.nombre.split(" ")[0]}</p>
            <textarea className="rd-input rounded-xl px-3 py-3 text-sm" rows={3}
              placeholder={`Hola, busco acompañamiento para ${regFam.para === "Para mí" ? "mí" : regFam.para.toLowerCase()} (${regFam.poblacion.toLowerCase()}${regFam.edad ? ", " + regFam.edad : ""}), en ${regFam.zona}…`}
              value={msjSolicitud} onChange={(e) => setMsjSolicitud(e.target.value)} />
            <p className="text-xs" style={{ color: "#9BA0BC" }}>
              Tu solicitud incluye tu nombre, zona y este mensaje. Los datos de contacto se comparten solo si el AT acepta.
            </p>
            <BotonPrimario onClick={() => enviarSolicitud(at)} icon={Send}>Enviar solicitud</BotonPrimario>
          </div>
        ) : (
          <BotonPrimario onClick={() => setEscribiendo(true)} icon={HeartHandshake}>Enviar solicitud de contacto</BotonPrimario>
        )}
      </div>
    </div>
  );

  /* ---------- solicitudes familia ---------- */

  const Solicitudes = (
    <div className="px-4 pb-28">
      <div className="-mx-4 px-5 pt-6 pb-5 mb-4"
        style={{ background: NAVY, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <h1 className="rd-display text-2xl" style={{ fontWeight: 800, color: "#fff" }}>Mis solicitudes</h1>
        <p className="text-xs" style={{ color: "#B9BEDC" }}>Estado de tus contactos con ATs</p>
      </div>
      {solicitudes.length === 0 ? (
        <div className="rd-card rounded-2xl p-6 text-center">
          <Inbox size={28} color={GRIS} style={{ margin: "0 auto 8px" }} />
          <p className="rd-display font-bold">Todavía no enviaste solicitudes</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>Buscá ATs en tu zona y contactá al que mejor encaje.</p>
          <button onClick={() => setTabFam("buscar")} className="mt-4 rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: CORAL, color: "#fff" }}>
            Buscar acompañantes
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {solicitudes.map((s, i) => (
            <div key={i} className="rd-card rounded-2xl p-4 flex items-center gap-3">
              <Avatar nombre={s.at} size={44} />
              <div className="flex-1 min-w-0">
                <p className="rd-display text-sm font-bold">{s.at}</p>
                <p className="text-xs" style={{ color: GRIS }}>{s.zona} · enviada {s.fecha.toLowerCase()}</p>
                {s.mensaje && <p className="text-xs mt-1 truncate" style={{ color: "#9BA0BC" }}>"{s.mensaje}"</p>}
              </div>
              <span className="text-xs font-bold px-2.5 py-1.5 rounded-full flex-shrink-0" style={{ background: "#FCF0D8", color: AMBAR }}>
                {s.estado}
              </span>
            </div>
          ))}
          <p className="text-xs text-center mt-2 px-4" style={{ color: "#9BA0BC" }}>
            Cuando el AT acepte tu solicitud, se abre un chat para coordinar una primera entrevista.
          </p>
        </div>
      )}
    </div>
  );

  /* ---------- perfil familia ---------- */

  const PerfilFam = (
    <div className="px-4 pb-28">
      <div className="pt-8 flex flex-col items-center text-center">
        <Avatar nombre={nombreFam} size={76} destacado />
        <h1 className="rd-display text-xl mt-3" style={{ fontWeight: 800 }}>{nombreFam}</h1>
        <p className="text-sm" style={{ color: GRIS }}>Busca acompañante · {regFam.zona}</p>
        {usuario && <p className="text-xs mt-0.5" style={{ color: "#9BA0BC" }}>{usuario.email}</p>}
      </div>

      {editandoPerfil ? (
        <div className="flex flex-col gap-4 mt-6">
          <Campo label="Tu nombre">
            <input className="rd-input rounded-xl px-3 py-3 text-sm" value={regFam.nombre}
              onChange={(e) => setRegFam({ ...regFam, nombre: e.target.value })} />
          </Campo>
          <div className="flex gap-3">
            <Campo label="Provincia">
              <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regFam.provincia}
                onChange={(e) => setRegFam({ ...regFam, provincia: e.target.value, zona: PROVINCIAS[e.target.value][0] })}>
                {Object.keys(PROVINCIAS).map((p) => <option key={p}>{p}</option>)}
              </select>
            </Campo>
            <Campo label="Ciudad / localidad">
              <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regFam.zona}
                onChange={(e) => setRegFam({ ...regFam, zona: e.target.value })}>
                {PROVINCIAS[regFam.provincia].map((z) => <option key={z}>{z}</option>)}
              </select>
            </Campo>
          </div>
          <Campo label="Área de acompañamiento">
            <MultiChips opciones={AREAS} valores={regFam.areas}
              onToggle={(v) => setRegFam({ ...regFam, areas: toggle(regFam.areas, v) })} />
          </Campo>
          <div className="flex gap-2">
            <button onClick={() => setEditandoPerfil(false)}
              className="flex-1 rounded-2xl py-3 font-semibold text-sm" style={{ background: "#fff", border: "1px solid #D8D6CB", color: GRIS }}>
              Cancelar
            </button>
            <button onClick={guardarPerfil}
              className="flex-1 rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2" style={{ background: CORAL, color: "#fff" }}>
              {guardandoPerfil ? <Loader2 size={16} className="animate-spin" /> : "Guardar cambios"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="rd-card rounded-2xl p-4 mt-6">
            <p className="text-sm font-bold mb-2">Buscás acompañamiento para</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: PAPEL, border: "1px solid #E4E2D8" }}>{regFam.para}</span>
              <ChipPob poblacion={regFam.poblacion} rango={regFam.edad || null} />
              {regFam.areas.map((a) => (
                <span key={a} className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: PAPEL, border: "1px solid #E4E2D8" }}>{a}</span>
              ))}
              <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: PAPEL, border: "1px solid #E4E2D8" }}>{regFam.horario}</span>
            </div>
          </div>

          <div className="rd-card rounded-2xl p-4 mt-3 flex gap-3">
            <ShieldCheck size={18} color={VERDE} style={{ flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs" style={{ color: GRIS }}>
              Tu información es privada. Solo la ven los ATs a los que enviás una solicitud, y podés borrarla cuando quieras.
            </p>
          </div>

          <button onClick={() => setEditandoPerfil(true)}
            className="w-full rounded-2xl py-3 font-semibold text-sm mt-4" style={{ background: "#fff", border: "1px solid " + VERDE, color: VERDE }}>
            Editar perfil
          </button>

          <button onClick={() => setVerAdminCud(true)}
            className="w-full rounded-2xl py-3 font-semibold text-xs mt-2 flex items-center justify-center gap-1.5" style={{ background: "#fff", border: "1px solid #D8D6CB", color: "#8B6FC9" }}>
            <Sparkles size={14} /> Modo admin: sugerencias de la IA (demo)
          </button>

          <button onClick={cerrarSesion}
            className="w-full rounded-2xl py-3 font-semibold text-sm mt-2 flex items-center justify-center gap-1.5" style={{ background: "#fff", border: "1px solid #D8D6CB", color: "#D9464A" }}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </>
      )}
    </div>
  );

  /* ================================================================ */
  /*  APP AT (idéntica al prototipo anterior, con nombre dinámico)    */
  /* ================================================================ */

  const filtradas = salidas.filter((s) =>
    (fZona === "Todas" || s.zona === fZona) && (fPob === "Todas" || s.poblacion === fPob)
  );

  const Feed = (
    <div className="px-4 pb-28">
      <div className="-mx-4 px-5 pt-6 pb-5 mb-4 flex items-center gap-3"
        style={{ background: NAVY, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <LogoRondas size={46} variant="blanco" />
        <div>
          <h1 className="rd-display text-2xl" style={{ fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>rondas</h1>
          <p className="text-xs font-bold" style={{ color: "#4FD1C5" }}>Salidas grupales entre ATs</p>
        </div>
      </div>

      {sesion && !sesion.finalizada && rol === "at" && (
        <button onClick={() => setVerEnCurso(true)}
          className="w-full rounded-2xl p-3.5 mb-3 flex items-center gap-3 text-left"
          style={{ background: VERDE }}>
          <span className="rounded-full animate-pulse flex-shrink-0" style={{ width: 9, height: 9, background: "#63E0C8", display: "inline-block" }} />
          <p className="text-sm font-bold flex-1" style={{ color: "#fff" }}>Salida en curso · {fmtTiempo(elapsedSec)}</p>
          <ChevronRight size={18} color="#fff" />
        </button>
      )}

      <button onClick={() => setVerCud(true)}
        className="w-full rounded-2xl p-3.5 mb-3 flex items-center gap-3 text-left"
        style={{ background: "#DFF3F1", border: "1px solid #CBDCCE" }}>
        <Accessibility size={20} color={VERDE} style={{ flexShrink: 0 }} />
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: VERDE }}>Actividades gratis con CUD</p>
          <p className="text-xs" style={{ color: GRIS }}>Transporte, parques y museos sin costo para tus salidas</p>
        </div>
        <ChevronRight size={18} color={VERDE} />
      </button>

      <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
        <select value={fZona} onChange={(e) => setFZona(e.target.value)}
          className="rd-input text-xs rounded-full px-3 py-2 font-semibold" style={{ width: "auto" }} aria-label="Filtrar por zona">
          <option>Todas</option>
          <ZonaOptions />
        </select>
        {["Todas", ...POBLACIONES].map((p) => (
          <button key={p} onClick={() => setFPob(p)}
            className="text-xs rounded-full px-3 py-2 font-semibold whitespace-nowrap"
            style={fPob === p ? { background: NAVY, color: "#fff" } : { background: "#fff", color: TINTA, border: "1px solid #D8D6CB" }}>
            {p}
          </button>
        ))}
      </div>

      {filtradas.length === 0 && (
        <div className="rd-card rounded-2xl p-6 text-center mt-2">
          <p className="rd-display font-bold">No hay salidas con esos filtros</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>Probá otra zona o publicá la primera.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtradas.map((s) => {
          const yaEstoy = joined.includes(s.id);
          return (
            <button key={s.id} onClick={() => setDetalleId(s.id)}
              className="rd-card rounded-2xl text-left overflow-hidden flex w-full">
              <div style={{ width: 6, background: POB_COLOR[s.poblacion], flexShrink: 0 }} />
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="rd-display text-base" style={{ fontWeight: 700, lineHeight: 1.2 }}>{s.titulo}</h2>
                  {yaEstoy && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "#DFF3F1", color: VERDE, whiteSpace: "nowrap" }}>Anotada</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs" style={{ color: GRIS }}>
                  <span className="flex items-center gap-1"><CalendarDays size={13} />{s.fecha} · {s.hora}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} />{s.zona}</span>
                </div>
                <div className="mt-2"><ChipPob poblacion={s.poblacion} rango={s.rango} /></div>
                <div className="mt-3"><CupoDots salida={s} joined={yaEstoy} yo={yoAT} /></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const pinPosSalida = (s, i) => {
    const base = COORDS_REALES[s.zona] || COORDS_REALES["Palermo"];
    const prev = filtradas.slice(0, i).filter((x) => x.zona === s.zona).length;
    return [base[0] + prev * 0.004, base[1] + prev * 0.004];
  };
  const centroSalidas = COORDS_REALES[regAT.zona] || COORDS_REALES["Palermo"];

  const MapaSalidas = (
    <div className="px-4 pb-28">
      <div className="-mx-4 px-5 pt-6 pb-5 mb-4"
        style={{ background: NAVY, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <h1 className="rd-display text-2xl" style={{ fontWeight: 800, color: "#fff" }}>Mapa de salidas</h1>
        <p className="text-xs" style={{ color: "#B9BEDC" }}>Dónde se están coordinando actividades ahora mismo</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
        <select value={fZona} onChange={(e) => setFZona(e.target.value)}
          className="rd-input text-xs rounded-full px-3 py-2 font-semibold" style={{ width: "auto" }} aria-label="Filtrar por zona">
          <option>Todas</option>
          <ZonaOptions />
        </select>
        {["Todas", ...POBLACIONES].map((p) => (
          <button key={p} onClick={() => setFPob(p)}
            className="text-xs rounded-full px-3 py-2 font-semibold whitespace-nowrap"
            style={fPob === p ? { background: NAVY, color: "#fff" } : { background: "#fff", color: TINTA, border: "1px solid #D8D6CB" }}>
            {p}
          </button>
        ))}
      </div>

      {filtradas.length === 0 && (
        <div className="rd-card rounded-2xl p-6 text-center mt-2">
          <p className="rd-display font-bold">No hay salidas con esos filtros</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>Probá otra zona o publicá la primera.</p>
        </div>
      )}

      <div className="rd-card rounded-2xl overflow-hidden" style={{ height: 320 }}>
        {GOOGLE_MAPS_KEY ? (
          <GoogleMap
            defaultCenter={{ lat: centroSalidas[0], lng: centroSalidas[1] }}
            defaultZoom={12}
            mapId="DEMO_MAP_ID"
            gestureHandling="greedy"
            disableDefaultUI
            style={{ width: "100%", height: "100%" }}
          >
            {filtradas.map((s, i) => {
              const [lat, lng] = pinPosSalida(s, i);
              const c = POB_COLOR[s.poblacion];
              const sel = pinSelSalida === i;
              return (
                <AdvancedMarker key={s.id} position={{ lat, lng }} onClick={() => setPinSelSalida(i)} title={s.titulo}>
                  <div className="rounded-full" style={{ width: sel ? 20 : 16, height: sel ? 20 : 16, background: c, border: "2.5px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.35)", cursor: "pointer" }} />
                </AdvancedMarker>
              );
            })}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-center px-6" style={{ color: GRIS }}>
            <p className="text-xs">Mapa no disponible: falta configurar Google Maps.</p>
          </div>
        )}
      </div>

      {pinSelSalida !== null && filtradas[pinSelSalida] ? (
        <div className="rd-card rounded-2xl p-4 mt-3 flex items-center gap-3">
          <div className="rounded-full flex-shrink-0" style={{ width: 10, height: 10, background: POB_COLOR[filtradas[pinSelSalida].poblacion] }} />
          <div className="flex-1 min-w-0">
            <p className="rd-display text-sm font-bold truncate">{filtradas[pinSelSalida].titulo}</p>
            <p className="text-xs" style={{ color: GRIS }}>
              {filtradas[pinSelSalida].zona} · {filtradas[pinSelSalida].fecha} · {filtradas[pinSelSalida].hora}
            </p>
          </div>
          <button onClick={() => { setDetalleId(filtradas[pinSelSalida].id); setPinSelSalida(null); }}
            className="text-xs font-bold px-3 py-2 rounded-full flex-shrink-0" style={{ background: CORAL, color: "#fff" }}>
            Ver detalle
          </button>
        </div>
      ) : (
        <p className="text-xs text-center mt-3" style={{ color: "#9BA0BC" }}>
          Tocá un pin para ver el detalle. Las ubicaciones son por zona, nunca exactas.
        </p>
      )}
    </div>
  );

  const Detalle = salida && (
    <div className="pb-28">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3" style={{ background: POB_COLOR[salida.poblacion] + "14" }}>
        <button onClick={() => setDetalleId(null)} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <ChipPob poblacion={salida.poblacion} rango={salida.rango} />
          <h1 className="rd-display text-xl mt-1" style={{ fontWeight: 800, lineHeight: 1.15 }}>{salida.titulo}</h1>
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-3">
        <div className="rd-card rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <CalendarDays size={16} color={VERDE} /><span className="font-semibold">{salida.fecha}</span>
            <Clock size={16} color={VERDE} /><span className="font-semibold">{salida.hora}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <MapPin size={16} color={VERDE} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{salida.lugar} <span style={{ color: GRIS }}>· {salida.zona}</span></span>
          </div>
          {salida.notas && <p className="text-sm rounded-xl p-3" style={{ background: PAPEL, color: "#3C4368" }}>{salida.notas}</p>}
        </div>

        <div className="rd-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} color={VERDE} />
            <span className="text-sm font-bold">Acompañantes ({salida.participantes.length}/{salida.cupo})</span>
          </div>
          <div className="flex flex-col gap-2">
            {salida.participantes.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <Avatar nombre={p} destacado={p === yoAT} />
                <span className="text-sm font-semibold">{p === yoAT ? "Vos" : p}</span>
                {p === salida.creador && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: PAPEL, color: GRIS }}>Organiza</span>}
              </div>
            ))}
          </div>
          <div className="mt-3"><CupoDots salida={salida} joined={joined.includes(salida.id)} yo={yoAT} /></div>
        </div>

        {joined.includes(salida.id) ? (
          <div className="flex flex-col gap-2">
            <BotonPrimario icon={MessageCircle} onClick={() => { setChatId(salida.id); setDetalleId(null); setTab("chats"); }}>
              Abrir chat de la salida
            </BotonPrimario>
            {sesion && !sesion.finalizada ? (
              <button onClick={() => { setDetalleId(null); setVerEnCurso(true); }}
                className="w-full rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: "#DFF3F1", color: VERDE }}>
                <Navigation size={15} /> Ver salida en curso · {fmtTiempo(elapsedSec)}
              </button>
            ) : (
              <button onClick={() => { iniciarSesion(salida.titulo, yoAT, false, salida.zona); setDetalleId(null); setVerEnCurso(true); }}
                className="w-full rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: "#fff", border: "1.5px solid " + VERDE, color: VERDE }}>
                <Play size={15} /> Iniciar salida en vivo
              </button>
            )}
            {salida.creador !== yoAT && (
              <button onClick={() => bajarme(salida.id)} className="w-full rounded-2xl py-3 font-semibold text-sm" style={{ background: "#fff", border: "1px solid #D8D6CB", color: "#D9464A" }}>
                Bajarme de la salida
              </button>
            )}
          </div>
        ) : salida.participantes.length >= salida.cupo ? (
          <div className="w-full rounded-2xl py-4 text-center font-bold text-sm" style={{ background: "#E8E9F2", color: GRIS }}>Cupo completo</div>
        ) : (
          <BotonPrimario onClick={() => sumarme(salida.id)}>Sumarme a la salida</BotonPrimario>
        )}
        <p className="text-xs text-center px-4" style={{ color: "#9BA0BC" }}>
          Las salidas solo muestran datos de la actividad. La información de los acompañados nunca se publica.
        </p>
      </div>
    </div>
  );

  const Publicar = (
    <div className="px-4 pb-28">
      <div className="-mx-4 px-5 pt-6 pb-5 mb-4"
        style={{ background: NAVY, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <h1 className="rd-display text-2xl" style={{ fontWeight: 800, color: "#fff" }}>Publicar salida</h1>
        <p className="text-xs" style={{ color: "#B9BEDC" }}>Proponé una actividad y sumá a otros ATs</p>
      </div>

      <div className="flex flex-col gap-3">
        <Campo label="Actividad">
          <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="Ej: Tarde en Plaza Irlanda"
            value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
        </Campo>
        <Campo label="Lugar y punto de encuentro">
          <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="Ej: entrada por Av. Gaona"
            value={form.lugar} onChange={(e) => setForm({ ...form, lugar: e.target.value })} />
        </Campo>

        <div className="flex gap-3">
          <Campo label="Fecha">
            <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="Sáb 25 Jul" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          </Campo>
          <Campo label="Hora">
            <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="16:00" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} />
          </Campo>
        </div>

        <div className="flex gap-3">
          <Campo label="Zona">
            <select className="rd-input rounded-xl px-3 py-3 text-sm" value={form.zona} onChange={(e) => setForm({ ...form, zona: e.target.value })}>
              <ZonaOptions />
            </select>
          </Campo>
          <Campo label="Población">
            <select className="rd-input rounded-xl px-3 py-3 text-sm" value={form.poblacion} onChange={(e) => setForm({ ...form, poblacion: e.target.value })}>
              {POBLACIONES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Campo>
        </div>

        <div className="flex gap-3">
          <div style={{ flex: 1 }}>
            <Campo label="Rango etario de los acompañados">
              <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="Ej: 6 a 10 años" value={form.rango} onChange={(e) => setForm({ ...form, rango: e.target.value })} />
            </Campo>
          </div>
          <div style={{ width: 110 }}>
            <Campo label="Cupo de ATs">
              <select className="rd-input rounded-xl px-3 py-3 text-sm" value={form.cupo} onChange={(e) => setForm({ ...form, cupo: e.target.value })}>
                {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Campo>
          </div>
        </div>

        <Campo label="Notas de la actividad">
          <textarea className="rd-input rounded-xl px-3 py-3 text-sm" rows={3}
            placeholder="Accesibilidad, nivel de estímulo del lugar, qué llevar… (sin datos personales de los acompañados)"
            value={form.notas} onChange={(e) => { setForm({ ...form, notas: e.target.value }); setRevision(null); }} />
          <span className="text-xs flex items-center gap-1" style={{ color: VERDE }}>
            <Sparkles size={12} /> Guardián de privacidad: revisamos tus notas con IA antes de publicar.
          </span>
        </Campo>

        {revision && (
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "#FDF3DC", border: "1px solid #E5C77E" }}>
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} color="#B57A12" />
              <p className="text-sm font-bold" style={{ color: "#7C6420" }}>Detectamos datos sensibles del acompañado</p>
            </div>
            <ul className="flex flex-col gap-1">
              {revision.hallazgos.map((h, i) => (
                <li key={i} className="text-xs flex gap-2" style={{ color: "#7C6420" }}>
                  <span style={{ flexShrink: 0 }}>•</span><span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl p-3" style={{ background: "#fff", border: "1px solid #E5C77E" }}>
              <p className="text-xs font-bold mb-1" style={{ color: VERDE }}>Versión segura sugerida</p>
              <p className="text-sm" style={{ color: "#3C4368" }}>{revision.version_segura}</p>
            </div>
            <BotonPrimario icon={ShieldCheck} onClick={() => publicarDirecto(revision.version_segura, "Publicada con la versión segura")}>
              Usar versión segura y publicar
            </BotonPrimario>
            <div className="flex gap-2">
              <button onClick={() => setRevision(null)}
                className="flex-1 rounded-2xl py-3 font-semibold text-xs" style={{ background: "#fff", border: "1px solid #D8D6CB", color: TINTA }}>
                Seguir editando
              </button>
              <button onClick={() => publicarDirecto(form.notas, "Salida publicada")}
                className="flex-1 rounded-2xl py-3 font-semibold text-xs" style={{ background: "transparent", color: "#D9464A" }}>
                Publicar igual
              </button>
            </div>
          </div>
        )}

        {!revision && (
          revisando ? (
            <div className="w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: "#DFF3F1", color: VERDE }}>
              <Sparkles size={16} className="animate-pulse" /> Revisando privacidad…
            </div>
          ) : (
            <BotonPrimario onClick={publicar}>Publicar salida</BotonPrimario>
          )
        )}
      </div>
    </div>
  );

  const misChats = salidas.filter((s) => joined.includes(s.id));

  const ChatsList = (
    <div className="px-4 pb-28">
      <div className="-mx-4 px-5 pt-6 pb-5 mb-4"
        style={{ background: NAVY, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <h1 className="rd-display text-2xl" style={{ fontWeight: 800, color: "#fff" }}>Chats</h1>
        <p className="text-xs" style={{ color: "#B9BEDC" }}>Coordinación por salida</p>
      </div>
      {misChats.length === 0 ? (
        <div className="rd-card rounded-2xl p-6 text-center">
          <MessageCircle size={28} color={GRIS} style={{ margin: "0 auto 8px" }} />
          <p className="rd-display font-bold">Todavía no tenés chats</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>Sumate a una salida para coordinar con otros ATs.</p>
          <button onClick={() => setTab("salidas")} className="mt-4 rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: CORAL, color: "#fff" }}>
            Ver salidas
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {misChats.map((s) => {
            const ms = chats[s.id] || [];
            const ultimo = ms.filter((m) => m.autor !== "sistema").slice(-1)[0];
            return (
              <button key={s.id} onClick={() => setChatId(s.id)} className="rd-card rounded-2xl p-4 text-left flex items-center gap-3 w-full">
                <div className="rounded-full flex-shrink-0" style={{ width: 10, height: 10, background: POB_COLOR[s.poblacion] }} />
                <div className="flex-1 min-w-0">
                  <p className="rd-display text-sm font-bold truncate">{s.titulo}</p>
                  <p className="text-xs truncate" style={{ color: GRIS }}>
                    {ultimo ? `${ultimo.autor === yoAT ? "Vos" : ultimo.autor}: ${ultimo.texto}` : "Sin mensajes todavía"}
                  </p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: "#9BA0BC" }}>{s.fecha}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const ChatThread = chatSalida && (
    <div className="flex flex-col" style={{ height: "100%" }}>
      <div className="px-4 py-3 flex items-center gap-3 rd-card" style={{ borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none" }}>
        <button onClick={() => setChatId(null)} className="rounded-full p-2" style={{ background: PAPEL }} aria-label="Volver a chats">
          <ChevronLeft size={18} />
        </button>
        <div className="min-w-0">
          <p className="rd-display text-sm font-bold truncate">{chatSalida.titulo}</p>
          <p className="text-xs" style={{ color: GRIS }}>{chatSalida.fecha} · {chatSalida.hora} · {chatSalida.participantes.length} ATs</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ paddingBottom: 130 }}>
        {(chats[chatSalida.id] || []).map((m, i) =>
          m.autor === "sistema" ? (
            <p key={i} className="text-xs text-center" style={{ color: "#9BA0BC" }}>— {m.texto} —</p>
          ) : (
            <div key={i} className={`flex ${m.autor === yoAT ? "justify-end" : "justify-start"}`}>
              <div className="rounded-2xl px-3 py-2 text-sm"
                style={{ maxWidth: "80%", background: m.autor === yoAT ? NAVY : "#fff", color: m.autor === yoAT ? "#fff" : TINTA, border: m.autor === yoAT ? "none" : "1px solid #E4E2D8" }}>
                {m.autor !== yoAT && <p className="text-xs font-bold mb-0.5" style={{ color: POB_COLOR[chatSalida.poblacion] }}>{m.autor}</p>}
                <p>{m.texto}</p>
                {m.hora && <p className="text-right" style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{m.hora}</p>}
              </div>
            </div>
          )
        )}
      </div>

      <div className="px-4 py-3 flex gap-2 items-center" style={{ position: "absolute", bottom: 76, left: 0, right: 0, background: PAPEL }}>
        <input className="rd-input rounded-full px-4 py-3 text-sm flex-1" placeholder="Escribí un mensaje…"
          value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && enviarMsg()} />
        <button onClick={enviarMsg} className="rounded-full p-3" style={{ background: CORAL }} aria-label="Enviar">
          <Send size={16} color="#fff" />
        </button>
      </div>
    </div>
  );

  const PerfilAT = (
    <div className="px-4 pb-28">
      <div className="pt-8 flex flex-col items-center text-center">
        <Avatar nombre={nombrePerfilAT} size={76} destacado />
        <h1 className="rd-display text-xl mt-3" style={{ fontWeight: 800 }}>{nombrePerfilAT}</h1>
        <p className="text-sm" style={{ color: GRIS }}>Acompañante terapéutico/a · {regAT.zona}</p>
        {usuario && <p className="text-xs mt-0.5" style={{ color: "#9BA0BC" }}>{usuario.email}</p>}
        <div className="flex items-center gap-1 mt-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={regAT.cert ? { background: "#DFF3F1", color: VERDE } : { background: "#FCF0D8", color: AMBAR }}>
          <BadgeCheck size={14} /> {regAT.cert ? "Verificado" : "Certificado pendiente de carga"}
        </div>
      </div>

      {editandoPerfil ? (
        <div className="flex flex-col gap-4 mt-6">
          <Campo label="Nombre y apellido">
            <input className="rd-input rounded-xl px-3 py-3 text-sm" value={regAT.nombre}
              onChange={(e) => setRegAT({ ...regAT, nombre: e.target.value })} />
          </Campo>
          <div className="flex gap-3">
            <Campo label="Provincia">
              <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regAT.provincia}
                onChange={(e) => setRegAT({ ...regAT, provincia: e.target.value, zona: PROVINCIAS[e.target.value][0] })}>
                {Object.keys(PROVINCIAS).map((p) => <option key={p}>{p}</option>)}
              </select>
            </Campo>
            <Campo label="Ciudad / localidad">
              <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regAT.zona}
                onChange={(e) => setRegAT({ ...regAT, zona: e.target.value })}>
                {PROVINCIAS[regAT.provincia].map((z) => <option key={z}>{z}</option>)}
              </select>
            </Campo>
          </div>
          <Campo label="Poblaciones">
            <MultiChips opciones={POBLACIONES} valores={regAT.poblaciones} colorMap={POB_COLOR}
              onToggle={(v) => setRegAT({ ...regAT, poblaciones: toggle(regAT.poblaciones, v) })} />
          </Campo>
          <Campo label="Áreas de especialidad">
            <MultiChips opciones={AREAS} valores={regAT.areas}
              onToggle={(v) => setRegAT({ ...regAT, areas: toggle(regAT.areas, v) })} />
          </Campo>
          <Campo label="Años de experiencia">
            <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regAT.exp}
              onChange={(e) => setRegAT({ ...regAT, exp: e.target.value })}>
              {["Menos de 1 año", "1 a 3 años", "3 a 7 años", "Más de 7 años"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Campo>
          <div className="flex gap-2">
            <button onClick={() => setEditandoPerfil(false)}
              className="flex-1 rounded-2xl py-3 font-semibold text-sm" style={{ background: "#fff", border: "1px solid #D8D6CB", color: GRIS }}>
              Cancelar
            </button>
            <button onClick={guardarPerfil}
              className="flex-1 rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2" style={{ background: CORAL, color: "#fff" }}>
              {guardandoPerfil ? <Loader2 size={16} className="animate-spin" /> : "Guardar cambios"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-3 mt-6">
            {[{ n: 0, l: "salidas realizadas" }, { n: joined.length, l: "próximas salidas" }].map((s) => (
              <div key={s.l} className="rd-card rounded-2xl p-4 flex-1 text-center">
                <p className="rd-display text-2xl" style={{ fontWeight: 800, color: VERDE }}>{s.n}</p>
                <p className="text-xs mt-1" style={{ color: GRIS }}>{s.l}</p>
              </div>
            ))}
          </div>

          <div className="rd-card rounded-2xl p-4 mt-3">
            <p className="text-sm font-bold mb-2">Poblaciones y especialidades</p>
            <div className="flex flex-wrap gap-2">
              {regAT.poblaciones.map((p) => <ChipPob key={p} poblacion={p} />)}
              {regAT.areas.map((e) => (
                <span key={e} className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: PAPEL, border: "1px solid #E4E2D8" }}>{e}</span>
              ))}
              {regAT.poblaciones.length === 0 && regAT.areas.length === 0 && (
                <span className="text-xs" style={{ color: "#9BA0BC" }}>Completá tus especialidades desde "Editar perfil".</span>
              )}
            </div>
          </div>

          <div className="rd-card rounded-2xl p-4 mt-3">
            <p className="text-sm font-bold mb-1">Zona de trabajo</p>
            <p className="text-sm flex items-center gap-1" style={{ color: GRIS }}><MapPin size={14} /> {regAT.zona} y alrededores</p>
          </div>

          <div className="rd-card rounded-2xl p-4 mt-3">
            <p className="text-sm font-bold mb-1">Experiencia</p>
            <p className="text-sm" style={{ color: GRIS }}>{regAT.exp}</p>
          </div>

          <div className="rd-card rounded-2xl p-4 mt-3 flex items-center gap-3">
            <div className="rounded-2xl p-2.5 flex-shrink-0" style={{ background: plan === "free" ? PAPEL : "#DFF3F1" }}>
              <Crown size={20} color={plan === "free" ? "#9BA0BC" : VERDE} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Plan {plan === "free" ? "Free" : plan === "plus" ? "Plus" : "Pro"}</p>
              <p className="text-xs" style={{ color: GRIS }}>
                {plan === "free" ? "1 informe con IA por mes · 2 solicitudes de familias" : plan === "plus" ? "Informes ilimitados · planificador IA" : "Todo Plus + agenda y exportación"}
              </p>
            </div>
            <button onClick={() => setVerPlanes(true)} className="text-xs font-bold px-3 py-2 rounded-full flex-shrink-0"
              style={{ background: CORAL, color: "#fff" }}>
              {plan === "free" ? "Mejorar" : "Ver planes"}
            </button>
          </div>

          <button onClick={() => setEditandoPerfil(true)}
            className="w-full rounded-2xl py-3 font-semibold text-sm mt-4" style={{ background: "#fff", border: "1px solid " + VERDE, color: VERDE }}>
            Editar perfil
          </button>

          <button onClick={() => setVerAdminCud(true)}
            className="w-full rounded-2xl py-3 font-semibold text-xs mt-2 flex items-center justify-center gap-1.5" style={{ background: "#fff", border: "1px solid #D8D6CB", color: "#8B6FC9" }}>
            <Sparkles size={14} /> Modo admin: sugerencias de la IA (demo)
          </button>

          <button onClick={cerrarSesion}
            className="w-full rounded-2xl py-3 font-semibold text-sm mt-2 flex items-center justify-center gap-1.5" style={{ background: "#fff", border: "1px solid #D8D6CB", color: "#D9464A" }}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </>
      )}
    </div>
  );

  /* ================================================================ */
  /*  PANTALLA: ACTIVIDADES GRATIS CON CUD                            */
  /* ================================================================ */

  const zonaParaForm = (actividad) => (ZONAS.includes(actividad.zona) ? actividad.zona : "Palermo");

  const toggleFavoritoCud = (id) => {
    setFavoritosCud((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const cudAprobadas = cudActividades.filter((a) =>
    a.estado === "aprobada" &&
    (cudProvincia === "Todas" || a.provincia === cudProvincia) &&
    (cudBadge === "Todas" || a.badge === cudBadge)
  );

  const Cud = (
    <div className="px-4 pb-28">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => setVerCud(false)} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>Gratis con CUD</h1>
          <p className="text-xs" style={{ color: GRIS }}>Beneficios del Certificado Único de Discapacidad en todo el país</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 mb-1">
        {Object.entries(CUD_BADGES).map(([key, b]) => (
          <span key={key} className="text-xs font-semibold flex items-center gap-1.5">
            <span className="rounded-full" style={{ width: 8, height: 8, background: b.color, display: "inline-block" }} />
            {b.label}
          </span>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mt-2" style={{ scrollbarWidth: "none" }}>
        <select value={cudProvincia} onChange={(e) => setCudProvincia(e.target.value)}
          className="rd-input text-xs rounded-full px-3 py-2 font-semibold" style={{ width: "auto" }} aria-label="Filtrar por provincia">
          <option>Todas</option>
          {CUD_PROVINCIAS.map((p) => <option key={p}>{p}</option>)}
        </select>
        {["Todas", ...Object.keys(CUD_BADGES)].map((b) => (
          <button key={b} onClick={() => setCudBadge(b)}
            className="text-xs rounded-full px-3 py-2 font-semibold whitespace-nowrap"
            style={cudBadge === b ? { background: NAVY, color: "#fff" } : { background: "#fff", color: TINTA, border: "1px solid #D8D6CB" }}>
            {b === "Todas" ? "Todas" : CUD_BADGES[b].label}
          </button>
        ))}
      </div>

      {cudAprobadas.length === 0 && (
        <div className="rd-card rounded-2xl p-6 text-center mt-2">
          <p className="rd-display font-bold">No hay actividades con esos filtros</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>Probá otra provincia o beneficio.</p>
        </div>
      )}

      <div className="flex flex-col gap-3 mt-3">
        {cudAprobadas.map((a) => {
          const badge = CUD_BADGES[a.badge];
          const guardado = favoritosCud.includes(a.id);
          return (
            <div key={a.id} className="rd-card rounded-2xl p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="rd-display text-sm flex-1" style={{ fontWeight: 700 }}>{a.nombre}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: badge.color + "1A", color: badge.color }}>
                  {badge.label}
                </span>
              </div>
              <p className="text-xs mt-1 flex items-center gap-1" style={{ color: GRIS }}>
                <MapPin size={12} /> {a.provincia} · {a.zona} <span style={{ color: "#C9CBDE" }}>·</span> {a.tipo}
              </p>
              <p className="text-sm mt-2" style={{ color: "#3C4368" }}>{a.descripcion}</p>
              {a.acompanante && (
                <p className="text-xs mt-2 flex items-start gap-1.5" style={{ color: "#3C4368" }}>
                  <Users size={13} color={VERDE} style={{ flexShrink: 0, marginTop: 1 }} /> Acompañante: {a.acompanante}
                </p>
              )}
              {a.reserva && (
                <p className="text-xs mt-1.5 flex items-start gap-1.5" style={{ color: "#7C6420" }}>
                  <Clock size={13} style={{ flexShrink: 0, marginTop: 1 }} /> {a.reserva}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {a.poblaciones.map((p) => <ChipPob key={p} poblacion={p} />)}
              </div>
              {rol === "at" ? (
                <button
                  onClick={() => {
                    setForm({ ...form, titulo: a.nombre, lugar: `${a.nombre} · ${a.zona}`, zona: zonaParaForm(a) });
                    setVerCud(false); setTab("publicar");
                    avisar("Datos precargados en tu salida");
                  }}
                  className="mt-3 text-xs font-bold px-3 py-2 rounded-full"
                  style={{ background: CORAL, color: "#fff" }}>
                  Crear salida acá
                </button>
              ) : (
                <button
                  onClick={() => toggleFavoritoCud(a.id)}
                  className="mt-3 text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1.5"
                  style={guardado ? { background: "#FCF0D8", color: AMBAR } : { background: "#fff", border: "1px solid #D8D6CB", color: TINTA }}>
                  <Star size={13} color={guardado ? AMBAR : TINTA} fill={guardado ? AMBAR : "none"} />
                  {guardado ? "Guardada" : "Guardar"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-center mt-4 px-4" style={{ color: "#9BA0BC" }}>
        Los beneficios pueden cambiar. Verificá condiciones vigentes antes de cada salida. El CUD digital está en la app Mi Argentina.
      </p>
    </div>
  );

  /* ================================================================ */
  /*  PANTALLA: SUGERENCIAS DE LA IA (modo admin, demo)                */
  /* ================================================================ */

  const cudPendientes = cudActividades.filter((a) => a.estado === "pendiente");

  const aprobarCud = (id) => {
    setCudActividades((p) => p.map((a) => (a.id === id ? { ...a, estado: "aprobada" } : a)));
    avisar("Actividad aprobada y publicada en la guía");
  };
  const descartarCud = (id) => {
    setCudActividades((p) => p.filter((a) => a.id !== id));
    avisar("Sugerencia descartada");
  };

  const SugerenciasIA = (
    <div className="px-4 pb-28">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => setVerAdminCud(false)} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold" style={{ color: "#8B6FC9" }}>MODO ADMIN · DEMO</p>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>Sugerencias de la IA</h1>
        </div>
      </div>

      <div className="rounded-2xl p-3 mt-4 flex gap-2.5" style={{ background: "#F7EFFF" }}>
        <Sparkles size={16} color="#8B6FC9" style={{ flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: "#6B4FA0" }}>
          Actividades que la IA encontró y todavía no fueron revisadas. Aprobalas para publicarlas en la guía pública, o descartalas.
        </p>
      </div>

      {/*
        En producción, este listado se alimenta llamando a la API de Anthropic
        con la herramienta de web search para rastrear beneficios CUD nuevos o
        actualizados. Cada resultado que encuentra cae en una cola de moderación
        en la base de datos con estado "pendiente" hasta que alguien del equipo
        lo aprueba o descarta desde esta misma pantalla.
      */}

      {cudPendientes.length === 0 ? (
        <div className="rd-card rounded-2xl p-6 text-center mt-4">
          <p className="rd-display font-bold">No hay sugerencias pendientes</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>La IA va a traer nuevas actividades para revisar acá.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
          {cudPendientes.map((a) => (
            <div key={a.id} className="rd-card rounded-2xl p-4">
              <p className="rd-display text-sm" style={{ fontWeight: 700 }}>{a.nombre}</p>
              <p className="text-xs mt-1 flex items-center gap-1" style={{ color: GRIS }}>
                <MapPin size={12} /> {a.provincia} · {a.zona}
              </p>
              <p className="text-sm mt-2" style={{ color: "#3C4368" }}>{a.descripcion}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => aprobarCud(a.id)}
                  className="flex-1 rounded-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                  style={{ background: VERDE, color: "#fff" }}>
                  <Check size={14} /> Aprobar
                </button>
                <button onClick={() => descartarCud(a.id)}
                  className="flex-1 rounded-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                  style={{ background: "#fff", border: "1px solid #D8D6CB", color: "#D9464A" }}>
                  <X size={14} /> Descartar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ================================================================ */
  /*  SALIDA EN CURSO — lado AT                                       */
  /* ================================================================ */

  const EnCursoAT = sesion && (
    <div className="px-4 pb-28">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => setVerEnCurso(false)} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>Salida en curso</h1>
          <p className="text-xs" style={{ color: GRIS }}>{sesion.titulo}</p>
        </div>
      </div>

      {!sesion.finalizada ? (
        <>
          <div className="rounded-2xl p-3 mt-4 flex items-center gap-3" style={{ background: VERDE }}>
            <div className="rounded-full flex-shrink-0" style={{ width: 10, height: 10, background: "#63E0C8" }}>
              <div className="rounded-full animate-ping" style={{ width: 10, height: 10, background: "#63E0C8", opacity: 0.6 }} />
            </div>
            <p className="text-xs font-bold flex-1" style={{ color: "#fff" }}>
              Estás compartiendo tu ubicación con las familias del grupo
            </p>
            <span className="rd-display text-base font-bold" style={{ color: "#fff" }}>{fmtTiempo(elapsedSec)}</span>
          </div>

          <div className="rd-card rounded-2xl overflow-hidden mt-3">
            <MapaVivo />
          </div>

          <p className="text-xs font-bold mt-4 mb-2">Enviar aviso a las familias</p>
          <div className="flex flex-wrap gap-2">
            {["Llegamos", "Todo bien", "Merienda", "Volviendo al punto de encuentro"].map((c) => (
              <button key={c} onClick={() => agregarCheckin(c)}
                className="text-xs font-bold px-4 py-2.5 rounded-full"
                style={{ background: "#fff", border: "1.5px solid " + VERDE, color: VERDE }}>
                {c}
              </button>
            ))}
          </div>

          <div className="rd-card rounded-2xl p-4 mt-4">
            <p className="text-sm font-bold mb-2">Avisos enviados</p>
            <div className="flex flex-col gap-2">
              {[...sesion.checkins].reverse().map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: VERDE, marginTop: 2 }}>{c.hora}</span>
                  <span style={{ color: "#3C4368" }}>{c.texto}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={finalizarSesion}
            className="w-full rounded-2xl py-4 font-bold text-sm mt-4 flex items-center justify-center gap-2"
            style={{ background: "#fff", border: "1.5px solid #8A4A3C", color: "#D9464A" }}>
            <Square size={14} /> Finalizar salida
          </button>
          <p className="text-xs text-center mt-2 px-4" style={{ color: "#9BA0BC" }}>
            Al finalizar, la ubicación deja de compartirse y las familias reciben el resumen. El recorrido se borra a las 48 hs.
          </p>
        </>
      ) : (
        <div className="rd-card rounded-2xl p-5 mt-4 text-center">
          <div className="rounded-full mx-auto flex items-center justify-center" style={{ width: 52, height: 52, background: "#DFF3F1" }}>
            <Check size={26} color={VERDE} />
          </div>
          <p className="rd-display text-lg mt-3" style={{ fontWeight: 800 }}>Salida finalizada</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>
            Duración {fmtTiempo(Math.floor(((sesion.finTs || Date.now()) - sesion.inicioTs) / 1000))} · {sesion.checkins.length} avisos enviados
          </p>
          <p className="text-xs mt-2" style={{ color: "#9BA0BC" }}>Las familias ya recibieron el resumen. La ubicación dejó de compartirse.</p>
          <button onClick={() => { setSesion(null); setVerEnCurso(false); }}
            className="mt-4 rounded-full px-6 py-2.5 text-sm font-bold" style={{ background: CORAL, color: "#fff" }}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );

  /* ================================================================ */
  /*  SEGUIMIENTO EN VIVO — lado familia                              */
  /* ================================================================ */

  const Seguimiento = (
    <div className="px-4 pb-28">
      <div className="-mx-4 px-5 pt-6 pb-5 mb-4"
        style={{ background: NAVY, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <h1 className="rd-display text-2xl" style={{ fontWeight: 800, color: "#fff" }}>Seguimiento en vivo</h1>
        <p className="text-xs" style={{ color: "#B9BEDC" }}>Solo activo mientras dura la salida. Fuera de ese lapso, nadie comparte ubicación.</p>
      </div>

      {sesion && !sesion.finalizada ? (
        <>
          <div className="rd-card rounded-2xl p-4 flex items-center gap-3">
            <Avatar nombre={sesion.at} size={44} destacado />
            <div className="flex-1 min-w-0">
              <p className="rd-display text-sm font-bold">{sesion.at}</p>
              <p className="text-xs" style={{ color: GRIS }}>{sesion.titulo}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ background: "#DFF3F1", color: VERDE }}>
                <span className="rounded-full animate-pulse" style={{ width: 7, height: 7, background: VERDE, display: "inline-block" }} />
                En curso
              </span>
              <p className="rd-display text-sm font-bold mt-1" style={{ color: VERDE }}>{fmtTiempo(elapsedSec)}</p>
            </div>
          </div>

          <div className="rd-card rounded-2xl overflow-hidden mt-3">
            <MapaVivo />
          </div>

          <div className="flex gap-2 mt-3">
            <button onClick={() => avisar(`Llamando a ${sesion.at.split(" ")[0]}… (demo)`)}
              className="flex-1 rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: VERDE, color: "#fff" }}>
              <Phone size={15} /> Llamar al AT
            </button>
            <button onClick={() => avisar("Mensaje enviado (demo)")}
              className="flex-1 rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: "#fff", border: "1px solid " + VERDE, color: VERDE }}>
              <MessageCircle size={15} /> Mensaje
            </button>
          </div>

          <div className="rd-card rounded-2xl p-4 mt-3">
            <p className="text-sm font-bold mb-2">Avisos de la salida</p>
            <div className="flex flex-col gap-2">
              {[...sesion.checkins].reverse().map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: VERDE, marginTop: 2 }}>{c.hora}</span>
                  <span style={{ color: "#3C4368" }}>{c.texto}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-center mt-3 px-4" style={{ color: "#9BA0BC" }}>
            La ubicación es del profesional durante la sesión, se muestra de forma aproximada y se borra a las 48 hs.
          </p>
        </>
      ) : sesion && sesion.finalizada ? (
        <div className="rd-card rounded-2xl p-5 text-center">
          <div className="rounded-full mx-auto flex items-center justify-center" style={{ width: 52, height: 52, background: "#DFF3F1" }}>
            <Check size={26} color={VERDE} />
          </div>
          <p className="rd-display text-lg mt-3" style={{ fontWeight: 800 }}>Salida finalizada</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>
            {sesion.at} · duración {fmtTiempo(Math.floor(((sesion.finTs || Date.now()) - sesion.inicioTs) / 1000))} · {sesion.checkins.length} avisos
          </p>
          <button onClick={() => setSesion(null)}
            className="mt-4 rounded-full px-6 py-2.5 text-sm font-bold" style={{ background: "#fff", border: "1px solid #D8D6CB", color: GRIS }}>
            Cerrar resumen
          </button>
        </div>
      ) : (
        <div className="rd-card rounded-2xl p-6 text-center">
          <Navigation size={28} color={GRIS} style={{ margin: "0 auto 8px" }} />
          <p className="rd-display font-bold">No hay salidas en curso</p>
          <p className="text-sm mt-1" style={{ color: GRIS }}>
            Cuando el AT inicie una salida, vas a ver acá el recorrido y sus avisos en tiempo real.
          </p>
          <button onClick={() => iniciarSesion("Recorrido Jardín Botánico", "Carmen Aguirre", true, "Palermo")}
            className="mt-4 rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: CORAL, color: "#fff" }}>
            Ver demo en vivo
          </button>
        </div>
      )}
    </div>
  );

  /* ================================================================ */
  /*  PANTALLA: PLANES (lado AT)                                      */
  /* ================================================================ */

  const PLANES = [
    {
      id: "free", nombre: "Free", precio: "$0", detalle: "para siempre",
      features: ["Perfil verificado", "Salidas ilimitadas (crear y sumarte)", "Chats de coordinación", "Guardián de privacidad con IA", "1 informe con IA por mes", "Hasta 2 solicitudes de familias por mes"],
    },
    {
      id: "plus", nombre: "Plus", precio: "ARS 9.900", detalle: "por mes · 99.000/año (2 meses gratis)", destacado: true,
      features: ["Todo lo de Free", "Informes con IA ilimitados", "Planificador de salidas con IA", "Solicitudes de familias ilimitadas", "Verificación express (24 hs)", "Estadísticas de tu perfil"],
    },
    {
      id: "pro", nombre: "Pro", precio: "ARS 18.900", detalle: "por mes",
      features: ["Todo lo de Plus", "Video de presentación en tu perfil", "Agenda y recordatorios de salidas", "Exportación de informes para obras sociales", "Reseñas destacadas", "Soporte prioritario"],
    },
  ];

  const Planes = (
    <div className="px-4 pb-28">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => setVerPlanes(false)} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>Planes de rondas</h1>
          <p className="text-xs" style={{ color: GRIS }}>Menos de una hora de tu trabajo al mes, varias horas ahorradas.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-5">
        {PLANES.map((p) => {
          const actual = plan === p.id;
          return (
            <div key={p.id} className="rounded-2xl p-4 relative"
              style={p.destacado
                ? { background: "#fff", border: "2px solid " + CORAL }
                : { background: "#fff", border: "1px solid #E4E2D8" }}>
              {p.destacado && (
                <span className="absolute text-xs font-bold px-3 py-1 rounded-full"
                  style={{ top: -10, right: 16, background: CORAL, color: "#fff" }}>
                  Más elegido
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <p className="rd-display text-lg" style={{ fontWeight: 800 }}>{p.nombre}</p>
                <div className="text-right">
                  <p className="rd-display text-lg" style={{ fontWeight: 800, color: VERDE }}>{p.precio}</p>
                  <p style={{ fontSize: 10, color: "#9BA0BC" }}>{p.detalle}</p>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5 mt-3">
                {p.features.map((f) => (
                  <li key={f} className="text-sm flex items-start gap-2" style={{ color: "#3C4368" }}>
                    <Check size={14} color={VERDE} style={{ flexShrink: 0, marginTop: 3 }} />{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  if (actual) return;
                  setPlan(p.id); setVerPlanes(false);
                  avisar(p.id === "free" ? "Cambiaste al plan Free" : `Plan ${p.nombre} activo (demo)`);
                }}
                className="w-full rounded-2xl py-3 font-bold text-sm mt-3"
                style={actual
                  ? { background: "#E8E9F2", color: GRIS }
                  : p.destacado
                    ? { background: CORAL, color: "#fff" }
                    : { background: "#fff", border: "1px solid " + VERDE, color: VERDE }}>
                {actual ? "Tu plan actual" : `Elegir ${p.nombre}`}
              </button>
            </div>
          );
        })}

        <div className="rounded-2xl p-5" style={{ background: NAVY }}>
          <div className="flex items-center gap-2">
            <Building2 size={20} color="#fff" />
            <p className="rd-display text-base" style={{ fontWeight: 800, color: "#fff" }}>¿Sos una institución?</p>
          </div>
          <p className="text-sm mt-2" style={{ color: "#B9BEDC" }}>
            Fundaciones, centros y equipos: cuentas para todo tu staff, informes centralizados con supervisión, exportación por obra social y perfil institucional con captación de pacientes.
          </p>
          <p className="text-xs mt-2 font-bold" style={{ color: "#fff" }}>Desde ARS 150.000/mes · hasta 10 ATs</p>
          <button onClick={() => avisar("Te contactamos en 24 hs (demo)")}
            className="mt-3 rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: "#fff", color: NAVY }}>
            Hablar con nosotros
          </button>
        </div>

        <p className="text-xs text-center px-4" style={{ color: "#9BA0BC" }}>
          Suscripción vía MercadoPago. Cancelás cuando quieras. La verificación de certificados es gratuita en todos los planes.
        </p>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  SHELL                                                           */
  /* ================================================================ */

  const TABS_AT = [
    { id: "salidas", label: "Salidas", icon: CalendarDays },
    { id: "mapa", label: "Mapa", icon: MapIcon },
    { id: "publicar", label: "Publicar", icon: PlusCircle },
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "perfil", label: "Perfil", icon: User },
  ];
  const TABS_FAM = [
    { id: "buscar", label: "Buscar", icon: Search },
    { id: "seguimiento", label: "En vivo", icon: Navigation },
    { id: "solicitudes", label: "Solicitudes", icon: Inbox },
    { id: "perfil", label: "Perfil", icon: User },
  ];

  let contenido = null;
  let barras = null;

  if (pantalla === "bienvenida") contenido = Bienvenida;
  else if (pantalla === "login") contenido = Login;
  else if (pantalla === "planesOnboarding") contenido = PlanesOnboarding;
  else if (pantalla === "registroAT") contenido = RegistroAT;
  else if (pantalla === "registroFam") contenido = RegistroFam;
  else if (rol === "at") {
    if (verEnCurso && sesion) contenido = EnCursoAT;
    else if (verAdminCud) contenido = SugerenciasIA;
    else if (verCud) contenido = Cud;
    else if (verPlanes) contenido = Planes;
    else if (detalleId && salida) contenido = Detalle;
    else if (tab === "salidas") contenido = Feed;
    else if (tab === "mapa") contenido = MapaSalidas;
    else if (tab === "publicar") contenido = Publicar;
    else if (tab === "chats") contenido = chatId && chatSalida ? ChatThread : ChatsList;
    else contenido = PerfilAT;
    barras = TABS_AT;
  } else {
    if (verAdminCud) contenido = SugerenciasIA;
    else if (verCud) contenido = Cud;
    else if (atSel !== null && at) contenido = PerfilATPublico;
    else if (tabFam === "buscar") contenido = BuscarATs;
    else if (tabFam === "seguimiento") contenido = Seguimiento;
    else if (tabFam === "solicitudes") contenido = Solicitudes;
    else contenido = PerfilFam;
    barras = TABS_FAM;
  }

  const tabActiva = rol === "at" ? tab : tabFam;
  const enDetalle = rol === "at" ? !!detalleId : atSel !== null;

  if (cargandoSesion) {
    return (
      <div className="rd-root flex items-center justify-center" style={{ background: PAPEL, height: "100%", width: "100%" }}>
        <Loader2 size={28} className="animate-spin" color={VERDE} />
      </div>
    );
  }

  return (
    <MapsProvider>
      <div className="rd-root" style={{ background: "#DBDDEF", height: "100%", width: "100%" }}>
        <style>{CSS}</style>
        <div className="mx-auto max-w-md relative" style={{ background: PAPEL, minHeight: "100%", height: "100%", overflowY: "auto" }}>
          {toast && (
            <div className="absolute left-1/2 z-20 px-4 py-2.5 rounded-full text-sm font-bold"
              style={{ top: 14, transform: "translateX(-50%)", background: TINTA, color: "#fff", whiteSpace: "nowrap" }}>
              {toast}
            </div>
          )}

          <div style={{ minHeight: pantalla === "app" ? "calc(100vh - 76px)" : "100vh", position: "relative" }}>
            {contenido}
          </div>

          {pantalla === "app" && barras && (
            <nav className="fixed bottom-0 flex justify-around items-center"
              style={{ width: "100%", maxWidth: "28rem", left: "50%", transform: "translateX(-50%)", height: 76, background: "#fff", borderTop: "1px solid #E4E2D8", zIndex: 10 }}>
              {barras.map((t) => {
                const activo = tabActiva === t.id && !enDetalle;
                const Icon = t.icon;
                return (
                  <button key={t.id}
                    onClick={() => {
                      if (rol === "at") { setTab(t.id); setDetalleId(null); setVerPlanes(false); setVerCud(false); setVerAdminCud(false); setVerEnCurso(false); setPinSelSalida(null); if (t.id !== "chats") setChatId(null); }
                      else { setTabFam(t.id); setAtSel(null); setEscribiendo(false); setVerCud(false); setVerAdminCud(false); setPinSel(null); }
                    }}
                    className="flex flex-col items-center gap-1 px-3 py-2" aria-label={t.label}>
                    <Icon size={22} color={activo ? CORAL : "#9BA0BC"} strokeWidth={activo ? 2.4 : 2} />
                    <span className="text-xs font-semibold" style={{ color: activo ? CORAL : "#9BA0BC" }}>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </MapsProvider>
  );
}
