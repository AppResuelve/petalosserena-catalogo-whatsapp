import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { siteData } from "../../../data/siteData";
import { useCart } from "../../context/CartContext";
import { useStore } from "../../context/StoreContext";

/*
  Navbar con dos estados:
  - transparente (solo en Home, cuando scrollY === 0): texto blanco sobre hero
  - sólido (siempre en otras páginas + al hacer scroll en Home): bg blanco, texto oscuro

  Prop `heroMode`: el Home lo pone en true, las demás páginas en false.
  Se controla desde cada page o desde el layout pasando la prop.
*/

export function Navbar({ heroMode = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { categories } = useStore();
  const [searchParams] = useSearchParams();
  const currentCat = searchParams.get("cat");
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const closeTimer = useRef(null);

  const handleProductsEnter = () => {
    clearTimeout(closeTimer.current);
    setDesktopProductsOpen(true);
  };
  const handleProductsLeave = () => {
    closeTimer.current = setTimeout(() => setDesktopProductsOpen(false), 200);
  };

  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  const isActive = (path) => location.pathname === path;
  const isTransparent = heroMode && !scrolled;

  useEffect(() => {
    if (!heroMode) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [heroMode]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = siteData.navbar.items.filter((i) => i.href !== "/carrito");

  /* Colores según estado */
  const textColor = isTransparent
    ? "rgba(255,255,255,0.92)"
    : "var(--color-text-secondary)";
  const textColorActive = isTransparent ? "#ffffff" : "var(--color-primary)";
  const bgStyle = isTransparent
    ? { backgroundColor: "transparent" }
    : {
        backgroundColor: "#ffffff",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={bgStyle}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              {siteData.company?.logo ? (
                <img
                  src={siteData.company.logo}
                  alt={siteData.business?.name || ""}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <img
                  src="/logotipo.png"
                  alt={siteData.business?.name || "Pétalos Serena"}
                  className="h-12 w-auto object-contain"
                />
              )}
            </Link>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const isProducts = item.href === "/productos";
                const hasCategories = isProducts && categories.length > 0;

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={
                      hasCategories ? handleProductsEnter : undefined
                    }
                    onMouseLeave={
                      hasCategories ? handleProductsLeave : undefined
                    }
                  >
                    <Link
                      to={item.href}
                      className="relative inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-300 group"
                      style={{
                        color: isActive(item.href)
                          ? textColorActive
                          : textColor,
                      }}
                    >
                      {item.label}
                      {hasCategories && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${desktopProductsOpen ? "rotate-180" : ""}`}
                        />
                      )}
                      <span
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 h-px transition-all duration-300"
                        style={{
                          backgroundColor: isTransparent
                            ? "rgba(255,255,255,0.7)"
                            : "var(--color-lila)",
                          width: isActive(item.href) ? "1.5rem" : "0",
                        }}
                      />
                    </Link>
                    {hasCategories && (
                      <div
                        className="absolute top-full left-0 mt-6"
                        style={{
                          opacity: desktopProductsOpen ? 1 : 0,
                          transform: desktopProductsOpen
                            ? "translateY(0)"
                            : "translateY(-6px)",
                          pointerEvents: desktopProductsOpen ? "auto" : "none",
                          transition:
                            "opacity 0.15s ease, transform 0.15s ease",
                        }}
                      >
                        <div
                          className="w-48 py-2 rounded-xl"
                          style={{
                            backgroundColor: "var(--color-card)",
                            border: "1px solid var(--color-border)",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                          }}
                        >
                          <Link
                            to="/productos"
                            className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-primary-light)]"
                            style={{
                              color: !currentCat
                                ? "var(--color-primary)"
                                : "var(--color-text-secondary)",
                            }}
                          >
                            Todo
                          </Link>
                          {categories.map((cat) => {
                            const isCurrentCat =
                              currentCat === cat.slug ||
                              currentCat === cat.name;
                            return (
                              <Link
                                key={cat.id}
                                to={`/productos?cat=${encodeURIComponent(cat.slug || cat.name)}`}
                                className="block px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-primary-light)]"
                                style={{
                                  color: isCurrentCat
                                    ? "var(--color-primary)"
                                    : "var(--color-text-secondary)",
                                }}
                              >
                                {cat.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Carrito + hamburger */}
            <div className="flex items-center gap-2">
              <Link
                to="/carrito"
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  backgroundColor: isTransparent
                    ? "rgba(255,255,255,0.15)"
                    : "var(--color-primary)",
                  color: "#ffffff",
                  backdropFilter: isTransparent ? "blur(8px)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isTransparent)
                    e.currentTarget.style.backgroundColor =
                      "var(--color-primary-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isTransparent)
                    e.currentTarget.style.backgroundColor =
                      "var(--color-primary)";
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:block">Carrito</span>
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "#ffffff",
                    }}
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{
                  color: isTransparent
                    ? "#ffffff"
                    : "var(--color-text-primary)",
                }}
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── SIDEBAR MÓVIL ── */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{
          backgroundColor: "rgba(44,44,44,0.5)",
          backdropFilter: "blur(4px)",
        }}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.1)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header sidebar */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            {siteData.business?.name || "Pétalos Serena"}
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {navLinks.map((item) => {
              const isProducts = item.href === "/productos";
              const hasSubitems = isProducts && categories.length > 0;

              return (
                <li key={item.href}>
                  {hasSubitems ? (
                    <div>
                      <button
                        onClick={() =>
                          setMobileProductsOpen(!mobileProductsOpen)
                        }
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          color: isActive(item.href)
                            ? "var(--color-primary)"
                            : "var(--color-text-secondary)",
                          backgroundColor: isActive(item.href)
                            ? "var(--color-primary-light)"
                            : "transparent",
                        }}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{
                              backgroundColor: isActive(item.href)
                                ? "var(--color-lila)"
                                : "var(--color-border-hover)",
                            }}
                          />
                          {item.label}
                        </span>
                        <ChevronDown
                          className="w-4 h-4 transition-transform"
                          style={{
                            transform: mobileProductsOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </button>
                      {mobileProductsOpen && (
                        <div className="ml-6 mt-1 space-y-0.5">
                          <Link
                            to="/productos"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors"
                            style={{
                              color:
                                !currentCat && isActive(item.href)
                                  ? "var(--color-primary)"
                                  : "var(--color-text-secondary)",
                              backgroundColor:
                                !currentCat && isActive(item.href)
                                  ? "var(--color-primary-light)"
                                  : "transparent",
                            }}
                          >
                            Todo
                          </Link>
                          {categories.map((cat) => {
                            const isCurrentCat =
                              currentCat === cat.slug ||
                              currentCat === cat.name;
                            return (
                              <Link
                                key={cat.id}
                                to={`/productos?cat=${encodeURIComponent(cat.slug || cat.name)}`}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-colors"
                                style={{
                                  color: isCurrentCat
                                    ? "var(--color-primary)"
                                    : "var(--color-text-secondary)",
                                  backgroundColor: isCurrentCat
                                    ? "var(--color-primary-light)"
                                    : "transparent",
                                }}
                              >
                                {cat.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        color: isActive(item.href)
                          ? "var(--color-primary)"
                          : "var(--color-text-secondary)",
                        backgroundColor: isActive(item.href)
                          ? "var(--color-primary-light)"
                          : "transparent",
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{
                          backgroundColor: isActive(item.href)
                            ? "var(--color-lila)"
                            : "var(--color-border-hover)",
                        }}
                      />
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA carrito */}
        <div
          className="px-4 pb-8 pt-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <Link
            to="/carrito"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium text-sm transition-colors relative"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Ver carrito
            {totalItems > 0 && (
              <span
                className="absolute -top-2 right-3 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "#ffffff",
                }}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
