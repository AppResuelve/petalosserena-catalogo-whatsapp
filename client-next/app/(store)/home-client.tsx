// @ts-nocheck
'use client'
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";
import { content } from "@/data/siteData";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/store/ProductCard";

/* ─────────────────────────────────────────────────────────────────────────
   IMÁGENES / VIDEO — reemplazá las URLs por los assets definitivos
───────────────────────────────────────────────────────────────────────── */
const HERO_VIDEO_URL = null; // ← pon aquí la URL del .mp4 cuando tengas
const HERO_SLIDES = [
  { desktop: "/hero/imagen1pc.jpeg", mobile: "/hero/image1mobile.png" },
  { desktop: "/hero/image2pc.jpeg", mobile: "/hero/image2mobile.jpeg" },
  { desktop: "/hero/image3pc.jpeg", mobile: "/hero/imgen3mobile.jpg" },
];

const FERIAS = [
  {
    id: 1,
    name: "Feria Nacional del Poncho",
    location: "Catamarca",
    date: "Julio 2026",
    description:
      "Una de las ferias artesanales más importantes del país. Encontranos en el stand de flores y accesorios.",
    image: "/image-feria-poncho.webp",
  },
  {
    id: 2,
    name: "Feria de Artesanos",
    location: "Mar del Plata, Buenos Aires",
    date: "Todos los sábados y domingos",
    description:
      "Feria local donde podés ver y tocar nuestras creaciones de cerca.",
    image: "/image-feria-artesanos-mardelplata.jpg",
  },
];

/* ── Línea decorativa fina del sistema ── */
function ThinLine({ className = "", style = {} }) {
  return (
    <div
      className={`h-px ${className}`}
      style={{ backgroundColor: "var(--color-border)", ...style }}
    />
  );
}

/* ── Pétalo SVG decorativo — firma visual ── */
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

