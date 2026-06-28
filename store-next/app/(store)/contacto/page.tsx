'use client'

// @ts-nocheck
import { MapPin, Mail, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { content } from "@/data/siteData";
import { useStore } from "@/context/StoreContext";
import { ContactForm } from "@/components/ContactForm";

function ThinLine({ className = "", style = {} }) {
  return (
    <div
      className={`h-px ${className}`}
      style={{ backgroundColor: "var(--color-border)", ...style }}
    />
  );
}

function PetalDeco({ className = "", style = {} }) {
  return (
    <svg
      viewBox="0 0 60 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M30 75 C10 60 0 40 5 20 C10 5 20 0 30 0 C40 0 50 5 55 20 C60 40 50 60 30 75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BottomWave({ toColor, flip = false }) {
  return (
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ height: 72, display: "block", width: "100%" }}
      >
        <path
          d={
            flip
              ? "M0,32 C240,0 480,64 720,32 C960,0 1200,64 1440,32 L1440,72 L0,72 Z"
              : "M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,72 L0,72 Z"
          }
          fill={toColor}
        />
      </svg>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  children,
  as: Tag = "div",
  href = undefined,
  onClick = undefined,
}) {
  const base = `
    flex items-start gap-4 p-5 rounded-2xl bg-white
    border border-[var(--color-border)]
    hover:border-[var(--color-primary)]/30
    hover:shadow-[0_4px_20px_rgba(203,110,228,0.08)]
    transition-all duration-200
  `;
  const content = (
    <>
      <div className="w-11 h-11 rounded-xl bg-[var(--color-primary-light)]/40 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[var(--color-primary)]" />
      </div>
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-muted)] mb-1">
          {label}
        </p>
        <div className="text-[var(--color-text-primary)] text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </>
  );

  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {content}
      </a>
    );
  const Component = Tag as any
  return <Component className={base}>{content}</Component>;
}

function useFormattedSchedules(store) {
  const DAY_NAMES = {
    mon: "Lunes", tue: "Martes", wed: "Miércoles", thu: "Jueves",
    fri: "Viernes", sat: "Sábado", sun: "Domingo",
  };
  const DAY_ORDER = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };
  const schedules = Array.isArray(store?.business_hours) ? store.business_hours : [];
  return schedules
    .map((block) => {
      if (!block.days?.length || !block.timeRanges?.length) return null;
      const sorted = [...block.days].sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b]);
      const daysLabel =
        sorted.length > 2
          ? `${DAY_NAMES[sorted[0]].slice(0, 3)} a ${DAY_NAMES[sorted[sorted.length - 1]].slice(0, 3)}`
          : sorted.map((d) => DAY_NAMES[d]).join(" y ");
      const timesLabel = block.timeRanges.map((r) => `${r.open} - ${r.close}`).join(" / ");
      return { days: daysLabel, times: timesLabel };
    })
    .filter(Boolean);
}

