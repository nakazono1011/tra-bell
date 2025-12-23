import tailwindcssAnimate from 'tailwindcss-animate';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
      colors: {
        background:
          'hsl(var(--background) / <alpha-value>)',
        foreground:
          'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground:
            'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground:
            'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          hover:
            'hsl(var(--primary-hover) / <alpha-value>)',
          foreground:
            'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          hover:
            'hsl(var(--secondary-hover) / <alpha-value>)',
          foreground:
            'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground:
            'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground:
            'hsl(var(--accent-foreground) / <alpha-value>)',
          // Custom Tra-bell accents
          primary:
            'hsl(var(--accent-primary) / <alpha-value>)',
          hover: 'hsl(var(--accent-hover) / <alpha-value>)',
          secondary:
            'hsl(var(--accent-secondary) / <alpha-value>)',
          light: 'hsl(var(--accent-light) / <alpha-value>)',
        },
        destructive: {
          DEFAULT:
            'hsl(var(--destructive) / <alpha-value>)',
          foreground:
            'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        chart: {
          '1': 'hsl(var(--chart-1) / <alpha-value>)',
          '2': 'hsl(var(--chart-2) / <alpha-value>)',
          '3': 'hsl(var(--chart-3) / <alpha-value>)',
          '4': 'hsl(var(--chart-4) / <alpha-value>)',
          '5': 'hsl(var(--chart-5) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground':
            'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground':
            'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Custom Brand Colors
        brand: {
          rakuten: 'hsl(var(--rakuten) / <alpha-value>)',
          jalan: 'hsl(var(--jalan) / <alpha-value>)',
        },
        // Tra-bell Custom Backgrounds
        bg: {
          primary: 'hsl(var(--bg-primary) / <alpha-value>)',
          secondary:
            'hsl(var(--bg-secondary) / <alpha-value>)',
          tertiary:
            'hsl(var(--bg-tertiary) / <alpha-value>)',
        },
        // Tra-bell Custom Text
        text: {
          primary:
            'hsl(var(--text-primary) / <alpha-value>)',
          secondary:
            'hsl(var(--text-secondary) / <alpha-value>)',
          tertiary:
            'hsl(var(--text-tertiary) / <alpha-value>)',
          'on-accent':
            'hsl(var(--text-on-accent) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
