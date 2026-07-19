/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      spacing: {
        11: '2.75rem', // max-[400px]:w-11 (白鍵)
        13: '3.25rem', // w-13 (白鍵)
        15: '3.75rem', // w-15 (リセットボタン)
        '17-5': '4.375rem',
        26: '6.5rem',
        28: '7rem',
        36: '9rem',
        48: '12rem', // h-48 (黒鍵)
        55: '13.75rem',
        60: '15rem', // max-sm:h-60 (白鍵)
        80: '20rem', // h-80 (白鍵)
        96: '24rem', // h-96 (ピアノコンテナ)
        '7-5': '1.875rem',
        '1-75': '0.4375rem',
        '3-75': '0.9375rem',
      },
    },
  },
  plugins: [],
}
