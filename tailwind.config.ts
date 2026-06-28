import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta CASE — fiel ao guia de identidade visual
        areia:    '#F4E6D4',
        bege:     '#E9D2B6',
        nude:     '#D9B794',
        bronze:   '#B8864B',
        marrom:   '#4A2E1F',
        cafe:     '#1E120D',
        // Aliases semânticos
        bg:       '#F4E6D4',
        surface:  '#FDFAF6',
        border:   '#E9D2B6',
        muted:    '#D9B794',
        accent:   '#B8864B',
        dark:     '#4A2E1F',
        darkest:  '#1E120D',
        // Status
        success:  '#4A7C59',
        warning:  '#C4892A',
        danger:   '#B54A4A',
      },
      fontFamily: {
        display: ['Mont', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.5rem',  { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['2.5rem',  { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['1.75rem', { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['1.25rem', { lineHeight: '1.3',  fontWeight: '600' }],
        'label':      ['0.6875rem',{ lineHeight: '1',   letterSpacing: '0.1em',   fontWeight: '600' }],
      },
      borderRadius: {
        'card':  '16px',
        'input': '10px',
        'btn':   '10px',
        'pill':  '999px',
      },
      boxShadow: {
        'card':    '0 2px 12px rgba(74,46,31,0.07), 0 1px 3px rgba(74,46,31,0.05)',
        'card-hover': '0 8px 32px rgba(74,46,31,0.12), 0 2px 8px rgba(74,46,31,0.06)',
        'input':   '0 1px 3px rgba(74,46,31,0.08) inset',
        'btn':     '0 2px 8px rgba(74,46,31,0.25)',
        'btn-hover': '0 4px 16px rgba(74,46,31,0.35)',
        'modal':   '0 24px 80px rgba(30,18,13,0.20)',
      },
      backgroundImage: {
        'compass-pattern': "url('/compass-bg.svg')",
        'map-fade': 'radial-gradient(ellipse at 70% 50%, rgba(184,134,75,0.06) 0%, transparent 70%)',
        'bronze-gradient': 'linear-gradient(135deg, #C4973A 0%, #B8864B 50%, #9A6E38 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1E120D 0%, #2D1A10 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },              to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}

export default config
