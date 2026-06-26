import { Link } from "react-router-dom";
import { MapPin, Mail, MessageCircle } from "lucide-react";
import { siteData } from "../../../data/siteData";
import { useStore } from "../../context/StoreContext";

/* ── Pétalo SVG — firma visual de Pétalos Serena ── */
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

/* ── Íconos de redes ── */
const socialIcons = {
  instagram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  tiktok: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
  youtube: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 11.75a29.94 29.94 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29.94 29.94 0 0 0 .46-5.25 29.94 29.94 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
};

/* ── Título de columna ── */
function FooterColTitle({ children }) {
  return (
    <h4
      className="text-xs font-medium tracking-[0.2em] uppercase mb-4"
      style={{ color: "var(--color-accent)" }}
    >
      {children}
    </h4>
  );
}

/* ── Item de contacto ── */
function ContactItem({ icon: Icon, href, children }) {
  const inner = (
    <>
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          color: "var(--color-lila)",
        }}
      >
        <Icon className="w-3.5 h-3.5" />
      </span>
      <span
        className="text-sm leading-snug"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="flex items-start gap-3 transition-colors group"
        onMouseEnter={(e) =>
          (e.currentTarget.querySelector("span:last-child").style.color =
            "rgba(255,255,255,0.9)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.querySelector("span:last-child").style.color =
            "rgba(255,255,255,0.5)")
        }
      >
        {inner}
      </a>
    );
  }
  return <div className="flex items-start gap-3">{inner}</div>;
}

/* ══════════════════════════════════════════════════════════════════════
   FOOTER — Pétalos Serena
   Datos dinámicos desde useStore (mismo patrón que petshop)
   Identidad visual: lila/violeta/salvia, fondo #2C1F33 (violeta muy oscuro)
   Sin onda de entrada — sistema sin dividers
══════════════════════════════════════════════════════════════════════ */
export function Footer({ waveFromColor }) {
  const { store, categories } = useStore();
  const currentYear = new Date().getFullYear();
  const whatsappNumber = (store?.whatsapp_number || "").replace(/\D/g, "");

  /* Horarios formateados */
  const DAY_NAMES = {
    mon: "Lunes",
    tue: "Martes",
    wed: "Miércoles",
    thu: "Jueves",
    fri: "Viernes",
    sat: "Sábado",
    sun: "Domingo",
  };
  const DAY_ORDER = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };
  const schedules = Array.isArray(store?.business_hours)
    ? store.business_hours
    : [];
  const formattedSchedules = schedules
    .map((block) => {
      if (!block.days?.length || !block.timeRanges?.length) return null;
      const sorted = [...block.days].sort(
        (a, b) => DAY_ORDER[a] - DAY_ORDER[b],
      );
      const daysLabel =
        sorted.length > 2
          ? `${DAY_NAMES[sorted[0]].slice(0, 3)} a ${DAY_NAMES[sorted[sorted.length - 1]].slice(0, 3)}`
          : sorted.map((d) => DAY_NAMES[d]).join(" y ");
      const timesLabel = block.timeRanges
        .map((r) => `${r.open} - ${r.close}`)
        .join(" / ");
      return { days: daysLabel, times: timesLabel };
    })
    .filter(Boolean);

  const hasSocials =
    store?.instagram || store?.facebook || store?.tiktok || store?.youtube;

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#2C1F33",
        borderTop: "1px solid rgba(232,180,248,0.12)",
      }}
    >
      {/* Pétalos decorativos de fondo */}
      <PetalDeco
        className="absolute top-8 right-10 w-32 h-44 pointer-events-none hidden lg:block"
        style={{ color: "var(--color-lila)", opacity: 0.05 }}
      />
      <PetalDeco
        className="absolute bottom-8 left-6 w-20 h-28 pointer-events-none hidden lg:block"
        style={{
          color: "var(--color-accent)",
          opacity: 0.07,
          transform: "rotate(20deg)",
        }}
      />
      <PetalDeco
        className="absolute top-1/2 left-1/3 w-14 h-20 pointer-events-none hidden xl:block"
        style={{
          color: "var(--color-lila)",
          opacity: 0.03,
          transform: "rotate(-10deg)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* ── Col 1: Logo + descripción ── */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              {store?.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.business_name || ""}
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.4rem",
                    fontWeight: 400,
                    color: "#ffffff",
                    letterSpacing: "0.02em",
                  }}
                >
                  {store?.business_name || "Pétalos Serena"}
                </span>
              )}
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {store?.description || ""}
            </p>
          </div>

          {/* ── Cols 2-3: Navegación desde siteData ── */}
          {siteData.footer.columns.map((column, index) => (
            <div key={index}>
              <FooterColTitle>{column.title}</FooterColTitle>
              <ul className="space-y-2.5">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Col 4: Categorías desde API ── */}
          <div>
            <FooterColTitle>Categorías</FooterColTitle>
            {categories.length > 0 ? (
              <ul className="space-y-2.5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/productos?cat=${encodeURIComponent(cat.name)}`}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
                      }
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                Cargando...
              </p>
            )}
          </div>

          {/* ── Col 5: Contacto + Horarios + Redes ── */}
          <div className="space-y-8">
            {/* Contacto */}
            <div>
              <FooterColTitle>Contacto</FooterColTitle>
              <ul className="space-y-3">
                {whatsappNumber && (
                  <li>
                    <ContactItem
                      icon={MessageCircle}
                      href={`https://wa.me/${whatsappNumber}`}
                    >
                      WhatsApp
                    </ContactItem>
                  </li>
                )}
                {store?.address && (
                  <li>
                    <ContactItem icon={MapPin}>{store.address}</ContactItem>
                  </li>
                )}
                {store?.email && (
                  <li>
                    <ContactItem icon={Mail} href={`mailto:${store.email}`}>
                      {store.email}
                    </ContactItem>
                  </li>
                )}
              </ul>
            </div>

            {/* Horarios */}
            {formattedSchedules.length > 0 && (
              <div>
                <FooterColTitle>Horarios</FooterColTitle>
                <ul className="space-y-2">
                  {formattedSchedules.map((s, i) => (
                    <li key={i}>
                      <span
                        className="text-xs font-medium block"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {s.days}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-lila)", opacity: 0.8 }}
                      >
                        {s.times}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Redes */}
            {hasSocials && (
              <div>
                <FooterColTitle>Seguinos</FooterColTitle>
                <div className="flex gap-2 flex-wrap">
                  {["instagram", "facebook", "tiktok", "youtube"].map((net) =>
                    store?.[net] ? (
                      <a
                        key={net}
                        href={store[net]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={net}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.07)",
                          color: "rgba(255,255,255,0.5)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--color-primary)";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.07)";
                          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                        }}
                      >
                        {socialIcons[net]}
                      </a>
                    ) : null,
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Separador con pétalo + copyright ── */}
        <div className="flex items-center gap-4 mb-6" aria-hidden="true">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "rgba(232,180,248,0.1)" }}
          />
          <PetalDeco
            className="w-3 h-4"
            style={{ color: "var(--color-lila)", opacity: 0.4 }}
          />
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "rgba(232,180,248,0.1)" }}
          />
        </div>

        <p
          className="text-xs text-center"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          © {currentYear} {store?.business_name || "Pétalos Serena"}. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}
