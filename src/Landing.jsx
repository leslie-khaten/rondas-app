import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, ShieldCheck, MapPin, MessageCircle, Sparkles, HeartHandshake,
  Navigation, Check, ChevronRight, ChevronDown, Accessibility, Star, BadgeCheck,
} from "lucide-react";
import RondaApp, { RONDAS_BRAND, LogoRondas } from "./App.jsx";

const { VERDE, CORAL, NAVY, PAPEL, GRIS, AMBAR } = RONDAS_BRAND;

const FAQS = [
  {
    q: "¿Qué es un acompañante terapéutico?",
    a: "Un acompañante terapéutico (AT) es un profesional de la salud que brinda apoyo personalizado a personas con discapacidad, padecimientos de salud mental o necesidades de acompañamiento cotidiano, siguiendo las indicaciones del equipo tratante. En rondas, todos los ATs pasan por una verificación manual de certificados antes de recibir el distintivo de verificado.",
  },
  {
    q: "¿Cómo encuentro un acompañante terapéutico cerca de mí en CABA?",
    a: "En rondas podés filtrar acompañantes terapéuticos por barrio, población y área de acompañamiento, y verlos en mapa o lista. Cada perfil muestra certificación verificada, experiencia y salidas realizadas antes de que envíes tu solicitud de contacto.",
  },
  {
    q: "¿Cuánto cuesta usar rondas?",
    a: "Para las familias, rondas es gratis siempre. Los acompañantes terapéuticos tienen un plan Free ($0) con salidas ilimitadas, y planes pagos desde ARS 9.900 por mes con informes y planificador con IA.",
  },
  {
    q: "¿Cómo verifica rondas a los acompañantes terapéuticos?",
    a: "Los certificados de cada AT se revisan manualmente antes de otorgar el distintivo de verificado. No hay verificación automática: una persona revisa la documentación profesional de cada acompañante que se suma a la red.",
  },
  {
    q: "¿Qué datos de la persona acompañada se comparten en la app?",
    a: "Ninguno se publica: en las salidas solo aparece el rango etario y el contexto de la actividad. La ubicación se comparte únicamente durante la salida activa y se elimina a las 48 horas, y las familias deciden qué información incluir en cada solicitud de contacto.",
  },
  {
    q: "¿Qué beneficios tiene el CUD para las salidas?",
    a: "El Certificado Único de Discapacidad (CUD) habilita transporte gratuito y entrada sin cargo a muchos parques y museos para la persona y su acompañante. rondas incluye una guía de actividades gratuitas con CUD para planificar salidas accesibles en Buenos Aires.",
  },
];

/* Testimonios de ejemplo para maqueta. Reemplazar por citas reales de ATs y familias antes de publicar. */
const TESTIMONIOS = [
  {
    nombre: "Marina L.",
    rol: "Acompañante terapéutica",
    zona: "Recoleta",
    texto: "Hace 6 meses coordino mis salidas acá. Antes perdía media tarde armando grupos de WhatsApp; ahora publico la salida, sumo colegas verificados y listo.",
  },
  {
    nombre: "Ana G.",
    rol: "Mamá de un usuario de rondas",
    zona: "Palermo",
    texto: "Buscaba un acompañante para mi hijo hace meses. En rondas pude ver certificaciones y salidas realizadas antes de escribirle a nadie, eso me dio tranquilidad.",
  },
  {
    nombre: "Carmen A.",
    rol: "Acompañante terapéutica",
    zona: "Palermo",
    texto: "Trabajo con adultos mayores, y el seguimiento en vivo le da tranquilidad a las familias sin que yo tenga que estar mandando fotos todo el rato.",
  },
];

/* Posts de ejemplo para maqueta de blog. No existen todavía como páginas reales. */
const BLOG_POSTS = [
  {
    titulo: "Qué es un acompañante terapéutico y cuándo se necesita uno",
    fecha: "3 jul, 2026",
    extracto: "Una guía clara sobre el rol del AT, cuándo lo indica el equipo tratante y qué diferencia a un buen acompañamiento.",
    color: VERDE,
  },
  {
    titulo: "CUD: guía de trámite y beneficios para salidas accesibles",
    fecha: "24 jun, 2026",
    extracto: "Cómo se tramita el Certificado Único de Discapacidad y qué transporte, parques y museos son gratuitos con él.",
    color: AMBAR,
  },
  {
    titulo: "Qué datos nunca hay que compartir al coordinar una salida",
    fecha: "10 jun, 2026",
    extracto: "Una checklist simple para proteger la privacidad de las personas acompañadas en grupos de coordinación.",
    color: "#8B6FC9",
  },
];

