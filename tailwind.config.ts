import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        cream: "#F7E9DC",
        peach: "#E8A87C",
        mint: "#C4E0DE",
        lavender: "#D8BFD8",
        butter: "#F6D365",
        ink: "#3A3A3A",
        dodger: "#1E90FF"
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