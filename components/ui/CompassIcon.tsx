'use client'

interface CompassIconProps {
  size?: number
  className?: string
  variant?: 'bronze' | 'light' | 'dark'
}

export function CompassIcon({ size = 32, className = '', variant = 'bronze' }: CompassIconProps) {
  const colors = {
    bronze: { outer: '#B8864B', inner: '#8B6235', accent: '#D4A862' },
    light:  { outer: '#F4E6D4', inner: '#E9D2B6', accent: '#FDFAF6' },
    dark:   { outer: '#4A2E1F', inner: '#2D1A10', accent: '#6B4230' },
  }
  const c = colors[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Anel externo */}
      <circle cx="32" cy="32" r="30" stroke={c.outer} strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="32" cy="32" r="26" stroke={c.outer} strokeWidth="1" fill="none" opacity="0.25" />

      {/* Marcações do anel */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16
        const rad = (angle * Math.PI) / 180
        const r1 = 24, r2 = i % 4 === 0 ? 20 : 22
        return (
          <line
            key={i}
            x1={32 + r1 * Math.sin(rad)}
            y1={32 - r1 * Math.cos(rad)}
            x2={32 + r2 * Math.sin(rad)}
            y2={32 - r2 * Math.cos(rad)}
            stroke={c.outer}
            strokeWidth={i % 4 === 0 ? 1.5 : 0.75}
            opacity="0.6"
          />
        )
      })}

      {/* Estrela Norte (ponta maior) */}
      <path
        d="M32 4 L34.5 28 L32 30 L29.5 28 Z"
        fill={c.outer}
      />
      {/* Estrela Sul */}
      <path
        d="M32 60 L34.5 36 L32 34 L29.5 36 Z"
        fill={c.inner}
        opacity="0.7"
      />
      {/* Estrela Leste */}
      <path
        d="M60 32 L36 34.5 L34 32 L36 29.5 Z"
        fill={c.inner}
        opacity="0.7"
      />
      {/* Estrela Oeste */}
      <path
        d="M4 32 L28 34.5 L30 32 L28 29.5 Z"
        fill={c.outer}
      />

      {/* Diagonais menores */}
      <path d="M48 16 L34.5 29.5 L32 30 L33 27 Z" fill={c.accent} opacity="0.5" />
      <path d="M48 48 L34.5 34.5 L34 32 L37 33 Z" fill={c.inner} opacity="0.4" />
      <path d="M16 48 L29.5 34.5 L32 34 L31 37 Z" fill={c.accent} opacity="0.5" />
      <path d="M16 16 L29.5 29.5 L30 32 L27 31 Z" fill={c.inner} opacity="0.4" />

      {/* Centro */}
      <circle cx="32" cy="32" r="5" fill={c.outer} />
      <circle cx="32" cy="32" r="2.5" fill={c.accent} />
      <circle cx="32" cy="32" r="1" fill={c.inner} />
    </svg>
  )
}
