import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Tag, Check } from "lucide-react";
import { content } from "../../data/siteData";
import { useProduct, useRelatedProducts } from "../../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { ProductGallery } from "../ProductGallery";
import { Badge } from "../components/ui/Badge";
import { formatPrice } from "../../utils/formatPrice";
import { ProductGrid } from "../ProductGrid";
import { SectionHeader } from "../components/ui/SectionHeader";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, getItemQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const { product, loading } = useProduct(slug);
  const categoryId = product?.categoryId;
  const { products: relatedProducts } = useRelatedProducts(
    categoryId,
    product?.id,
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-32 text-center">
        <div
          className="w-8 h-8 rounded-full mx-auto mb-4 animate-pulse"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        />
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Cargando...
        </p>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
              fontWeight: 400,
              color: "var(--color-text-primary)",
              marginBottom: "1rem",
            }}
          >
            Producto no encontrado
          </h1>
          <Link
            to="/productos"
            className="text-sm font-medium hover:underline underline-offset-2 transition-colors"
            style={{ color: "var(--color-primary)" }}
          >
            Volver a productos
          </Link>
        </div>
      </section>
    );
  }

  const related = relatedProducts
    .filter((p) => String(p.id) !== String(product?.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleAddWholesale = () => {
    addItem(product.id, product.unitsToWholesalePrice);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const quantity = getItemQuantity(product.id);
  const hasDiscount = product.discountPercentage;
  const hasWholesale = product.wholesalePrice && product.unitsToWholesalePrice;

  return (
    <section
      className="pb-24 px-4 sm:px-6 lg:px-8"
      style={{ paddingTop: "5rem" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Back link ── */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium mb-10 group transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-muted)")
          }
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          {content.productDetail.backTo}
        </button>

        {/* ── Grid principal ── */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Galería */}
          <ProductGallery
            images={product.images}
            productName={product.name}
            discountPercentage={hasDiscount ? product.discountPercentage : null}
          />

          {/* Info */}
          <div>
            {/* Categoría */}
            <div className="mb-5">
              <span
                className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                }}
              >
                {product.category}
              </span>
            </div>

            {/* Nombre */}
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "var(--color-text-primary)",
                marginBottom: "1rem",
              }}
            >
              {product.name}
            </h1>

            {/* Descripción corta */}
            <p
              className="mb-6 leading-relaxed"
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.95rem",
              }}
            >
              {product.shortDescription}
            </p>

            {/* Línea decorativa */}
            <div className="flex items-center gap-3 mb-6" aria-hidden="true">
              <div
                className="h-px w-8"
                style={{ backgroundColor: "var(--color-lila)", opacity: 0.6 }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-accent)", opacity: 0.6 }}
              />
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "var(--color-border)" }}
              />
            </div>

            {/* Precio minorista */}
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                  }}
                >
                  {formatPrice(product.retailPrice)}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  x 1 u.
                </span>
              </div>
              {hasDiscount && (
                <span
                  className="text-base line-through"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Precio mayorista */}
            {hasWholesale && (
              <div
                className="mt-4 mb-6 p-4 rounded-xl"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  border: "1px solid var(--color-lila)",
                }}
              >
                <p
                  className="text-xs font-medium mb-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  Precio mayorista · a partir de {product.unitsToWholesalePrice}{" "}
                  unidades
                </p>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                    }}
                  >
                    {formatPrice(product.wholesalePrice)}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    x 1 u.
                  </span>
                </div>
                {product.wholesaleComparePrice && (
                  <span
                    className="text-sm line-through"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {formatPrice(product.wholesaleComparePrice)}
                  </span>
                )}
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mb-6">
                <p
                  className="text-xs font-medium flex items-center gap-1.5 mb-3"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <Tag className="w-3.5 h-3.5" />
                  {content.productDetail.tagsLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción larga */}
            <p
              className="leading-relaxed mb-8"
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.8,
              }}
            >
              {product.description}
            </p>

            {/* Botón principal — pill violeta */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full px-8 py-3.5 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{
                borderRadius: "2rem",
                backgroundColor: justAdded
                  ? "var(--color-accent)"
                  : "var(--color-primary)",
                color: "#ffffff",
                boxShadow: justAdded
                  ? "0 4px 16px rgba(164,176,144,0.3)"
                  : "0 4px 20px rgba(203,110,228,0.3)",
              }}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  {content.productDetail.addedToCart}
                </>
              ) : (
                <>
                  {content.productDetail.addToCart}
                  {quantity > 0 && ` (${quantity} en carrito)`}
                </>
              )}
            </button>

            {/* Botón mayorista — outline pill */}
            {hasWholesale && (
              <button
                onClick={handleAddWholesale}
                className="flex items-center justify-center gap-2 w-full px-8 py-3.5 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 mt-3"
                style={{
                  borderRadius: "2rem",
                  border: "1px solid var(--color-primary)",
                  color: "var(--color-primary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-primary)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
              >
                Agregar por {product.unitsToWholesalePrice} u. (mayorista)
              </button>
            )}
          </div>
        </div>

        {/* ── Productos relacionados ── */}
        {related.length > 0 && (
          <>
            {/* Header de sección minimalista */}
            <div className="mb-8">
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase block mb-1"
                style={{ color: "var(--color-accent)" }}
              >
                También te puede gustar
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.75rem",
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                }}
              >
                {content.productDetail.relatedTitle}
              </h2>
            </div>
            <ProductGrid products={related} />
          </>
        )}
      </div>
    </section>
  );
}
