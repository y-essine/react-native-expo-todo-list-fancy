// Theme configuration for light and dark modes
export const colors = {
  light: {
    primary: "#8b5cf6",
    primaryDark: "#7c3aed",
    background: ["#dbeafe", "#e0e7ff", "#dbeafe"] as [string, string, string],
    cardBackground: "#ffffff",
    text: "#1f2937",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    inputBackground: "rgba(255, 255, 255, 0.8)",
    filterBackground: "rgba(255, 255, 255, 0.4)",
  },
  dark: {
    primary: "#a78bfa",
    primaryDark: "#8b5cf6",
    background: ["#232a3b", "#1e293b", "#334155"] as [string, string, string],
    cardBackground: "rgba(30, 41, 59, 0.9)",
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    textMuted: "#94a3b8",
    inputBackground: "rgba(30, 41, 59, 0.8)",
    filterBackground: "rgba(30, 41, 59, 0.6)",
  },
};

export const priorities = {
  high: ["#ef4444", "#ec4899"] as [string, string],
  medium: ["#f59e0b", "#f97316"] as [string, string],
  low: ["#10b981", "#059669"] as [string, string],
};

export const filters = [
  "all",
  "active",
  "completed",
  "work",
  "dev",
  "health",
  "personal",
];
