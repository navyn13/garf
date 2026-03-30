import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        garfield: {
          orange: "#FF6B35",
          yellow: "#FFD23F",
          dark: "#1a1a1a",
          accent: "#F77F00",
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
