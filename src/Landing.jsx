import React, { useState } from "react";
import {
  CalendarDays, ShieldCheck, MapPin, MessageCircle, Sparkles, HeartHandshake,
  Users, Navigation, Check, ChevronRight, Accessibility,
} from "lucide-react";
import RondaApp, { RONDAS_BRAND, LogoRondas } from "./App.jsx";

const { VERDE, CORAL, NAVY, PAPEL, GRIS, AMBAR } = RONDAS_BRAND;

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

const Feature = ({ icon: Icon, color, title, text }) => (
  <div className="rounded-3xl p-6 bg-white" style={{ border: "1px solid #E7E8F3" }}>
    <div className="rounded-2xl flex items-center justify-center mb-4" style={{ width: 48, height: 48, background: color + "1A" }}>
      <Icon size={24} color={color} />
    </div>
    <h3 className="rd-display font-bold text-lg mb-1.5" style={{ color: NAVY }}>{title}</h3>
    <p className="text-sm leading-relaxed" style={{ color: GRIS }}>{text}</p>
  </div>
);

export default function Landing() {
  const [nav, setNav] = useState(false);

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
            <LogoRondas size={34} />
            <span className="rd-display font-extrabold text-xl" style={{ color: NAVY }}>rondas</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold" style={{ color: "#4A4F72" }}>
            <a href="#como-funciona" onClick={scrollTo("como-funciona")}>Cómo funciona</a>
            <a href="#familias" onClick={scrollTo("familias")}>Para familias</a>
            <a href="#seguridad" onClick={scrollTo("seguridad")}>Seguridad</a>
            <a href="#planes" onClick={scrollTo("planes")}>Planes</a>
          </nav>
          <Boton variant="primary" onClick={scrollTo("app")}>Probar la app</Boton>
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
              La red de <span style={{ color: VERDE }}>acompañamiento</span> terapéutico
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "#4A4F72" }}>
              Acompañantes terapéuticos que coordinan salidas grupales, y familias que encuentran al profesional indicado cerca suyo. Todo en un mismo lugar, pensado para el cuidado.
            </p>
            <div className="flex flex-wrap gap-3">
              <Boton variant="primary" onClick={scrollTo("app")}>Soy acompañante terapéutico/a</Boton>
              <Boton variant="outline" onClick={scrollTo("familias")}>Busco un acompañante</Boton>
            </div>
            <div className="flex items-center gap-6 mt-10">
              {[["+30", "ATs verificados"], ["7", "barrios de CABA"], ["48hs", "borrado de ubicación"]].map(([n, l]) => (
                <div key={l}>
                  <p className="rd-display font-extrabold text-2xl" style={{ color: NAVY }}>{n}</p>
                  <p className="text-xs font-semibold" style={{ color: GRIS }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute rounded-full" style={{ width: 420, height: 420, background: "radial-gradient(circle, #DFF3F1 0%, transparent 70%)", top: -40 }} />
            <div className="relative rounded-[2.5rem] p-2" style={{ background: NAVY, boxShadow: "0 30px 60px -15px rgba(36,43,84,0.35)", width: 300 }}>
              <div className="rounded-[2rem] overflow-hidden" style={{ height: 600, background: PAPEL }}>
                <div style={{ transform: "scale(0.94)", transformOrigin: "top center", height: "106%" }}>
                  <RondaApp />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CÓMO FUNCIONA ---------- */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: CORAL }}>Para acompañantes terapéuticos</p>
          <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>Coordiná salidas, no WhatsApps sueltos</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Feature icon={CalendarDays} color={VERDE} title="Publicá o sumate a una salida"
            text="Plaza, museo o parque: publicá la actividad con rango etario y cupo, o sumate a una que ya existe." />
          <Feature icon={MessageCircle} color={AMBAR} title="Coordiná por chat grupal"
            text="Cada salida tiene su propio chat para acordar horarios, punto de encuentro y detalles con el resto del equipo." />
          <Feature icon={Sparkles} color="#8B6FC9" title="Guardián de privacidad con IA"
            text="Antes de publicar, un asistente revisa que no se filtren datos sensibles de los acompañados y sugiere una versión segura." />
        </div>
      </section>

      {/* ---------- FAMILIAS ---------- */}
      <section id="familias" style={{ background: PAPEL }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: VERDE }}>Para familias</p>
            <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>Encontrá al acompañante indicado</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Feature icon={MapPin} color={VERDE} title="Buscá por zona y especialidad"
              text="Filtrá por barrio, población y área de acompañamiento. Mirá el mapa o la lista, como prefieras." />
            <Feature icon={HeartHandshake} color={CORAL} title="Contactá con confianza"
              text="Cada perfil muestra certificación verificada, experiencia y salidas realizadas antes de que envíes tu solicitud." />
            <Feature icon={Navigation} color="#2E86C1" title="Seguimiento en vivo"
              text="Durante la salida, ves el recorrido y los avisos del AT en tiempo real. Se borra a las 48 horas." />
          </div>
        </div>
      </section>

      {/* ---------- SEGURIDAD ---------- */}
      <section id="seguridad" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: CORAL }}>Diseñado con cuidado</p>
            <h2 className="rd-display font-extrabold text-3xl mb-5" style={{ color: NAVY }}>La privacidad no es una opción, es la base</h2>
            <div className="flex flex-col gap-4">
              {[
                "Los datos de las personas acompañadas nunca se publican: solo rango etario y contexto de la actividad.",
                "Certificados de AT revisados manualmente antes de otorgar el distintivo verificado.",
                "La ubicación solo se comparte durante la salida activa, y se elimina a las 48 horas.",
                "Las familias eligen qué información compartir en cada solicitud de contacto.",
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
            <Accessibility size={32} color={AMBAR} />
            <h3 className="rd-display font-bold text-xl mt-3 mb-2" style={{ color: "#fff" }}>Actividades gratis con CUD</h3>
            <p className="text-sm mb-4" style={{ color: "#B9BEDC" }}>
              La app incluye una guía de transporte, parques y museos con entrada gratuita para personas con Certificado Único de Discapacidad y su acompañante.
            </p>
            <Boton variant="outlineWhite" onClick={scrollTo("app")}>Ver la guía <ChevronRight size={15} /></Boton>
          </div>
        </div>
      </section>

      {/* ---------- PLANES ---------- */}
      <section id="planes" style={{ background: PAPEL }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: VERDE }}>Planes para ATs</p>
            <h2 className="rd-display font-extrabold text-3xl md:text-4xl" style={{ color: NAVY }}>Menos de una hora de tu trabajo al mes</h2>
            <p className="text-sm mt-2" style={{ color: GRIS }}>Las familias siempre usan rondas gratis.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { n: "Free", p: "$0", d: "para siempre", f: ["Salidas ilimitadas", "Chats de coordinación", "1 informe con IA/mes"] },
              { n: "Plus", p: "ARS 9.900", d: "por mes", dest: true, f: ["Informes con IA ilimitados", "Planificador con IA", "Verificación express"] },
              { n: "Pro", p: "ARS 18.900", d: "por mes", f: ["Todo lo de Plus", "Agenda y recordatorios", "Exportación para obras sociales"] },
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

      {/* ---------- APP PREVIEW / CTA FINAL ---------- */}
      <section id="app" className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="rd-display font-extrabold text-3xl md:text-4xl mb-4" style={{ color: NAVY }}>Probá el prototipo ahora</h2>
        <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: GRIS }}>
          Elegí tu rol y recorré el flujo completo: registro, salidas, chats y seguimiento en vivo.
        </p>
        <div className="mx-auto rounded-[2.5rem] p-2" style={{ background: NAVY, boxShadow: "0 30px 60px -15px rgba(36,43,84,0.3)", width: 320 }}>
          <div className="rounded-[2rem] overflow-hidden" style={{ height: 680, background: PAPEL }}>
            <RondaApp />
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoRondas size={28} />
            <span className="rd-display font-bold text-base" style={{ color: "#fff" }}>rondas</span>
          </div>
          <p className="text-xs" style={{ color: "#8790B3" }}>© 2026 rondas — Red de acompañamiento terapéutico. Prototipo de producto.</p>
        </div>
      </footer>
    </div>
  );
}