const Boton = ({ children, onClick, variant = "primary", href }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-full font-bold text-sm px-7 py-3.5 transition-transform hover:scale-[1.03]";
  const styles = {
    primary: { background: CORAL, color: "#fff", boxShadow: "0 8px 20px rgba(240,86,90,0.35)" },
    dark: { background: NAVY, color: "#fff" },
    outline: { background: "transparent", color: NAVY, border: "1.5px solid " + NAVY },
    outlineWhite: { background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.5)" },
  };
  const Comp = href ? "a" : "button";
  return (
    <Comp href={href} onClick={onClick} className={base} style={styles[variant]}>
      {children}
    </Comp>
  );
};

/* ---------- mockups ilustrativos usados en los bloques alternados ---------- */

const MockupFrame = ({ children }) => (
  <div className="rounded-3xl p-5 bg-white w-full" style={{ border: "1px solid #E7E8F3", boxShadow: "0 20px 40px -15px rgba(36,43,84,0.18)" }}>
    {children}
  </div>
);

const SalidaMockup = () => (
  <MockupFrame>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#FCF0D8", color: AMBAR }}>Niñez · 6 a 10 años</span>
      <span className="text-xs font-semibold" style={{ color: GRIS }}>Sáb 4 Jul · 15:00</span>
    </div>
    <p className="rd-display font-bold text-base mb-1" style={{ color: NAVY }}>Museo Participativo de Ciencias</p>
    <p className="text-xs flex items-center gap-1 mb-4" style={{ color: GRIS }}><MapPin size={12} /> Recoleta</p>
    <div className="flex items-center justify-between">
      <div className="flex">
        {["ML", "DS"].map((ini, i) => (
          <div key={ini} className="rounded-full flex items-center justify-center text-xs font-bold"
            style={{ width: 28, height: 28, marginLeft: i ? -8 : 0, background: "#DFF3F1", color: VERDE, border: "2px solid #fff" }}>{ini}</div>
        ))}
      </div>
      <span className="text-xs font-semibold" style={{ color: VERDE }}>2 lugares libres</span>
    </div>
  </MockupFrame>
);

const ChatMockup = () => (
  <MockupFrame>
    <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: GRIS }}>Chat · Museo de Ciencias</p>
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl px-3 py-2 max-w-[85%]" style={{ background: PAPEL }}>
        <p className="text-xs font-bold" style={{ color: VERDE }}>Marina L.</p>
        <p className="text-sm" style={{ color: "#3C4368" }}>Confirmo punto de encuentro en la entrada, 14:45.</p>
      </div>
      <div className="rounded-2xl px-3 py-2 max-w-[85%] self-end" style={{ background: "#DFF3F1" }}>
        <p className="text-xs font-bold" style={{ color: VERDE }}>Diego S.</p>
        <p className="text-sm" style={{ color: "#3C4368" }}>Perfecto, llevo pictogramas de anticipación.</p>
      </div>
    </div>
  </MockupFrame>
);

const GuardianMockup = () => (
  <MockupFrame>
    <div className="flex items-center gap-2 mb-3">
      <Sparkles size={16} color="#8B6FC9" />
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#8B6FC9" }}>Guardián de privacidad</p>
    </div>
    <p className="text-sm mb-3" style={{ color: "#3C4368" }}>Detectamos un dato sensible en tu publicación.</p>
    <div className="rounded-xl px-3 py-2 text-xs mb-3" style={{ background: "#F7EFFF", color: "#6B4FA0" }}>
      El nombre de la persona acompañada no debería aparecer en la nota pública.
    </div>
    <span className="text-xs font-bold inline-block px-3 py-2 rounded-full" style={{ background: "#8B6FC9", color: "#fff" }}>Usar versión segura</span>
  </MockupFrame>
);

