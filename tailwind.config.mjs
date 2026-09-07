export default {
  content: ["./src/**/*.{html,js}"],
  ...{
        theme: {
          extend: {
            colors: {
              background: "rgb(var(--background) / <alpha-value>)",
              foreground: "rgb(var(--foreground) / <alpha-value>)",
              card: "rgb(var(--card) / <alpha-value>)",
              muted: "rgb(var(--muted) / <alpha-value>)",
              border: "rgb(var(--border) / <alpha-value>)",
              accent: "rgb(var(--accent) / <alpha-value>)"
            },
            fontFamily: {
              display: ["Inter", "sans-serif"],
              sans: ["Inter", "sans-serif"],
              mono: ["Inter", "sans-serif"]
            }
          }
        }
      }
};
