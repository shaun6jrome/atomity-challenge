export const tokens = {
  colors: {
    background: "var(--color-background)",
    surface: "var(--color-surface)",
    elevated: "var(--color-surface-elevated)",

    textPrimary: "var(--color-text-primary)",
    textSecondary: "var(--color-text-secondary)",

    accent: "var(--color-accent)",
    accentStrong: "var(--color-accent-strong)",
    accentSoft: "var(--color-accent-soft)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    border: "var(--color-border)",
    muted: "var(--color-muted)",
  },

  radius: {
    sm: "12px",
    md: "20px",
    lg: "28px",
  },

  motion: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.7,
  },
} as const;
