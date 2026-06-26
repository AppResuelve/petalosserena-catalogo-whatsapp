function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function shadeColor(color, percent) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const r = Math.round(rgb.r * (1 + percent / 100));
  const g = Math.round(rgb.g * (1 + percent / 100));
  const b = Math.round(rgb.b * (1 + percent / 100));

  return rgbToHex(
    Math.min(255, Math.max(0, r)),
    Math.min(255, Math.max(0, g)),
    Math.min(255, Math.max(0, b)),
  );
}

export function generatePalette({ primaryColor, secondaryColor }) {
  return {
    primary: primaryColor,
    primaryHover: shadeColor(primaryColor, -10),
    secondary: secondaryColor,
    secondaryMuted: shadeColor(secondaryColor, -15),

    background: "#ffffff",
    surface: "#f8f9fa",
    card: "#ffffff",
    elevated: "#ffffff",

    textPrimary: "#1a1a1a",
    textSecondary: "#4a4a4a",
    textMuted: "#6a6a6a",

    border: "#e5e5e5",
    borderHover: "#d0d0d0",
  };
}

export function applyPalette(palette) {
  const root = document.documentElement;

  root.style.setProperty("--color-primary", palette.primary);
  root.style.setProperty("--color-primary-hover", palette.primaryHover);
  root.style.setProperty("--color-secondary", palette.secondary);
  root.style.setProperty("--color-secondary-muted", palette.secondaryMuted);

  root.style.setProperty("--color-background", palette.background);
  root.style.setProperty("--color-surface", palette.surface);
  root.style.setProperty("--color-card", palette.card);
  root.style.setProperty("--color-elevated", palette.elevated);

  root.style.setProperty("--color-text-primary", palette.textPrimary);
  root.style.setProperty("--color-text-secondary", palette.textSecondary);
  root.style.setProperty("--color-text-muted", palette.textMuted);

  root.style.setProperty("--color-border", palette.border);
  root.style.setProperty("--color-border-hover", palette.borderHover);
}
