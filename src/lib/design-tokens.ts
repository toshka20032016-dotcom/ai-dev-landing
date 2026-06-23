export const tokens = {
  colors: {
    background: "#030408",
    surface: "#030712",
    accent: "#DFFF00",
    accentAlt: "#00D4FF",
    foreground: "#FAFAFA",
    muted: "#A1A1AA",
    border: "rgba(255,255,255,0.1)",
  },
  radius: {
    card: "1rem",
    button: "9999px",
  },
} as const;

/** Dala-inspired preview palette — void black + plum voltage authority */
export const previewTokens = {
  colors: {
    void: "#000000",
    bone: "#ffffff",
    ash: "#bdbdbd",
    smoke: "#9a9a9a",
    plum: "#8052ff",
    amber: "#ffb829",
    lichen: "#15846e",
    border: "rgba(255,255,255,0.1)",
  },
  radius: {
    nav: "24px",
    card: "24px",
    button: "24px",
  },
  layout: {
    maxWidth: "1200px",
    sectionGap: "60px",
    cardPadding: "24px",
  },
} as const;