const BuscarMockup = () => (
  <MockupFrame>
    <div className="flex gap-2 mb-3">
      {["Palermo", "Niñez"].map((t) => (
        <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: PAPEL, border: "1px solid #E4E2D8" }}>{t}</span>
      ))}
    </div>
    <div className="flex flex-col gap-3">
      {[["Marina López", "Recoleta · 8 años exp."], ["Diego Suárez", "Caballito · 5 años exp."]].map(([n, d]) => (
        <div key={n} className="flex items-center gap-3">
          <div className="rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ width: 36, height: 36, background: "#DFF3F1", color: VERDE }}>
            {n.split(" ").map((w) => w[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-bold flex items-center gap-1" style={{ color: NAVY }}>{n} <BadgeCheck size={13} color={VERDE} /></p>
            <p className="text-xs" style={{ color: GRIS }}>{d}</p>
          </div>
        </div>
      ))}
    </div>
  </MockupFrame>
);

const PerfilMockup = () => (
  <MockupFrame>
    <div className="flex items-center gap-3 mb-4">
      <div className="rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ width: 48, height: 48, background: VERDE, color: "#fff" }}>CA</div>
      <div>
        <p className="text-sm font-bold flex items-center gap-1" style={{ color: NAVY }}>Carmen Aguirre <BadgeCheck size={14} color={VERDE} /></p>
        <p className="text-xs" style={{ color: GRIS }}>Palermo · 12 años de experiencia</p>
      </div>
    </div>
    <div className="flex gap-6">
      <div>
        <p className="rd-display font-extrabold text-lg" style={{ color: VERDE }}>31</p>
        <p className="text-xs" style={{ color: GRIS }}>salidas realizadas</p>
      </div>
      <div>
        <p className="rd-display font-extrabold text-lg" style={{ color: VERDE }}>Verificada</p>
        <p className="text-xs" style={{ color: GRIS }}>certificado revisado</p>
      </div>
    </div>
  </MockupFrame>
);

const SeguimientoMockup = () => (
  <MockupFrame>
    <svg viewBox="0 0 300 150" width="100%" height="130" role="img" aria-label="Mapa de seguimiento en vivo">
      <rect width="300" height="150" fill="#EAEBF5" rx="16" />
      <ellipse cx="150" cy="80" rx="95" ry="52" fill="#D6F0E7" />
      <polyline points="70,105 110,78 160,64 210,74 235,100" fill="none" stroke="#A9D8CE" strokeWidth="2.5" strokeDasharray="5 5" />
      <circle cx="160" cy="64" r="10" fill={VERDE} opacity="0.25" />
      <circle cx="160" cy="64" r="6" fill={VERDE} stroke="#fff" strokeWidth="2" />
    </svg>
    <p className="text-xs mt-3 font-bold flex items-center gap-1.5" style={{ color: VERDE }}>
      <span className="rounded-full" style={{ width: 6, height: 6, background: VERDE, display: "inline-block" }} /> En vivo · Jardín Botánico
    </p>
    <p className="text-xs mt-0.5" style={{ color: GRIS }}>Se borra automáticamente en 48hs</p>
  </MockupFrame>
);

const FeatureBlock = ({ reverse, color, icon: Icon, title, text, mockup }) => {
  const media = (
    <div className="relative flex justify-center py-4">
      <div className="absolute rounded-[2rem]" style={{ inset: "12%", background: color, opacity: 0.14, transform: "rotate(-8deg)" }} />
      <div className="relative w-full max-w-sm">{mockup}</div>
    </div>
  );
  const copy = (
    <div>
      <div className="rounded-2xl inline-flex items-center justify-center mb-4" style={{ width: 44, height: 44, background: color + "1A" }}>
        <Icon size={22} color={color} />
      </div>
      <h3 className="rd-display font-bold text-2xl mb-3" style={{ color: NAVY }}>{title}</h3>
      <p className="text-base leading-relaxed" style={{ color: "#4A4F72" }}>{text}</p>
    </div>
  );
  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      {reverse ? <>{copy}{media}</> : <>{media}{copy}</>}
    </div>
  );
};

const Testimonio = ({ nombre, rol, zona, texto }) => {
  const ini = nombre.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="rounded-3xl p-6 bg-white flex flex-col justify-between" style={{ border: "1px solid #E7E8F3" }}>
      <div>
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} color={AMBAR} fill={AMBAR} />)}
        </div>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#3C4368" }}>&ldquo;{texto}&rdquo;</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ width: 40, height: 40, background: "#DFF3F1", color: VERDE }}>
          {ini}
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: NAVY }}>{nombre}</p>
          <p className="text-xs" style={{ color: GRIS }}>{rol} · {zona}</p>
        </div>
      </div>
    </div>
  );
};