/* ══════════════════════════════════════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════════════════════════════════════ */
export default function Contact() {
  const { title, subtitle, infoTitle } = content.contact;
  const { store } = useStore();
  const schedules = useFormattedSchedules(store);
  const whatsappNumber = (store?.whatsapp_number || "").replace(/\D/g, "");

  return (
    <>
      {/* ══ HERO — crema floral ══ */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "5rem",
          paddingBottom: "6rem",
        }}
      >
        <PetalDeco
          className="absolute top-6 right-[8%] text-[var(--color-lila)] hidden md:block"
          style={{ width: 150, opacity: 0.1 }}
        />
        <PetalDeco
          className="absolute -bottom-4 left-[4%] text-[var(--color-accent)] hidden md:block"
          style={{ width: 100, opacity: 0.25, transform: "rotate(-15deg)" }}
        />
        <PetalDeco
          className="absolute top-1/2 left-[45%] text-[var(--color-lila)] hidden lg:block"
          style={{ width: 70, opacity: 0.06, transform: "rotate(10deg) translateY(-50%)" }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: "var(--color-accent)" }} />
            <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: "var(--color-accent)" }}>
              Contacto
            </span>
          </div>

          <h1
            className="max-w-2xl mb-5"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "var(--color-text-primary)",
            }}
          >
            {title}
          </h1>
          <p
            className="max-w-xl"
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>

          <div className="flex items-center gap-3 mt-6">
            <div className="h-px w-10" style={{ backgroundColor: "var(--color-border-hover)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-lila)", opacity: 0.7 }} />
            <div className="h-px w-24" style={{ backgroundColor: "var(--color-border-hover)" }} />
          </div>
        </div>

        <BottomWave toColor="#ffffff" />
      </section>

      {/* ══ GRID: FORMULARIO + INFO ══ */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
            {/* ── Columna izquierda: Formulario ── */}
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-6" style={{ backgroundColor: "var(--color-accent)" }} />
                  <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: "var(--color-accent)" }}>
                    Escribinos
                  </span>
                </div>
                <h2 className="text-2xl font-normal text-[var(--color-text-primary)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  Envianos tu mensaje
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-px w-8" style={{ backgroundColor: "var(--color-border-hover)" }} />
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--color-lila)", opacity: 0.7 }} />
                  <div className="h-px w-16" style={{ backgroundColor: "var(--color-border-hover)" }} />
                </div>
              </div>

              <ContactForm />
            </div>

            {/* ── Columna derecha: Info de contacto ── */}
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-6" style={{ backgroundColor: "var(--color-accent)" }} />
                  <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: "var(--color-accent)" }}>
                    Encontranos
                  </span>
                </div>
                <h2 className="text-2xl font-normal text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
                  {infoTitle}
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-px w-8" style={{ backgroundColor: "var(--color-border-hover)" }} />
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--color-lila)", opacity: 0.7 }} />
                  <div className="h-px w-16" style={{ backgroundColor: "var(--color-border-hover)" }} />
                </div>
              </div>

              <div className="space-y-3">
                {store?.address && (
                  <InfoCard icon={MapPin} label="Dirección">
                    {store.address}
                  </InfoCard>
                )}

                {store?.whatsapp_number && (
                  <InfoCard
                    icon={MessageCircle}
                    label="WhatsApp"
                    href={`https://wa.me/${whatsappNumber}`}
                  >
                    <span className="font-medium">{store.whatsapp_number}</span>
                    <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">
                      Respondemos a la brevedad
                    </span>
                  </InfoCard>
                )}

                {store?.email && (
                  <InfoCard icon={Mail} label="Email" href={`mailto:${store.email}`}>
                    {store.email}
                  </InfoCard>
                )}

                {schedules.length > 0 && (
                  <InfoCard icon={Clock} label="Horarios">
                    <ul className="space-y-2 mt-0.5">
                      {schedules.map((s, i) => (
                        <li key={i} className="flex flex-col gap-0.5">
                          <span className="font-semibold text-[var(--color-text-primary)]">
                            {s.days}
                          </span>
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-md inline-block w-fit"
                            style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}
                          >
                            {s.times}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </InfoCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAPA ══ */}
      {store?.address && (
        <section className="relative bg-white px-4 sm:px-6 lg:px-8 pb-0">
          <div className="max-w-7xl mx-auto">
            <div
              className="rounded-3xl overflow-hidden border border-[var(--color-border)]"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}
            >
              <iframe
                title={`Mapa de ${store.address}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(store.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="360"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {/* ══ CTA WHATSAPP ══ */}
      {whatsappNumber && (
        <>
          <div className="bg-white overflow-hidden leading-none" aria-hidden="true">
            <svg
              viewBox="0 0 1440 64"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ height: 64, display: "block", width: "100%" }}
            >
              <path
                d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,20 1440,32 L1440,64 L0,64 Z"
                fill="#1a1a1a"
              />
            </svg>
          </div>

          <section className="bg-[#1a1a1a] relative overflow-hidden px-4 sm:px-6 lg:px-8 py-14">
            <PetalDeco
              className="absolute right-6 top-4 text-white pointer-events-none hidden md:block"
              style={{ width: 120, opacity: 0.04 }}
            />
            <PetalDeco
              className="absolute left-4 bottom-2 text-[var(--color-lila)] pointer-events-none hidden md:block"
              style={{ width: 80, opacity: 0.1 }}
            />

            <div className="max-w-xl mx-auto text-center relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: "var(--color-lila)", opacity: 0.4 }} />
                <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: "var(--color-lila)", opacity: 0.8 }}>
                  Respuesta rápida
                </span>
                <div className="h-px w-8" style={{ backgroundColor: "var(--color-lila)", opacity: 0.4 }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-normal text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                ¿Preferís hablar por WhatsApp?
              </h2>
              <p className="text-white/60 text-sm mb-8">
                Escribinos directo y te respondemos al instante.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "var(--color-primary)",
                  borderRadius: "2rem",
                  boxShadow: "0 4px 14px rgba(203,110,228,0.35)",
                }}
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Escribinos por WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        </>
      )}
    </>
  );
}
