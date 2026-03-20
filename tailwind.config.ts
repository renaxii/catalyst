import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        "accent-blue": "#1e90ff",
        "gallery-card-bg": "rgba(255, 255, 255, 0.76)",
        dodger: "#1e90ff",
        "lab-note": "rgba(255, 255, 255, 0.76)"
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: []
}

export default config