const BlogCard = ({ titulo, fecha, extracto, color }) => (
  <div className="rounded-3xl bg-white overflow-hidden flex flex-col" style={{ border: "1px solid #E7E8F3" }}>
    <div style={{ height: 8, background: color }} />
    <div className="p-6 flex flex-col flex-1">
      <p className="text-xs font-semibold mb-2" style={{ color: GRIS }}>{fecha}</p>
      <h3 className="rd-display font-bold text-lg mb-2" style={{ color: NAVY }}>{titulo}</h3>
      <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "#4A4F72" }}>{extracto}</p>
      <span className="text-sm font-bold inline-flex items-center gap-1" style={{ color }}>Leer más <ChevronRight size={14} /></span>
    </div>
  </div>
);

const FaqItem = ({ pregunta, respuesta, abierto, onClick }) => (
  <div className="rounded-2xl bg-white" style={{ border: "1px solid #E7E8F3" }}>
    <button onClick={onClick} className="w-full flex items-center justify-between gap-4 text-left px-5 py-4" aria-expanded={abierto}>
      <h3 className="rd-display font-bold text-base" style={{ color: NAVY }}>{pregunta}</h3>
      <ChevronDown size={18} color={GRIS} style={{ transform: abierto ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
    </button>
    {abierto && (
      <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#4A4F72" }}>{respuesta}</p>
    )}
  </div>
);

export default function Landing() {
  const [faqAbierta, setFaqAbierta] = useState(0);
  const navigate = useNavigate();

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Nunito', system-ui, sans-serif", color: NAVY, background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap');
        .rd-display { font-family: 'Baloo 2', 'Nunito', sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ---------- NAV ---------- */}
      <header className="sticky top-0 z-30 backdrop-blur" style={{ background: "rgba(255,255,255,0.9)", borderBottom: "1px solid #EEEFF7" }}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoRondas size={46} />
          </div>
          <nav className="hidden lg:flex items-center gap-4 text-sm font-bold" style={{ color: "#4A4F72" }}>
            <a href="#que-es" onClick={scrollTo("que-es")}>Qué es</a>
            <a href="#como-funciona" onClick={scrollTo("como-funciona")}>Cómo funciona</a>
            <a href="#familias" onClick={scrollTo("familias")}>Para familias</a>
            <a href="#seguridad" onClick={scrollTo("seguridad")}>Seguridad</a>
            <a href="#planes" onClick={scrollTo("planes")}>Planes</a>
            <a href="#blog" onClick={scrollTo("blog")}>Blog</a>
            <a href="#faq" onClick={scrollTo("faq")}>FAQ</a>
          </nav>
          <Boton variant="primary" onClick={() => navigate("/app")}>Probar la app</Boton>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${PAPEL} 0%, #ffffff 100%)` }}>
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
              style={{ background: "#DFF3F1", color: VERDE }}>
              <ShieldCheck size={13} /> Certificaciones revisadas manualmente
            </span>
            <h1 className="rd-display font-extrabold leading-[1.05] mb-5" style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)", color: NAVY }}>
              La red de <span style={{ color: VERDE }}>acompañamiento terapéutico</span> de Buenos Aires
            </h1>
            <p className="text-lg leading-relaxed mb-4 max-w-md" style={{ color: "#4A4F72" }}>
              rondas es la red de acompañamiento terapéutico que conecta a los dos lados del cuidado: acompañantes terapéuticos que coordinan salidas grupales con colegas verificados, y familias que encuentran al profesional indicado cerca suyo. Todo en un mismo lugar, con certificaciones revisadas manualmente y privacidad por diseño.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Boton variant="primary" onClick={() => navigate("/app")}>Soy acompañante terapéutico/a</Boton>
              <Boton variant="outline" onClick={scrollTo("familias")}>Busco un acompañante</Boton>
            </div>
            <p className="text-sm mt-8 max-w-md" style={{ color: GRIS }}>
              Hoy la red reúne más de 30 ATs verificados en 7 barrios de CABA, con una regla simple: la ubicación de cada salida se borra a las 48 horas.
            </p>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute rounded-full" style={{ width: 420, height: 420, background: "radial-gradient(circle, #DFF3F1 0%, transparent 70%)", top: -40 }} />
            <div className="absolute rounded-[2.5rem]" style={{ width: 160, height: 160, background: CORAL, opacity: 0.12, transform: "rotate(18deg)", bottom: 10, right: 10 }} />
            <div className="relative rounded-[2.5rem] p-2" style={{ background: NAVY, boxShadow: "0 30px 60px -15px rgba(36,43,84,0.35)", width: 300 }}>
              <div className="rounded-[2rem] overflow-hidden" style={{ height: 600, background: PAPEL }}>
                <div aria-hidden="true" style={{ transform: "scale(0.94)", transformOrigin: "top center", height: "106%", pointerEvents: "none" }}>
                  <RondaApp />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FRANJA DE CONFIANZA ---------- */}
      <section style={{ background: PAPEL }}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-center md:text-left max-w-xs" style={{ color: "#4A4F72" }}>
            La red que ya conecta ATs y familias en CABA
          </p>
          <div className="flex items-center gap-8 md:gap-12">
            {[["+30", "ATs verificados"], ["7", "barrios de CABA"], ["48hs", "borrado de ubicación"]].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="rd-display font-extrabold text-3xl" style={{ color: NAVY }}>{n}</p>
                <p className="text-xs font-semibold" style={{ color: GRIS }}>{l}</p>
              </div>
            ))}
          </div>
          <Boton variant="outline" onClick={scrollTo("que-es")}>Conocé la red</Boton>
        </div>
      </section>

      {/* ---------- ¿QUÉ ES UNA RED DE ACOMPAÑAMIENTO TERAPÉUTICO? ---------- */}
      <section id="que-es" className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: VERDE }}>Qué es rondas</p>
          <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>¿Qué es una red de acompañamiento terapéutico?</h2>
        </div>
        <div className="flex flex-col gap-5 text-base leading-relaxed" style={{ color: "#3C4368" }}>
          <p>
            <strong style={{ color: NAVY }}>Una red de acompañamiento terapéutico es una comunidad organizada de acompañantes terapéuticos (ATs) y familias que coordina salidas, verifica credenciales profesionales y protege los datos de las personas acompañadas en un solo espacio digital.</strong>
          </p>
          <p>
            <strong style={{ color: NAVY }}>Un acompañante terapéutico es un profesional de la salud que brinda apoyo personalizado a niños, adolescentes o adultos con discapacidad, padecimientos de salud mental o necesidades de acompañamiento en la vida cotidiana, siguiendo las indicaciones del equipo tratante.</strong>
          </p>
          <p>
            Hasta ahora, ese trabajo se coordinaba en grupos de WhatsApp sueltos, planillas y llamadas: sin verificación, sin trazabilidad y con datos sensibles circulando sin control. rondas ordena ese circuito completo, desde publicar una salida hasta el seguimiento en vivo, sin exponer a las personas acompañadas. Conocé{" "}
            <a href="#como-funciona" onClick={scrollTo("como-funciona")} style={{ color: VERDE, fontWeight: 700 }}>cómo funciona rondas paso a paso</a>{" "}
            o{" "}
            <a href="#familias" onClick={scrollTo("familias")} style={{ color: VERDE, fontWeight: 700 }}>buscá un acompañante terapéutico verificado</a>.
          </p>
        </div>
      </section>

      {/* ---------- PARA ACOMPAÑANTES TERAPÉUTICOS ---------- */}
      <section id="como-funciona" style={{ background: PAPEL }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: CORAL }}>Para acompañantes terapéuticos</p>
            <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>Coordiná salidas, no WhatsApps sueltos</h2>
          </div>
          <p className="text-base leading-relaxed max-w-2xl mx-auto text-center mb-16" style={{ color: "#4A4F72" }}>
            Si sos AT, rondas te da una capa profesional sobre lo que ya hacés todos los días. Publicás una salida, armás equipo con otros acompañantes verificados y resolvés la logística en un solo hilo. Conocé los{" "}
            <a href="#planes" onClick={scrollTo("planes")} style={{ color: CORAL, fontWeight: 700 }}>planes para acompañantes terapéuticos</a>.
          </p>
          <div className="flex flex-col gap-16">
            <FeatureBlock icon={CalendarDays} color={VERDE} mockup={<SalidaMockup />}
              title="Publicá o sumate a una salida grupal"
              text="Plaza, museo o parque: publicá la actividad con rango etario y cupo, o sumate a una que ya existe. Las salidas grupales permiten compartir la experiencia entre acompañados con perfiles compatibles y dividir la coordinación entre colegas." />
            <FeatureBlock reverse icon={MessageCircle} color={AMBAR} mockup={<ChatMockup />}
              title="Coordiná por chat grupal"
              text="Cada salida tiene su propio chat para acordar horarios, punto de encuentro y detalles con el resto del equipo. Nada se pierde en conversaciones paralelas: la información de la salida vive donde vive la salida." />
            <FeatureBlock icon={Sparkles} color="#8B6FC9" mockup={<GuardianMockup />}
              title="Guardián de privacidad con IA"
              text={
                <>
                  Antes de publicar, un asistente con IA revisa que no se filtren datos sensibles de los acompañados y sugiere una versión segura del texto. Es la diferencia entre coordinar en un grupo abierto y coordinar en una red pensada para el cuidado. Conocé más sobre la{" "}
                  <a href="#seguridad" onClick={scrollTo("seguridad")} style={{ color: "#8B6FC9", fontWeight: 700 }}>seguridad y privacidad en rondas</a>.
                </>
              } />
          </div>
        </div>
      </section>

      {/* ---------- PARA FAMILIAS ---------- */}
      <section id="familias" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: VERDE }}>Para familias</p>
          <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>Encontrá al acompañante terapéutico indicado</h2>
        </div>
        <p className="text-base leading-relaxed max-w-2xl mx-auto text-center mb-16" style={{ color: "#4A4F72" }}>
          Buscar acompañante terapéutico en CABA suele ser un boca a boca lento y sin garantías. En rondas, las familias usan la app gratis, siempre, y eligen con información real.
        </p>
        <div className="flex flex-col gap-16">
          <FeatureBlock icon={MapPin} color={VERDE} mockup={<BuscarMockup />}
            title="Buscá por zona y especialidad"
            text={
              <>
                Filtrá por barrio, población (niños, adolescentes, adultos) y área de acompañamiento. Mirá el mapa o la lista, como prefieras, y encontrá ATs verificados cerca tuyo. También podés consultar la{" "}
                <a href="#cud" onClick={scrollTo("cud")} style={{ color: VERDE, fontWeight: 700 }}>guía de actividades gratis con CUD</a>.
              </>
            } />
          <FeatureBlock reverse icon={HeartHandshake} color={CORAL} mockup={<PerfilMockup />}
            title="Contactá con confianza"
            text="Cada perfil muestra certificación verificada, experiencia y salidas realizadas antes de que envíes tu solicitud. Vos elegís qué información compartir en cada solicitud de contacto: el consentimiento es parte del producto, no un checkbox." />
          <FeatureBlock icon={Navigation} color="#2E86C1" mockup={<SeguimientoMockup />}
            title="Seguimiento en vivo durante la salida"
            text="Durante la salida, ves el recorrido y los avisos del AT en tiempo real. Ese registro se borra a las 48 horas: la tranquilidad no debería costar vigilancia permanente." />
        </div>
      </section>

      {/* ---------- TESTIMONIOS ---------- */}
      <section id="testimonios" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: VERDE }}>Lo que dicen en la red</p>
          <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>ATs y familias que ya coordinan en rondas</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIOS.map((t) => <Testimonio key={t.nombre} {...t} />)}
        </div>
      </section>

      {/* ---------- SEGURIDAD ---------- */}
      <section id="seguridad" style={{ background: PAPEL }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: CORAL }}>Diseñado con cuidado</p>
              <h2 className="rd-display font-extrabold text-3xl mb-5" style={{ color: NAVY }}>Privacidad por diseño: la base del acompañamiento terapéutico</h2>
              <p className="text-sm mb-5" style={{ color: "#4A4F72" }}>
                En rondas, la privacidad no es una opción de configuración: es la arquitectura. Estas son las reglas que se aplican a toda la red:
              </p>
              <div className="flex flex-col gap-4">
                {[
                  "Los datos de las personas acompañadas nunca se publican: los perfiles públicos solo muestran rango etario y contexto de la actividad.",
                  "Los certificados de AT se revisan manualmente antes de otorgar el distintivo de verificado, sin automatismos ciegos.",
                  "La ubicación solo se comparte durante la salida activa y se elimina automáticamente a las 48 horas.",
                  "Las familias eligen qué información compartir en cada solicitud de contacto, con consentimiento informado granular.",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 22, height: 22, background: "#DFF3F1", marginTop: 2 }}>
                      <Check size={13} color={VERDE} />
                    </div>
                    <p className="text-sm" style={{ color: "#4A4F72" }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl p-8" style={{ background: NAVY }}>
              <ShieldCheck size={32} color={AMBAR} />
              <h3 className="rd-display font-bold text-xl mt-3 mb-2" style={{ color: "#fff" }}>Verificación manual, siempre</h3>
              <p className="text-sm" style={{ color: "#B9BEDC" }}>
                Ningún certificado se aprueba de forma automática. Un equipo humano revisa la documentación profesional de cada acompañante que se suma a la red antes de otorgar el distintivo de verificado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ACTIVIDADES GRATUITAS CON CUD ---------- */}
      <section id="cud" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: AMBAR }}>Accesibilidad</p>
            <h2 className="rd-display font-extrabold text-3xl mb-5" style={{ color: NAVY }}>Actividades gratuitas con CUD en Buenos Aires</h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: "#3C4368" }}>
              <strong style={{ color: NAVY }}>El CUD (Certificado Único de Discapacidad) es el documento oficial argentino que acredita la discapacidad y habilita el acceso gratuito a transporte y a numerosos espacios culturales para la persona y su acompañante.</strong>
            </p>
            <p className="text-base leading-relaxed" style={{ color: "#3C4368" }}>
              La app incluye una guía curada de transporte, parques y museos con entrada gratuita para personas con CUD y su acompañante, pensada para que planificar una salida accesible tome minutos y no tardes enteras de búsqueda.
            </p>
          </div>
          <div className="rounded-3xl p-8" style={{ background: NAVY }}>
            <Accessibility size={32} color={AMBAR} />
            <h3 className="rd-display font-bold text-xl mt-3 mb-2" style={{ color: "#fff" }}>Guía de actividades con CUD</h3>
            <p className="text-sm mb-4" style={{ color: "#B9BEDC" }}>
              Transporte, parques y museos con entrada gratuita para vos y tu acompañado.
            </p>
            <Boton variant="outlineWhite" onClick={scrollTo("app")}>Ver la guía <ChevronRight size={15} /></Boton>
          </div>
        </div>
      </section>

      {/* ---------- ¿QUÉ MÁS INCLUYE RONDAS? ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: CORAL }}>¿Qué más incluye rondas?</p>
          <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>Todo lo que necesitás en un solo lugar</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl p-8" style={{ background: PAPEL }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: CORAL }}>Para acompañantes</p>
            <h3 className="rd-display font-extrabold text-xl mb-4" style={{ color: NAVY }}>Para coordinar con tranquilidad</h3>
            <div className="flex flex-col gap-3 mb-6">
              {[
                "Guía de actividades gratis con CUD",
                "Guardián de privacidad con IA en cada publicación",
                "Verificación manual de cada certificado profesional",
                "Chat de coordinación propio en cada salida",
                "Seguro de responsabilidad civil que cubre tu jornada completa de acompañamiento",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2.5">
                  <Check size={16} color={CORAL} style={{ flexShrink: 0 }} />
                  <p className="text-sm" style={{ color: "#4A4F72" }}>{t}</p>
                </div>
              ))}
            </div>
            <Boton variant="dark" onClick={scrollTo("planes")}>Ver planes <ChevronRight size={15} /></Boton>
          </div>
          <div className="rounded-3xl p-8" style={{ background: NAVY }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: AMBAR }}>Se adapta a cada familia</p>
            <h3 className="rd-display font-extrabold text-xl mb-4" style={{ color: "#fff" }}>Acompañamiento para cada edad</h3>
            <div className="flex flex-col gap-3 mb-6">
              {["Niñez", "Adolescencia", "Adultos", "Adultos mayores"].map((t) => (
                <div key={t} className="flex items-center gap-2.5">
                  <Check size={16} color={VERDE} style={{ flexShrink: 0 }} />
                  <p className="text-sm" style={{ color: "#B9BEDC" }}>{t}</p>
                </div>
              ))}
            </div>
            <Boton variant="outlineWhite" onClick={scrollTo("familias")}>Buscar un acompañante <ChevronRight size={15} /></Boton>
          </div>
        </div>
      </section>

      {/* ---------- PLANES ---------- */}
      <section id="planes" style={{ background: PAPEL }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: VERDE }}>Planes para ATs</p>
            <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>Planes para ATs: menos de una hora de tu trabajo al mes</h2>
            <p className="text-sm mt-2" style={{ color: GRIS }}>Las familias siempre usan rondas gratis.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { n: "Free", p: "$0", d: "para siempre", f: ["Salidas ilimitadas", "Chats de coordinación", "1 informe con IA por mes"] },
              { n: "Plus", p: "ARS 9.900", d: "por mes", dest: true, f: ["Informes con IA ilimitados", "Planificador con IA", "Verificación express", "Seguro de responsabilidad civil (opcional)"] },
              { n: "Pro", p: "ARS 18.900", d: "por mes", f: ["Todo lo de Plus", "Agenda y recordatorios", "Exportación para obras sociales", "Seguro de responsabilidad civil incluido"] },
            ].map((pl) => (
              <div key={pl.n} className="rounded-3xl p-6 bg-white relative" style={{ border: pl.dest ? "2px solid " + CORAL : "1px solid #E7E8F3" }}>
                {pl.dest && <span className="absolute text-xs font-bold px-3 py-1 rounded-full" style={{ top: -10, right: 20, background: CORAL, color: "#fff" }}>Más elegido</span>}
                <p className="rd-display font-bold text-lg" style={{ color: NAVY }}>{pl.n}</p>
                <p className="rd-display font-extrabold text-2xl mt-1" style={{ color: VERDE }}>{pl.p}<span className="text-xs font-semibold" style={{ color: GRIS }}> {pl.d}</span></p>
                <ul className="flex flex-col gap-2 mt-4">
                  {pl.f.map((x) => (
                    <li key={x} className="text-sm flex items-start gap-2" style={{ color: "#4A4F72" }}>
                      <Check size={14} color={VERDE} style={{ flexShrink: 0, marginTop: 3 }} />{x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- BLOG ---------- */}
      <section id="blog" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: VERDE }}>Blog de rondas</p>
          <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>Recursos sobre acompañamiento terapéutico</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((p) => <BlogCard key={p.titulo} {...p} />)}
        </div>
      </section>

      {/* ---------- APP PREVIEW / CTA FINAL ---------- */}
      <section id="app" style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="rd-display font-extrabold text-3xl md:text-4xl mb-4" style={{ color: "#fff" }}>Probá el prototipo ahora</h2>
            <p className="text-base max-w-md mx-auto md:mx-0" style={{ color: "#B9BEDC" }}>
              ¿Querés recorrer el flujo completo? Elegí tu rol y recorré registro, salidas, chats y seguimiento en vivo.
            </p>
          </div>
          <div className="mx-auto rounded-[2.5rem] p-2" style={{ background: "#fff", boxShadow: "0 30px 60px -15px rgba(0,0,0,0.4)", width: 320 }}>
            <div className="rounded-[2rem] overflow-hidden" style={{ height: 680, background: PAPEL }}>
              <RondaApp />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: CORAL }}>Preguntas frecuentes</p>
          <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>Preguntas frecuentes sobre acompañamiento terapéutico</h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              pregunta={f.q}
              respuesta={f.a}
              abierto={faqAbierta === i}
              onClick={() => setFaqAbierta(faqAbierta === i ? null : i)}
            />
          ))}
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <LogoRondas size={28} variant="blanco" />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#8790B3" }}>Red de acompañamiento terapéutico. Prototipo de producto.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#8790B3" }}>Producto</p>
            <div className="flex flex-col gap-2 text-sm" style={{ color: "#B9BEDC" }}>
              <a href="#que-es" onClick={scrollTo("que-es")}>Qué es rondas</a>
              <a href="#como-funciona" onClick={scrollTo("como-funciona")}>Para acompañantes</a>
              <a href="#familias" onClick={scrollTo("familias")}>Para familias</a>
              <a href="#planes" onClick={scrollTo("planes")}>Planes</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#8790B3" }}>Recursos</p>
            <div className="flex flex-col gap-2 text-sm" style={{ color: "#B9BEDC" }}>
              <a href="#cud" onClick={scrollTo("cud")}>Guía de actividades con CUD</a>
              <a href="#blog" onClick={scrollTo("blog")}>Blog</a>
              <a href="#faq" onClick={scrollTo("faq")}>Preguntas frecuentes</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#8790B3" }}>Confianza</p>
            <div className="flex flex-col gap-2 text-sm" style={{ color: "#B9BEDC" }}>
              <a href="#seguridad" onClick={scrollTo("seguridad")}>Seguridad y privacidad</a>
              <a href="#testimonios" onClick={scrollTo("testimonios")}>Testimonios</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="max-w-6xl mx-auto px-6 py-6">
            <p className="text-xs" style={{ color: "#8790B3" }}>© 2026 rondas. Red de acompañamiento terapéutico, prototipo de producto.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
