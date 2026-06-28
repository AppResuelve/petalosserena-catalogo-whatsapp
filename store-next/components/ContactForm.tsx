'use client'
import { useState } from "react";
import { Send, AlertCircle, Loader } from "lucide-react";
import { sendContactForm } from "@/services/contactService";
import { useStore } from "@/context/StoreContext";

/* ── Clases compartidas para inputs ── */
const inputClass = `
  w-full px-4 py-3.5 rounded-xl text-sm
  border border-[var(--color-border)]
  bg-[var(--color-background)]
  text-[var(--color-text-primary)]
  placeholder-[var(--color-text-muted)]
  focus:outline-none
  focus:border-[var(--color-primary)]
  focus:ring-2 focus:ring-[var(--color-primary)]/15
  transition-all duration-200
`;

const labelClass = `
  block text-xs font-bold tracking-wide uppercase
  text-[var(--color-text-muted)] mb-1.5
`;

export function ContactForm() {
  const { store } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Por favor ingresá tu nombre";
    if (!formData.email.trim()) return "El email es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "El email no es válido";
    if (!formData.message.trim()) return "Por favor escribí tu mensaje";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      return;
    }
    setStatus("loading");
    setErrorMessage("");
    try {
      await sendContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        website: formData.website,
        receiveEmailsAt: store?.email || "",
        businessName: store?.business_name || "",
      });
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "", website: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error.message || "Ocurrió un error. Por favor intentá de nuevo.",
      );
    }
  };

  /* ── Estado éxito ── */
  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-10 text-center relative overflow-hidden">
        {/* Pata de fondo */}
        <svg
          viewBox="0 0 60 80"
          className="absolute -right-4 -bottom-4 text-[var(--color-lila)]"
          style={{ width: 140, opacity: 0.12 }}
          aria-hidden="true"
        >
          <path
            d="M30 75 C10 60 0 40 5 20 C10 5 20 0 30 0 C40 0 50 5 55 20 C60 40 50 60 30 75Z"
            fill="currentColor"
          />
        </svg>

        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary-light)]/40 flex items-center justify-center">
            <svg
              viewBox="0 0 60 80"
              className="text-[var(--color-primary)]"
              style={{ width: 36, opacity: 0.7 }}
              aria-hidden="true"
            >
              <path
                d="M30 75 C10 60 0 40 5 20 C10 5 20 0 30 0 C40 0 50 5 55 20 C60 40 50 60 30 75Z"
                fill="currentColor"
              />
            </svg>
          </div>
          {/* Check badge */}
          <span
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full
            bg-[var(--color-primary)] flex items-center justify-center"
          >
            <svg
              viewBox="0 0 20 20"
              fill="white"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2 relative">
          ¡Mensaje enviado!
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm mb-8 relative">
          Gracias por contactarnos. Te respondemos a la brevedad.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-[var(--color-primary)] font-semibold
            hover:underline underline-offset-2 relative"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  /* ── Formulario ── */
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Honeypot anti-spam */}
        <div
          style={{ position: "absolute", left: "-9999px" }}
          aria-hidden="true"
        >
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        {/* Nombre + Email en fila en desktop */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="juan@email.com"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className={labelClass}>
            Teléfono{" "}
            <span className="normal-case font-normal text-[var(--color-text-muted)]">
              (opcional)
            </span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="+54 9 XXX XXX XXXX"
          />
        </div>

        {/* Mensaje */}
        <div>
          <label htmlFor="message" className={labelClass}>
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className={`${inputClass} resize-none`}
            placeholder="Contanos en qué podemos ayudarte..."
          />
        </div>

        {/* Error */}
        {status === "error" && (
          <div
            className="flex items-center gap-3 p-4 rounded-xl
            bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/20
            text-[var(--color-primary)]"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2
            px-7 py-3.5
            bg-[var(--color-primary)] text-white font-semibold text-sm
            hover:bg-[var(--color-primary-hover)]
            hover:-translate-y-0.5
            active:translate-y-0 active:shadow-none
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:translate-y-0 disabled:hover:shadow-none"
          style={{
            borderRadius: "2rem",
            boxShadow: "0 4px 14px rgba(203,110,228,0.35)",
          }}
        >
          {status === "loading" ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar mensaje
            </>
          )}
        </button>
      </form>
    </div>
  );
}
