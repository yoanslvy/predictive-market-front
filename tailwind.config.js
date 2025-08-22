/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: ["class"],

  // daisyui: {
  //   themes: [
  //     {
  //       mytheme: {
  //         primary: "#00DF6C",
  //         secondary: "#00C68D",
  //         accent: "#00F847",
  //         neutral: "#0F0F0F",
  //         "base-100": "#1a1d24",
  //         "info": "#cccccc",
  //         "success": "#36D399",
  //         "warning": "#FBBD23",
  //         "error": "#F87272"
  //       },
  //     },
  //   ],
  // },

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',

    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      transitionDuration: {
        4000: '4000ms',
        3000: '3000ms',
        2000: '2000ms',
      },

      transitionProperty: {
        opacity: 'opacity',
      },

      colors: {
        'dark-base-400': '#444f63',
        'dark-base-500': '#384152',
        'dark-base-600': '#2A303C',
        'dark-base-800': '#1d222b',
        'dark-base-900': '#191D24',
        'dark-base-999': '#121419',

        'v3-primary': 'rgba(1, 225, 105, var(--tw-opa))',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },

      animation: {
        logoFade: 'logoFade 2s infinite ease-in-out',
        growShrink: 'growShrink 4s infinite ease-in-out',
        fadeInFast: 'fadeIn 0.3s ease-in-out',
        fadeInMedium: 'fadeIn 0.5s ease-in-out',
        fadeInSlow: 'fadeIn 1s ease-in-out',
        fadeInFastHalf: 'fadeInHalf 0.3s ease-out',
        fadeInMediumHalf: 'fadeInHalf 0.5s ease-out',
        fadeInSlowHalf: 'fadeInHalf 1s ease-out',
      },

      keyframes: {
        growShrink: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        logoFade: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInHalf: {
          '0%': { opacity: 0.5 },
          '100%': { opacity: 1 },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      shadow: {
        accent: {
          boxShadow: '0, 0, 12px, 0, var(--color-shadow, transparent)',
        },
      },
      fontFamily: {
        'apk-protocol': ['var(--font-apk-protocol)', 'sans-serif'],
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
    // require("daisyui"),
    require('@tailwindcss/container-queries'),
  ],
}
