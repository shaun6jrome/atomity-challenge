export const tokens = {
  colors: {
    background: "var(--color-background)",
    surface: "var(--color-surface)",
    elevated: "var(--color-surface-elevated)",

    textPrimary: "var(--color-text-primary)",
    textSecondary: "var(--color-text-secondary)",

    accent: "var(--color-accent)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
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