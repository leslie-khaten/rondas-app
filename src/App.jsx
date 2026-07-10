import React, { useState, useEffect } from "react";
import {
  CalendarDays, PlusCircle, MessageCircle, User, MapPin, Clock, Users,
  BadgeCheck, ChevronLeft, Send, Search, HeartHandshake,
  ShieldCheck, FileCheck, Inbox, Star, Sparkles, ShieldAlert,
  Crown, Building2, Check, Bus, TreePine, Landmark, Accessibility,
  Map as MapIcon, List, ChevronRight, Navigation, Phone, Play, Square,
} from "lucide-react";

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

/* logo oficial de la marca (public/logo-icon.png), fondo transparente */
const LogoRondas = ({ size = 44 }) => (
  <img src="/logo-icon.png" width={size} height={size} alt="Logo rondas" style={{ objectFit: "contain" }} />
);

export const RONDAS_BRAND = { VERDE, CORAL, NAVY, PAPEL, TINTA, GRIS, AMBAR };
export { LogoRondas };

const POB_COLOR = {
  "Niñez": "#F2A71B",
  "Adolescencia": "#8B6FC9",
  "Adultos": "#2E86C1",
  "Adultos mayores": "#EF5A5A",
};

const ZONAS = ["Palermo", "Recoleta", "Caballito", "Belgrano", "San Telmo", "Villa Urquiza", "Flores"];
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
];

/* ---------- piezas ---------- */

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
            className="text-xs px-3 py-2 rounded-full font-semibold"
            style={activo ? { background: c || VERDE, color: "#fff" } : { background: "#fff", border: "1px solid #D8D6CB", color: TINTA }}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold">{label}</span>
      {children}
    </label>
  );
}

function BotonPrimario({ onClick, children, icon: Icon }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2"
      style={{ background: CORAL, color: "#fff", boxShadow: "0 4px 12px rgba(240,86,90,0.3)" }}>
      {Icon && <Icon size={16} />}{children}
    </button>
  );
}

/* ================================================================== */

