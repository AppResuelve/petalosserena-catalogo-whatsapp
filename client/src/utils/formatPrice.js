export function formatPrice(value) {
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatted = formatter.format(value || 0);
  const currencySymbol = "$";

  return `${currencySymbol} ${formatted}`;
}
