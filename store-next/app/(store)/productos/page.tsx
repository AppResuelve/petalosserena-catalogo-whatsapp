// @ts-nocheck
'use client'
// @ts-nocheck
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, MessageCircle } from "lucide-react";
import { content } from "@/data/siteData";
import { useStore } from "@/context/StoreContext";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SearchBar } from "@/components/store/SearchBar";
import { CategoryFilter } from "@/components/store/CategoryFilter";

/* ── Pétalo decorativo — firma visual ── */
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

/* ── Skeleton ── */
function ProductSkeleton() {
  return (
    <div
      className="overflow-hidden animate-pulse"
      style={{
        borderRadius: "1rem",
        border: "1px solid var(--color-border)",
        backgroundColor: "white",
      }}
    >
      <div
        className="aspect-square"
        style={{ backgroundColor: "var(--color-border)" }}
      />
      <div className="p-4 space-y-2">
        <div
          className="h-3 rounded-full w-3/4"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <div
          className="h-3 rounded-full w-1/2"
          style={{ backgroundColor: "var(--color-border)" }}
        />
        <div
          className="h-4 rounded-full w-1/3 mt-3"
          style={{ backgroundColor: "var(--color-border)" }}
        />
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Estado vacío ── */
function EmptyState({
  searchQuery,
  whatsappNumber,
  onClear,
  noResults,
  clearFilters,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Doble pétalo como ilustración */}
      <div className="relative w-20 h-28 mx-auto mb-6">
        <PetalDeco
          className="absolute inset-0 w-full h-full"
          style={{ color: "var(--color-primary-light)", opacity: 1 }}
        />
        <PetalDeco
          className="absolute inset-0 w-full h-full"
          style={{
            color: "var(--color-lila)",
            opacity: 0.4,
            transform: "rotate(20deg) scale(0.7)",
          }}
        />
      </div>

      <p
        className="text-sm mb-2"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {noResults}
      </p>

      {searchQuery ? (
        <>
          <p
            className="text-xs mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            No encontramos resultados para{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              "{searchQuery}"
            </span>
          </p>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`🔍 ¡Hola! Me gustaría saber si tienen disponible: ${searchQuery}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "2rem",
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
              boxShadow: "0 4px 16px rgba(203,110,228,0.3)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            <MessageCircle className="w-4 h-4" />
            Preguntar por WhatsApp
          </a>
        </>
      ) : (
        <button
          onClick={onClear}
          className="text-sm font-medium hover:underline underline-offset-2 transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          {clearFilters}
        </button>
      )}
    </div>
  );
}

/* ── Paginación ── */
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 text-sm font-medium transition-colors disabled:opacity-30"
        style={{
          borderRadius: "2rem",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
          e.currentTarget.style.color = "var(--color-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.color = "var(--color-text-secondary)";
        }}
      >
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="w-9 h-9 text-sm font-medium transition-all duration-200"
            style={{
              borderRadius: "50%",
              backgroundColor:
                p === page ? "var(--color-primary)" : "transparent",
              color: p === page ? "#ffffff" : "var(--color-text-secondary)",
              boxShadow:
                p === page ? "0 4px 12px rgba(203,110,228,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (p !== page)
                e.currentTarget.style.backgroundColor =
                  "var(--color-primary-light)";
            }}
            onMouseLeave={(e) => {
              if (p !== page)
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 text-sm font-medium transition-colors disabled:opacity-30"
        style={{
          borderRadius: "2rem",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
          e.currentTarget.style.color = "var(--color-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.color = "var(--color-text-secondary)";
        }}
      >
        Siguiente
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PRODUCTS PAGE — Pétalos Serena
══════════════════════════════════════════════════════════════════════ */
export default function Products() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setSearchParam = (params: Record<string, string>) => {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v) })
    router.replace(sp.toString() ? `?${sp.toString()}` : window.location.pathname, { scroll: false })
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [page, setPage] = useState(1);
  const { store, categories } = useStore();

  const { title, subtitle, noResults, clearFilters } = content.products;

  const categoryId =
    selectedCategory !== "Todos" ? selectedCategory : undefined;
  const { products, total, totalPages, loading } = useProducts({
    search: searchQuery || undefined,
    categoryId,
    page,
    limit: 20,
  });

  useEffect(() => {
    const cat = searchParams?.get("cat") || "";
    if (cat) {
      const found = categories.find((c) => c.slug === cat || c.name === cat);
      if (found) setSelectedCategory(String(found.id));
    }
  }, [searchParams, categories]);

  const hasActiveFilters = searchQuery || selectedCategory !== "Todos";

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    if (category === "Todos") {
      setSearchParam({});
    } else {
      const cat = categories.find((c) => String(c.id) === category);
      setSearchParam({ cat: cat ? cat.name : category });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todos");
    setSearchParams({});
    setPage(1);
  };

  const whatsappNumber = store?.whatsapp_number || "";
  const categoryLabels = ["Todos", ...categories.map((c) => c.name)];

  return (
    <>
      {/* ══ HERO — crema, sin divider ══ */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "var(--color-background)",
          paddingTop: "5rem",
          paddingBottom: "4rem",
        }}
      >
        {/* Pétalos decorativos */}
        <PetalDeco
          className="absolute top-6 right-[6%] w-28 h-36 hidden lg:block pointer-events-none"
          style={{ color: "var(--color-lila)", opacity: 0.15 }}
        />
        <PetalDeco
          className="absolute bottom-4 left-[3%] w-16 h-20 hidden lg:block pointer-events-none"
          style={{
            color: "var(--color-accent)",
            opacity: 0.15,
            transform: "rotate(15deg)",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-px w-8"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <span
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Catálogo
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              color: "var(--color-text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: "32rem",
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Línea decorativa */}
          <div className="flex items-center gap-3 mt-5">
            <div
              className="h-px w-10"
              style={{ backgroundColor: "var(--color-border-hover)" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-lila)", opacity: 0.7 }}
            />
            <div
              className="h-px w-24"
              style={{ backgroundColor: "var(--color-border-hover)" }}
            />
          </div>
        </div>
      </section>

      {/* ══ CONTENIDO ══ */}
      <section className="bg-white pb-20 px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <CategoryFilter
              categories={categoryLabels}
              selectedCategory={
                selectedCategory === "Todos"
                  ? "Todos"
                  : categories.find((c) => String(c.id) === selectedCategory)
                      ?.name || "Todos"
              }
              onSelectCategory={handleCategoryChange}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />

            <div className="flex-1">
              {/* Search + filtros mobile */}
              <div className="max-md:sticky max-md:top-[calc(4rem+12px)] max-md:z-30 mb-6">
                <div className="flex flex-row gap-3 items-center">
                  <div className="flex-1">
                    <SearchBar
                      value={searchQuery}
                      onChange={(v) => {
                        setSearchQuery(v);
                        setPage(1);
                      }}
                      placeholder="Buscar productos..."
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden shrink-0 h-11 flex items-center gap-2 px-3 font-medium text-sm transition-all duration-200"
                    style={{
                      borderRadius: "2rem",
                      border: "1px solid var(--color-primary)",
                      color: "var(--color-primary)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-primary-light)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {!isSearchFocused && !searchQuery && <span>Filtros</span>}
                  </button>
                </div>
              </div>

              {/* Contador + limpiar */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between mb-5">
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {total}
                    </span>{" "}
                    producto{total !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                    style={{ color: "var(--color-primary)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-primary-light)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {clearFilters}
                  </button>
                </div>
              )}

              {/* Contenido */}
              {loading ? (
                <LoadingGrid />
              ) : products.length > 0 ? (
                <>
                  <ProductGrid products={products} />
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <EmptyState
                  searchQuery={searchQuery}
                  whatsappNumber={whatsappNumber}
                  onClear={handleClearFilters}
                  noResults={noResults}
                  clearFilters={clearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