export default function RondaApp() {
  /* navegación global */
  const [pantalla, setPantalla] = useState("bienvenida"); // bienvenida | registroAT | registroFam | app
  const [rol, setRol] = useState(null); // 'at' | 'familia'
  const [toast, setToast] = useState(null);
  const avisar = (t) => { setToast(t); setTimeout(() => setToast(null), 2400); };

  /* registro AT */
  const [regAT, setRegAT] = useState({ nombre: "", zona: "Palermo", poblaciones: [], areas: [], exp: "1 a 3 años", cert: false });
  /* registro familia */
  const [regFam, setRegFam] = useState({ nombre: "", zona: "Palermo", para: "Mi hijo/a", poblacion: "Niñez", edad: "", areas: [], horario: "Tardes" });

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
  const [verCud, setVerCud] = useState(false);
  const [vistaMapa, setVistaMapa] = useState(false);
  const [pinSel, setPinSel] = useState(null);

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

  const iniciarSesion = (titulo, at, demo) => {
    setSesion({ titulo, at, inicioTs: Date.now(), checkins: [{ texto: "Salida iniciada", hora: horaAhora() }], demo, finalizada: false });
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
    return (
      <svg viewBox="0 0 400 230" width="100%" height={alto} role="img" aria-label="Ubicación de la salida en curso">
        <rect width="400" height="230" fill="#EAEBF5" />
        {[60, 130, 200, 270, 340].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="230" stroke="#DFE1F0" strokeWidth="1.5" />)}
        {[50, 115, 180].map((y) => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#DFE1F0" strokeWidth="1.5" />)}
        <ellipse cx="205" cy="128" rx="128" ry="78" fill="#D6F0E7" />
        <text x="205" y="215" fontSize="10" fill="#7FB9A6" textAnchor="middle">Jardín Botánico · Palermo</text>
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
        <LogoRondas size={110} />
        <h1 className="rd-display mt-2" style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1, color: NAVY }}>rondas</h1>
        <p className="text-sm mt-1 font-bold" style={{ color: VERDE }}>
          Red de acompañamiento terapéutico
        </p>
        <p className="text-sm mt-3 px-6" style={{ color: GRIS }}>
          Salidas compartidas, profesionales verificados.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-10">
        <button onClick={() => { setRol("at"); setPantalla("registroAT"); }}
          className="rd-card rounded-2xl p-5 text-left flex items-start gap-4 w-full">
          <div className="rounded-2xl p-3 flex-shrink-0" style={{ background: "#DFF3F1" }}>
            <Users size={22} color={VERDE} />
          </div>
          <div>
            <p className="rd-display text-base" style={{ fontWeight: 800 }}>Soy acompañante terapéutico/a</p>
            <p className="text-sm mt-1" style={{ color: GRIS }}>Coordiná salidas grupales con otros ATs y sumate a una red profesional verificada.</p>
          </div>
        </button>

        <button onClick={() => { setRol("familia"); setPantalla("registroFam"); }}
          className="rd-card rounded-2xl p-5 text-left flex items-start gap-4 w-full">
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
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "#9BA0BC" }}>
          <ShieldCheck size={14} />
          <span>Certificaciones revisadas manualmente antes de publicar cada perfil</span>
        </div>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  PANTALLA: REGISTRO AT                                           */
  /* ================================================================ */

  const RegistroAT = (
    <div className="px-4 pb-10">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => setPantalla("bienvenida")} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold" style={{ color: VERDE }}>REGISTRO · ACOMPAÑANTE TERAPÉUTICO/A</p>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>Creá tu perfil profesional</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-5">
        <Campo label="Nombre y apellido">
          <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="Ej: Sofía Paredes"
            value={regAT.nombre} onChange={(e) => setRegAT({ ...regAT, nombre: e.target.value })} />
        </Campo>

        <Campo label="Zona donde trabajás">
          <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regAT.zona} onChange={(e) => setRegAT({ ...regAT, zona: e.target.value })}>
            {ZONAS.map((z) => <option key={z}>{z}</option>)}
          </select>
          <span className="text-xs" style={{ color: "#9BA0BC" }}>Se muestra tu zona, nunca una dirección exacta.</span>
        </Campo>

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

        <Campo label="Certificación de AT">
          <button type="button" onClick={() => setRegAT({ ...regAT, cert: !regAT.cert })}
            className="rounded-xl px-3 py-4 text-sm font-semibold flex items-center gap-2 justify-center"
            style={regAT.cert
              ? { background: "#DFF3F1", color: VERDE, border: "1px solid " + VERDE }
              : { background: "#fff", border: "1px dashed #B8B6AA", color: GRIS }}>
            <FileCheck size={16} />
            {regAT.cert ? "certificado-at.pdf adjuntado" : "Adjuntar certificado (PDF o foto)"}
          </button>
          <span className="text-xs" style={{ color: "#9BA0BC" }}>
            Lo revisamos manualmente. Tu perfil se publica con el badge "Verificación en curso" hasta la aprobación.
          </span>
        </Campo>

        <BotonPrimario onClick={() => {
          if (!regAT.nombre.trim()) { avisar("Contanos tu nombre"); return; }
          if (regAT.poblaciones.length === 0) { avisar("Elegí al menos una población"); return; }
          setPantalla("app"); setTab("salidas");
          avisar(regAT.cert ? "Cuenta creada · certificado en revisión" : "Cuenta creada");
        }}>
          Crear mi cuenta
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
        <Campo label="Tu nombre">
          <input className="rd-input rounded-xl px-3 py-3 text-sm" placeholder="Ej: Ana Gutiérrez"
            value={regFam.nombre} onChange={(e) => setRegFam({ ...regFam, nombre: e.target.value })} />
        </Campo>

        <Campo label="Tu zona">
          <select className="rd-input rounded-xl px-3 py-3 text-sm" value={regFam.zona} onChange={(e) => setRegFam({ ...regFam, zona: e.target.value })}>
            {ZONAS.map((z) => <option key={z}>{z}</option>)}
          </select>
          <span className="text-xs" style={{ color: "#9BA0BC" }}>Usamos tu zona para mostrarte ATs cercanos. Nunca pedimos tu dirección.</span>
        </Campo>

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

        <div className="rounded-2xl p-4 flex gap-3" style={{ background: "#FCF0D8" }}>
          <ShieldCheck size={18} color={AMBAR} style={{ flexShrink: 0, marginTop: 2 }} />
          <p className="text-xs" style={{ color: "#7C6420" }}>
            Esta información es privada: solo la ve el AT cuando le enviás una solicitud. Nunca publicamos datos de la persona que necesita acompañamiento.
          </p>
        </div>

        <BotonPrimario onClick={() => {
          if (!regFam.nombre.trim()) { avisar("Contanos tu nombre"); return; }
          setBZona(regFam.zona); setPantalla("app"); setTabFam("buscar");
          avisar("Cuenta creada");
        }}>
          Crear mi cuenta
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

  const COORDS = {
    "Belgrano": [115, 72], "Villa Urquiza": [55, 128], "Palermo": [180, 152],
    "Recoleta": [278, 182], "Caballito": [125, 288], "Flores": [58, 342], "San Telmo": [308, 305],
  };
  const userPos = COORDS[regFam.zona] || [180, 152];
  const distKm = (pos) => {
    const d = Math.sqrt((pos[0] - userPos[0]) ** 2 + (pos[1] - userPos[1]) ** 2) * 0.022;
    return (Math.round(Math.max(d, 0.3) * 10) / 10).toString().replace(".", ",");
  };
  const pinPos = (a, i) => {
    const base = COORDS[a.zona] || [200, 200];
    const prev = atsFiltrados.slice(0, i).filter((x) => x.zona === a.zona).length;
    return [base[0] + prev * 26, base[1] + prev * 14];
  };

  const BuscarATs = (
    <div className="px-4 pb-28">
      <div className="-mx-4 px-5 pt-6 pb-5 mb-4"
        style={{ background: NAVY, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <div className="flex items-center gap-3">
          <LogoRondas size={40} />
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
          {ZONAS.map((z) => <option key={z}>{z}</option>)}
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
          <div className="rd-card rounded-2xl overflow-hidden">
            <svg viewBox="0 0 400 430" width="100%" role="img" aria-label="Mapa de acompañantes cercanos">
              <rect width="400" height="430" fill="#EAEBF5" />
              {[40, 80, 120, 160, 200, 240, 280, 320].map((x) => (
                <line key={"v" + x} x1={x} y1="0" x2={x} y2="430" stroke="#DFE1F0" strokeWidth="1.5" />
              ))}
              {[40, 90, 140, 190, 240, 290, 340, 390].map((y) => (
                <line key={"h" + y} x1="0" y1={y} x2="400" y2={y} stroke="#DFE1F0" strokeWidth="1.5" />
              ))}
              <line x1="0" y1="60" x2="340" y2="420" stroke="#D3D5E8" strokeWidth="5" />
              <line x1="30" y1="0" x2="330" y2="430" stroke="#D3D5E8" strokeWidth="5" />
              <path d="M345,0 L400,0 L400,430 L385,430 C370,340 355,220 350,120 Z" fill="#CBDDF5" />
              <text x="378" y="215" fontSize="9" fill="#8FA3C9" transform="rotate(78 378 215)">Río de la Plata</text>
              <ellipse cx="195" cy="118" rx="58" ry="34" fill="#D6F0E7" />
              <text x="172" y="120" fontSize="8" fill="#7FB9A6">Bosques de Palermo</text>
              <ellipse cx="330" cy="345" rx="26" ry="42" fill="#D6F0E7" />
              <ellipse cx="70" cy="310" rx="20" ry="14" fill="#D6F0E7" />
              {Object.entries(COORDS).map(([z, [x, y]]) => (
                <text key={z} x={x} y={y + 32} fontSize="9" fill="#9BA0BC" textAnchor="middle">{z}</text>
              ))}

              {/* vos */}
              <circle cx={userPos[0] + 16} cy={userPos[1] + 18} r="15" fill="#3B6FB5" opacity="0.18" />
              <circle cx={userPos[0] + 16} cy={userPos[1] + 18} r="7" fill="#3B6FB5" stroke="#fff" strokeWidth="2.5" />
              <text x={userPos[0] + 16} y={userPos[1] + 44} fontSize="9" fontWeight="bold" fill="#3B6FB5" textAnchor="middle">Vos</text>

              {/* pins de ATs */}
              {atsFiltrados.map((a, i) => {
                const [x, y] = pinPos(a, i);
                const c = a.verificado ? VERDE : AMBAR;
                const ini = a.nombre.split(" ").map((p) => p[0]).join("").slice(0, 2);
                const sel = pinSel === i;
                return (
                  <g key={a.nombre} onClick={() => setPinSel(i)} style={{ cursor: "pointer" }}>
                    <path d={`M${x},${y + 12} L${x - 5},${y + 4} L${x + 5},${y + 4} Z`} fill={c} />
                    <circle cx={x} cy={y - 6} r={sel ? 15 : 13} fill={c} stroke="#fff" strokeWidth={sel ? 3 : 2} />
                    <text x={x} y={y - 2.5} fontSize="9.5" fontWeight="bold" fill="#fff" textAnchor="middle">{ini}</text>
                  </g>
                );
              })}
            </svg>
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
      </div>

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

      <button onClick={() => { setPantalla("bienvenida"); setRol(null); setAtSel(null); }}
        className="w-full rounded-2xl py-3 font-semibold text-sm mt-4" style={{ background: "#fff", border: "1px solid #D8D6CB", color: GRIS }}>
        Cambiar de rol (demo)
      </button>
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
        <LogoRondas size={46} />
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
          {ZONAS.map((z) => <option key={z}>{z}</option>)}
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
              <button onClick={() => { iniciarSesion(salida.titulo, yoAT, false); setDetalleId(null); setVerEnCurso(true); }}
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
              {ZONAS.map((z) => <option key={z}>{z}</option>)}
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
        <div className="flex items-center gap-1 mt-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={regAT.cert ? { background: "#DFF3F1", color: VERDE } : { background: "#FCF0D8", color: AMBAR }}>
          <BadgeCheck size={14} /> {regAT.cert ? "Certificación en revisión" : "Certificado pendiente de carga"}
        </div>
      </div>

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
            <span className="text-xs" style={{ color: "#9BA0BC" }}>Completá tus especialidades desde el registro.</span>
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

      <button onClick={() => { setPantalla("bienvenida"); setRol(null); }}
        className="w-full rounded-2xl py-3 font-semibold text-sm mt-4" style={{ background: "#fff", border: "1px solid #D8D6CB", color: GRIS }}>
        Cambiar de rol (demo)
      </button>
    </div>
  );

  /* ================================================================ */
  /*  PANTALLA: ACTIVIDADES GRATIS CON CUD                            */
  /* ================================================================ */

  const CUD_ITEMS = [
    { icon: Bus, titulo: "Transporte público gratuito", tag: "cud", desc: "Colectivos y trenes del AMBA sin cargo presentando CUD y DNI. Si el CUD indica \"con acompañante\", el AT también viaja gratis." },
    { icon: Bus, titulo: "Micros y trenes de larga distancia", tag: "cud", desc: "Pasaje sin cargo solicitándolo con anticipación ante la empresa. Ideal para salidas fuera de la ciudad." },
    { icon: TreePine, titulo: "Parques Nacionales", tag: "cud", desc: "Entrada gratuita para la persona con CUD y su acompañante en todos los Parques Nacionales del país." },
    { icon: Landmark, titulo: "Planetario Galileo Galilei", tag: "cud", desc: "Entrada sin cargo para personas con CUD y su acompañante, en todas las funciones.", salida: { titulo: "Función en el Planetario", lugar: "Av. Sarmiento y B. Roldán — entrada principal", zona: "Palermo" } },
    { icon: Landmark, titulo: "Museos nacionales", tag: "todos", desc: "Bellas Artes, Histórico Nacional, del Cabildo y más: entrada libre y gratuita.", salida: { titulo: "Museo Nacional de Bellas Artes", lugar: "Av. del Libertador 1473", zona: "Recoleta" } },
    { icon: TreePine, titulo: "Ecoparque", tag: "todos", desc: "Entrada gratuita con reserva online. Recorridos cortos y accesibles.", salida: { titulo: "Mañana en el Ecoparque", lugar: "Entrada Av. Sarmiento 2725", zona: "Palermo" } },
    { icon: TreePine, titulo: "Reserva Ecológica Costanera Sur", tag: "todos", desc: "Entrada libre. Senderos planos, ideales para ritmo pausado o movilidad reducida.", salida: { titulo: "Caminata en la Reserva Ecológica", lugar: "Entrada Brasil y Av. España", zona: "San Telmo" } },
  ];

  const Cud = (
    <div className="px-4 pb-28">
      <div className="pt-5 flex items-center gap-3">
        <button onClick={() => setVerCud(false)} className="rounded-full p-2" style={{ background: "#fff", border: "1px solid #E4E2D8" }} aria-label="Volver">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="rd-display text-xl" style={{ fontWeight: 800 }}>Gratis con CUD</h1>
          <p className="text-xs" style={{ color: GRIS }}>Beneficios del Certificado Único de Discapacidad para tus salidas</p>
        </div>
      </div>

      <div className="rounded-2xl p-3 mt-4 text-xs" style={{ background: "#FCF0D8", color: "#7C6420" }}>
        Los beneficios pueden cambiar y algunos requieren gestión previa. Verificá las condiciones vigentes antes de cada salida.
      </div>

      <div className="flex flex-col gap-3 mt-3">
        {CUD_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.titulo} className="rd-card rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl p-2.5 flex-shrink-0" style={{ background: "#DFF3F1" }}>
                  <Icon size={20} color={VERDE} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="rd-display text-sm" style={{ fontWeight: 700 }}>{item.titulo}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={item.tag === "cud" ? { background: "#DFF3F1", color: VERDE } : { background: PAPEL, border: "1px solid #E4E2D8", color: GRIS }}>
                      {item.tag === "cud" ? "Gratis con CUD" : "Gratis para todos"}
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: "#3C4368" }}>{item.desc}</p>
                  {rol === "at" && item.salida && (
                    <button
                      onClick={() => {
                        setForm({ ...form, titulo: item.salida.titulo, lugar: item.salida.lugar, zona: item.salida.zona });
                        setVerCud(false); setTab("publicar");
                        avisar("Datos precargados en tu salida");
                      }}
                      className="mt-2 text-xs font-bold px-3 py-2 rounded-full"
                      style={{ background: CORAL, color: "#fff" }}>
                      Crear salida acá
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-center mt-4 px-4" style={{ color: "#9BA0BC" }}>
        Fuente: beneficios de la Ley 22.431 y programas nacionales/CABA. Esta sección se actualiza con la comunidad.
      </p>
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
          <button onClick={() => iniciarSesion("Recorrido Jardín Botánico", "Carmen Aguirre", true)}
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
  else if (pantalla === "registroAT") contenido = RegistroAT;
  else if (pantalla === "registroFam") contenido = RegistroFam;
  else if (rol === "at") {
    if (verEnCurso && sesion) contenido = EnCursoAT;
    else if (verCud) contenido = Cud;
    else if (verPlanes) contenido = Planes;
    else if (detalleId && salida) contenido = Detalle;
    else if (tab === "salidas") contenido = Feed;
    else if (tab === "publicar") contenido = Publicar;
    else if (tab === "chats") contenido = chatId && chatSalida ? ChatThread : ChatsList;
    else contenido = PerfilAT;
    barras = TABS_AT;
  } else {
    if (verCud) contenido = Cud;
    else if (atSel !== null && at) contenido = PerfilATPublico;
    else if (tabFam === "buscar") contenido = BuscarATs;
    else if (tabFam === "seguimiento") contenido = Seguimiento;
    else if (tabFam === "solicitudes") contenido = Solicitudes;
    else contenido = PerfilFam;
    barras = TABS_FAM;
  }

  const tabActiva = rol === "at" ? tab : tabFam;
  const enDetalle = rol === "at" ? !!detalleId : atSel !== null;

  return (
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
                    if (rol === "at") { setTab(t.id); setDetalleId(null); setVerPlanes(false); setVerCud(false); setVerEnCurso(false); if (t.id !== "chats") setChatId(null); }
                    else { setTabFam(t.id); setAtSel(null); setEscribiendo(false); setVerCud(false); setPinSel(null); }
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
  );
}
