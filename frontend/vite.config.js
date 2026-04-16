import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: ['src/**/*.{ts,tsx,js,jsx}', 'components/**/*.{ts,tsx,js,jsx}', 'pages/**/*.{ts,tsx,js,jsx}', 'services/**/*.{ts,tsx,js,jsx}'],
    }),
  ],
})
