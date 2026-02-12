import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Raleway"', 'sans-serif'],
      },
      colors: {
        pearl: '#FEFEFE',
        charcoal: '#2C2C2C',
        crimson: '#8B0000',
        rose: '#FFE4E1',
      },
    },
  },
  plugins: [],
};
export default config;