/* ─────────────────────────────────────────────────────────────────────────
   HERO VIDEO / CARRUSEL
───────────────────────────────────────────────────────────────────────── */
function HeroMedia({ current }: { current: number }) {
  if (HERO_VIDEO_URL) {
    return (
      <video
        src={HERO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden="true"
        >
          <Image
            src={slide.desktop}
            alt=""
            fill
            className="hidden md:block object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <Image
            src={slide.mobile}
            alt=""
            fill
            className="block md:hidden object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CARRUSEL DE PRODUCTOS
───────────────────────────────────────────────────────────────────────── */
function ProductCarousel({ products, className = "" }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, products]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(":scope > *")?.offsetWidth || 300;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <div className={`relative group/carousel ${className}`}>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.ps-track::-webkit-scrollbar { display: none; }`}</style>
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md hidden md:flex"
          style={{ backgroundColor: "var(--color-primary)", color: "#ffffff" }}
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md hidden md:flex"
          style={{ backgroundColor: "var(--color-primary)", color: "#ffffff" }}
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   HOME
───────────────────────────────────────────────────────────────────────── */
export default function HomeClient() {
  const { hero, featuredTitle, featuredSubtitle, cta } = content.home;
  const { productsMap } = useStore();

  const [heroCurrent, setHeroCurrent] = useState(0);

  useEffect(() => {
    if (HERO_VIDEO_URL) return;
    const id = setInterval(() => {
      setHeroCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const featuredProducts = useMemo(
    () =>
      Object.values(productsMap)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5),
    [productsMap],
  );

  return (
    <main className="overflow-hidden">
      {/* ══ HERO — video/carrusel fullscreen ══════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        <HeroMedia current={heroCurrent} />

        {/* Overlay gradiente: negro en bottom para legibilidad del texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Texto hero */}
        <div className="relative w-full px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
          <div className="max-w-7xl mx-auto">
            {/* Línea lila fina decorativa */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="h-px w-12"
                style={{ backgroundColor: "var(--color-lila)" }}
              />
              <span
                className="text-xs font-medium tracking-[0.25em] uppercase"
                style={{ color: "rgba(232,180,248,0.9)" }}
              >
                Flores de tela artesanales
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 8vw, 6rem)",
                fontWeight: 300,
                lineHeight: 1.0,
                color: "#ffffff",
                marginBottom: "1.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              {hero.title}
              {hero.highlightedText && (
                <>
                  {" "}
                  <em
                    style={{
                      color: "var(--color-lila)",
                      fontStyle: "italic",
                      fontWeight: 300,
                    }}
                  >
                    {hero.highlightedText}
                  </em>
                </>
              )}
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1rem",
                lineHeight: 1.7,
                maxWidth: "28rem",
                marginBottom: "2rem",
                fontWeight: 300,
              }}
            >
              {hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={hero.primaryButtonLink}
                className="inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  padding: "0.875rem 2rem",
                  borderRadius: "2rem",
                  backgroundColor: "var(--color-primary)",
                  color: "#ffffff",
                  boxShadow: "0 4px 20px rgba(203,110,228,0.4)",
                }}
              >
                {hero.primaryButtonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={hero.secondaryButtonLink}
                className="inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  padding: "0.875rem 2rem",
                  borderRadius: "2rem",
                  border: "1px solid rgba(255,255,255,0.5)",
                  color: "#ffffff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {hero.secondaryButtonText}
              </Link>
            </div>
          </div>
        </div>

        {/* Indicadores de slide — solo si hay imágenes */}
        {!HERO_VIDEO_URL && (
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
            aria-hidden="true"
          >
            {HERO_SLIDES.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === heroCurrent ? 'bg-white w-4 h-1' : 'w-1 h-1'
                }`}
                style={{
                  backgroundColor: i === heroCurrent ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ══ PRODUCTOS DESTACADOS ══════════════════════════════════════════ */}
      <section
        className="bg-white px-4 sm:px-6 lg:px-8 relative"
        style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        <img
          src="/flores-sin-fondo-home3.webp"
          alt=""
          className="absolute -top-32 -right-6 md:-top-40 w-48 md:w-72 pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto">
          {/* Header de sección — minimalista */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase block mb-2"
                style={{ color: "var(--color-accent)" }}
              >
                Colección
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: "var(--color-text-primary)",
                }}
              >
                {featuredTitle}
              </h2>
            </div>
            <Link
              href="/productos"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors shrink-0"
              style={{ color: "var(--color-primary)" }}
            >
              Ver todo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      <ThinLine />

      {/* ══ PRESENCIAS — FERIAS Y EVENTOS ════════════════════════════════ */}
      <section
        className="relative px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "6rem",
          paddingBottom: "6rem",
        }}
      >
        <img
          src="/flores-sin-fondo-home.webp"
          alt=""
          className="absolute top-0 left-0 w-40 sm:w-56 md:w-72 pointer-events-none"
          style={{ opacity: 0.12 }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase block mb-2"
              style={{ color: "var(--color-accent)" }}
            >
              Nos encontrás
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
              }}
            >
              Presencias y ferias
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {FERIAS.map((feria) => (
              <article
                key={feria.id}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-card)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(203,110,228,0.1)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Imagen */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={feria.image}
                    alt={feria.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Contenido */}
                <div className="p-5">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                      }}
                    >
                      <Calendar className="w-3 h-3" />
                      {feria.date}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--color-accent-light)",
                        color: "var(--color-accent-hover)",
                      }}
                    >
                      <MapPin className="w-3 h-3" />
                      {feria.location}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {feria.name}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {feria.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ThinLine />

      {/* ══ SECCIÓN PRESUPUESTO EVENTO ═══════════════════════════════════ */}
      <section
        className="bg-white px-4 sm:px-6 lg:px-8 overflow-hidden pt-20 sm:pt-0 md:pt-20"
        style={{ paddingBottom: "6rem" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Imagen de eventos con fade hacia el texto */}
            <div className="relative aspect-[4/3] rounded-t-2xl rounded-b-none md:rounded-b-2xl md:rounded-r-none overflow-hidden">
              <img
                src="/image-eventos.webp"
                alt="Decoración floral para eventos"
                className="w-full h-full object-cover"
              />
              {/* Desktop: difuminado a la derecha (hacia el texto) */}
              <div
                className="absolute inset-0 hidden md:block"
                style={{
                  background:
                    "linear-gradient(to right, transparent 40%, white 100%)",
                }}
                aria-hidden="true"
              />
              {/* Mobile: difuminado abajo (hacia el texto) */}
              <div
                className="absolute inset-0 md:hidden"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 40%, white 100%)",
                }}
                aria-hidden="true"
              />
            </div>

            {/* Texto */}
            <div>
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase block mb-4"
                style={{ color: "var(--color-accent)" }}
              >
                Eventos especiales
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: "var(--color-text-primary)",
                  marginBottom: "1.25rem",
                }}
              >
                ¿Tenés un evento?{" "}
                <em
                  style={{ color: "var(--color-primary)", fontStyle: "italic" }}
                >
                  Pedinos presupuesto
                </em>
              </h2>
              <p
                className="leading-relaxed mb-8"
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.95rem",
                  maxWidth: "28rem",
                }}
              >
                Decoramos casamientos, baby showers, cumpleaños y todo tipo de
                eventos con nuestras flores de tela artesanales. Cada arreglo es
                único y personalizado.
              </p>

              {/* Lista de servicios */}
              <ul className="space-y-3 mb-8">
                {[
                  "Centros de mesa",
                  "Ramos nupciales",
                  "Coronas y tocados",
                  "Decoración de mesas y arcos",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--color-lila)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  padding: "0.875rem 2rem",
                  borderRadius: "2rem",
                  backgroundColor: "var(--color-primary)",
                  color: "#ffffff",
                  boxShadow: "0 4px 20px rgba(203,110,228,0.3)",
                }}
              >
                Consultar presupuesto
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ThinLine />

      {/* ══ CTA FINAL — CATÁLOGO ═════════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "6rem",
          paddingBottom: "6rem",
        }}
        className="px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Flor decorativa sin fondo */}
        <img
          src="/flores-sin-fondo-home2.webp"
          alt=""
          className="absolute -bottom-8 -left-4 w-44 md:w-56 pointer-events-none hidden lg:block"
          style={{ opacity: 0.22, transform: "rotate(-8deg)" }}
          aria-hidden="true"
        />

        {/* Pétalos decorativos de fondo */}
        <PetalDeco
          className="absolute -left-8 top-8 w-32 h-44 pointer-events-none hidden lg:block"
          style={{ color: "var(--color-lila)", opacity: 0.18 }}
        />
        <PetalDeco
          className="absolute -right-6 bottom-8 w-24 h-32 pointer-events-none hidden lg:block"
          style={{
            color: "var(--color-accent)",
            opacity: 0.15,
            transform: "rotate(30deg)",
          }}
        />
        <PetalDeco
          className="absolute right-32 top-4 w-16 h-20 pointer-events-none hidden xl:block"
          style={{
            color: "var(--color-lila)",
            opacity: 0.1,
            transform: "rotate(-15deg)",
          }}
        />

        <div className="max-w-2xl mx-auto text-center relative">
          {/* Línea decorativa centrada */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="h-px w-12"
              style={{ backgroundColor: "var(--color-lila)" }}
            />
            <PetalDeco
              className="w-4 h-5"
              style={{ color: "var(--color-primary)", opacity: 0.7 }}
            />
            <div
              className="h-px w-12"
              style={{ backgroundColor: "var(--color-lila)" }}
            />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "var(--color-text-primary)",
              marginBottom: "1rem",
            }}
          >
            {cta.title}
          </h2>
          <p
            className="mb-8"
            style={{
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            {cta.subtitle}
          </p>

          <Link
            href={cta.buttonLink}
            className="inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{
              padding: "1rem 2.5rem",
              borderRadius: "2rem",
              border: "1.5px solid var(--color-primary)",
              color: "var(--color-primary)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-primary)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(203,110,228,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-primary)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {cta.buttonText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
