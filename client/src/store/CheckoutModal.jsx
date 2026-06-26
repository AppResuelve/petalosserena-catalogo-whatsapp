import { useState, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";
import { PawIcon } from "./components/ui/PawIcon";

/* ── Clases de input compartidas ── */
const inputClass = `
  w-full px-4 py-3 rounded-xl text-sm
  border border-[var(--color-border)]
  bg-[var(--color-background)]
  text-[var(--color-text-primary)]
  placeholder-[var(--color-text-muted)]
  focus:outline-none
  focus:border-[var(--color-primary)]
  focus:ring-2 focus:ring-[var(--color-primary)]/15
  transition-all duration-200
`;

/* ── Opción de entrega (botón card) ─────────────────────────────────── */
function DeliveryOption({ icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-xl text-left
        border-2 border-[var(--color-border)]
        hover:border-[var(--color-primary)]/50
        hover:bg-[var(--color-primary)]/4
        hover:shadow-[0_4px_16px_rgba(199,4,4,0.08)]
        hover:-translate-y-0.5
        active:translate-y-0
        transition-all duration-200 group"
    >
      <div className="flex items-center gap-4">
        {/* Ícono en círculo amarillo */}
        <div
          className="w-11 h-11 rounded-xl bg-[var(--color-secondary)]
          flex items-center justify-center shrink-0
          group-hover:scale-105 transition-transform duration-200"
        >
          {icon}
        </div>
        <div>
          <p className="font-semibold text-sm text-[var(--color-text-primary)]">
            {title}
          </p>
          {description && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {description}
            </p>
          )}
        </div>
        {/* Flecha sutil */}
        <div className="ml-auto text-[var(--color-border)] group-hover:text-[var(--color-primary)] transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CheckoutModal — ¿Retiro o envío?
══════════════════════════════════════════════════════════════════════ */
export function CheckoutModal({
  isOpen,
  onClose,
  onConfirmDelivery,
  onConfirmPickup,
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl
        shadow-[0_-8px_40px_rgba(0,0,0,0.15)] sm:shadow-2xl overflow-hidden"
      >
        {/* Header con banda amarilla */}
        <div className="bg-[#fefce8] px-6 pt-6 pb-5 border-b border-[var(--color-border)] relative">
          {/* Handle mobile */}
          <div className="w-10 h-1 rounded-full bg-[var(--color-border)] mx-auto mb-4 sm:hidden" />

          {/* Pata decorativa de fondo */}
          <PawIcon
            size={56}
            className="absolute right-4 top-2 text-[var(--color-secondary)]"
            style={{ opacity: 0.3 }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg
              text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]
              hover:bg-white/60 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          <span
            className="inline-block text-xs font-bold tracking-widest uppercase
            text-[var(--color-primary)] mb-1"
          >
            Finalizar pedido
          </span>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] pr-8">
            ¿Cómo recibís tu pedido?
          </h2>
        </div>

        {/* Opciones */}
        <div className="px-6 py-5 space-y-3">
          <DeliveryOption
            onClick={onConfirmPickup}
            title="Retiro en local"
            description="Coordinamos día y horario por WhatsApp"
            icon={
              <svg
                className="w-5 h-5 text-[var(--color-text-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
          />
          <DeliveryOption
            onClick={onConfirmDelivery}
            title="Envío a domicilio"
            description="Te pedimos la dirección en el siguiente paso"
            icon={
              <svg
                className="w-5 h-5 text-[var(--color-text-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            }
          />

          <button
            onClick={onClose}
            className="w-full pt-2 pb-1 text-xs text-[var(--color-text-muted)]
              hover:text-[var(--color-text-primary)] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   DeliveryFormModal — Datos de envío
══════════════════════════════════════════════════════════════════════ */
export function DeliveryFormModal({ isOpen, onClose, onConfirm, onBack }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(name, address);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl
        shadow-[0_-8px_40px_rgba(0,0,0,0.15)] sm:shadow-2xl overflow-hidden"
      >
        {/* Header con banda amarilla */}
        <div className="bg-[#fefce8] px-6 pt-6 pb-5 border-b border-[var(--color-border)] relative">
          {/* Handle mobile */}
          <div className="w-10 h-1 rounded-full bg-[var(--color-border)] mx-auto mb-4 sm:hidden" />

          {/* Pata decorativa */}
          <PawIcon
            size={56}
            className="absolute right-4 top-2 text-[var(--color-secondary)]"
            style={{ opacity: 0.3 }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg
              text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]
              hover:bg-white/60 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          <span
            className="inline-block text-xs font-bold tracking-widest uppercase
            text-[var(--color-primary)] mb-1"
          >
            Datos de envío
          </span>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] pr-8">
            ¿A dónde te lo enviamos?
          </h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label
              className="block text-xs font-bold tracking-wide uppercase
              text-[var(--color-text-muted)] mb-1.5"
            >
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              className="block text-xs font-bold tracking-wide uppercase
              text-[var(--color-text-muted)] mb-1.5"
            >
              Dirección de envío
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle Falsa 123, Buenos Aires"
              required
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center gap-1.5
                flex-1 py-3 rounded-xl text-sm font-semibold
                border-2 border-[var(--color-border)]
                text-[var(--color-text-secondary)]
                hover:border-[var(--color-primary)]/40
                hover:text-[var(--color-primary)]
                hover:-translate-y-0.5
                transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold
                bg-[var(--color-primary)] text-white
                hover:bg-[var(--color-primary-hover)]
                hover:-translate-y-0.5
                hover:shadow-[0_6px_20px_rgba(199,4,4,0.35)]
                active:translate-y-0 active:shadow-none
                transition-all duration-200"
            >
              Confirmar pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
