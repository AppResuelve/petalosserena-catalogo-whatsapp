import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Tag } from "lucide-react";
import { content, siteData } from "../../data/siteData";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../context/CartContext";
import { CartItem } from "../CartItem";
import { CheckoutModal, DeliveryFormModal } from "../CheckoutModal";
import { ordersService } from "../../services/storeService";
import { PawIcon } from "../components/ui/PawIcon";

/* ── Helpers visuales ─────────────────────────────────────────────────── */

function BottomWave({ toColor }) {
  return (
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ height: 64, display: "block", width: "100%" }}
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,72 L0,72 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}

function WhatsAppIcon({ className = "" }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/* ── Estado loading ────────────────────────────────────────────────────── */
function CartLoading() {
  return (
    <section className="bg-white min-h-[60vh] flex items-center justify-center px-4 py-24">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center animate-pulse">
            <ShoppingCart className="w-9 h-9 text-[var(--color-primary)]" />
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Cargando catálogo...
        </p>
      </div>
    </section>
  );
}

/* ── Estado vacío ─────────────────────────────────────────────────────── */
function CartEmpty({ emptyTitle, emptyMessage, browseProducts }) {
  return (
    <>
      {/* Hero mínimo en amarillo */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#fefce8",
          paddingTop: "3.5rem",
          paddingBottom: "5rem",
        }}
      >
        <PawIcon
          size={128}
          className="absolute top-4 right-[8%] text-[var(--color-primary)] hidden md:block"
          style={{ opacity: 0.06 }}
        />
        <div className="relative max-w-7xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-3">
            Carrito
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)] mb-2">
            {emptyTitle}
          </h1>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-1 w-12 rounded-full bg-[var(--color-secondary)]" />
            <div className="h-1 w-4 rounded-full bg-[var(--color-primary)]" />
          </div>
        </div>
        <BottomWave toColor="#ffffff" />
      </section>

      {/* Cuerpo vacío */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center">
          {/* Ilustración */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="w-28 h-28 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center">
              <ShoppingCart
                className="w-12 h-12 text-[var(--color-primary)]"
                style={{ opacity: 0.5 }}
              />
            </div>
            <PawIcon
              size={40}
              className="absolute -bottom-2 -right-2 text-[var(--color-secondary)]"
              style={{ opacity: 0.7 }}
            />
          </div>

          <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            {emptyMessage}
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center justify-center gap-2
              px-8 py-3.5 rounded-xl
              bg-[var(--color-primary)] text-white font-semibold text-sm
              hover:bg-[var(--color-primary-hover)]
              hover:-translate-y-0.5
              hover:shadow-[0_6px_20px_rgba(199,4,4,0.35)]
              transition-all duration-200"
          >
            {browseProducts}
          </Link>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CART PAGE
══════════════════════════════════════════════════════════════════════ */
export default function Cart() {
  const { items, totalItems, totalPrice } = useCart();
  const {
    title,
    emptyTitle,
    emptyMessage,
    browseProducts,
    itemCount,
    subtotal,
    total,
    requestQuote,
  } = content.cart;
  const { store, loading } = useStore();
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  /* ── Lógica de negocio — sin cambios ── */
  const generateWhatsAppMessage = (deliveryData = null) => {
    const itemsList = items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.name} — ${formatPrice(item.unitPrice)} c/u`,
      )
      .join("\n");
    let deliverySection = "";
    if (deliveryData) {
      deliverySection = `\n\n📦 *Datos de envío:*\n👤 Nombre: ${deliveryData.name}\n📍 Dirección: ${deliveryData.address}`;
    }
    const message = `👋🏼 Hola, quiero hacer este pedido:\n\n📋 *Productos:*\n${itemsList}\n\n💰 *${total}:* $${totalPrice.toLocaleString("es-AR")}${deliverySection}`;
    return encodeURIComponent(message);
  };

  const openWhatsApp = (message) => {
    const whatsappLink = `https://wa.me/${(store?.whatsapp_number || "").replace(/\D/g, "")}?text=${message}`;
    window.open(whatsappLink, "_blank");
  };

  const trackOrder = (deliveryData = null) => {
    const order = {
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.unitPrice,
        qty: i.quantity,
      })),
      total: totalPrice,
      customerName: deliveryData?.name || null,
      customerPhone: deliveryData?.phone || null,
      customerEmail: deliveryData?.email || null,
      customerAddress: deliveryData?.address || null,
    };
    ordersService.create(order).catch(() => {});
  };

  const handlePickup = () => {
    const message = generateWhatsAppMessage();
    openWhatsApp(message);
    trackOrder();
    setShowDeliveryModal(false);
  };

  const handleDeliveryFormSubmit = (name, address) => {
    const message = generateWhatsAppMessage({ name, address });
    openWhatsApp(message);
    trackOrder({ name, address });
    setShowDeliveryForm(false);
    setShowDeliveryModal(false);
  };

  const handleRequestQuote = () => {
    if (siteData.cart.showDeliveryModal) {
      setShowDeliveryModal(true);
    } else {
      const message = generateWhatsAppMessage();
      openWhatsApp(message);
      trackOrder();
    }
  };

  /* ── Guards ── */
  if (loading) return <CartLoading />;
  if (items.length === 0)
    return (
      <CartEmpty
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        browseProducts={browseProducts}
      />
    );

  /* ── Carrito con items ── */
  return (
    <>
      {/* ══ HERO — amarillo suave con onda roja ══ */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#fefce8",
          paddingTop: "3rem",
          paddingBottom: "5rem",
        }}
      >
        <PawIcon
          size={128}
          className="absolute top-3 right-[7%] text-[var(--color-primary)] hidden md:block"
          style={{ opacity: 0.06 }}
        />
        <PawIcon
          size={80}
          className="absolute -bottom-2 left-[3%] text-[var(--color-secondary)] hidden md:block"
          style={{ opacity: 0.3, transform: "rotate(-12deg)" }}
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            to="/productos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold
              text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
              transition-colors mb-5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Volver a productos
          </Link>

          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[var(--color-primary)] mb-2">
                Carrito
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
                {title}
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1 w-12 rounded-full bg-[var(--color-secondary)]" />
                <div className="h-1 w-4 rounded-full bg-[var(--color-primary)]" />
              </div>
            </div>
            {/* Badge de cantidad */}
            <div
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full
              bg-white border border-[var(--color-border)] shadow-sm mb-1"
            >
              <ShoppingCart className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {itemCount.replace("{count}", totalItems)}
              </span>
            </div>
          </div>
        </div>

        <BottomWave toColor="#ffffff" />
      </section>

      {/* ══ CONTENIDO PRINCIPAL ══ */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Lista de items ── */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* ── Resumen del pedido — sticky ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                {/* Header del resumen */}
                <div className="px-6 py-4 bg-[#fefce8] border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-primary)]">
                      Resumen
                    </span>
                  </div>
                </div>

                <div className="px-6 py-5">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {subtotal}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      ${totalPrice.toLocaleString("es-AR")}
                    </span>
                  </div>

                  {/* Separador */}
                  <div className="border-t border-[var(--color-border)] my-4" />

                  {/* Total destacado */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-[var(--color-text-primary)]">
                      {total}
                    </span>
                    <span className="text-2xl font-black text-[var(--color-primary)]">
                      ${totalPrice.toLocaleString("es-AR")}
                    </span>
                  </div>

                  {/* Botón principal — amarillo (acción de compra = acción especial) */}
                  <button
                    onClick={handleRequestQuote}
                    className="flex items-center justify-center gap-2 w-full
                      px-6 py-3.5 rounded-xl font-bold text-sm
                      bg-[var(--color-secondary)] text-[var(--color-text-primary)]
                      hover:bg-[var(--color-secondary-muted)]
                      hover:-translate-y-0.5
                      hover:shadow-[0_6px_20px_rgba(239,242,58,0.4)]
                      active:translate-y-0 active:shadow-none
                      transition-all duration-200"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    {requestQuote}
                  </button>

                  {/* Link secundario */}
                  <div className="mt-4 text-center">
                    <Link
                      to="/productos"
                      className="text-xs font-semibold text-[var(--color-text-muted)]
                        hover:text-[var(--color-primary)] transition-colors underline-offset-2
                        hover:underline"
                    >
                      {content.cart.continueShopping}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modales — sin cambios ── */}
      <CheckoutModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        onConfirmDelivery={() => {
          setShowDeliveryModal(false);
          setShowDeliveryForm(true);
        }}
        onConfirmPickup={handlePickup}
      />
      <DeliveryFormModal
        isOpen={showDeliveryForm}
        onClose={() => setShowDeliveryForm(false)}
        onBack={() => {
          setShowDeliveryForm(false);
          setShowDeliveryModal(true);
        }}
        onConfirm={handleDeliveryFormSubmit}
      />
    </>
  );
}
