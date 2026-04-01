import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const IconRecords = ({ className, ...rest }: IconProps) => (
  <svg {...baseProps} className={className} {...rest}>
    <ellipse cx="12" cy="5.5" rx="6.5" ry="2.5" />
    <path d="M5.5 5.5v6c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-6" />
    <path d="M5.5 11.5v6c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-6" />
  </svg>
)

export const IconCategory = ({ className, ...rest }: IconProps) => (
  <svg {...baseProps} className={className} {...rest}>
    <path d="M3.5 9.5 12 3l8.5 6.5v10.2a1.3 1.3 0 0 1-1.3 1.3H4.8a1.3 1.3 0 0 1-1.3-1.3z" />
    <path d="M8 12h8" />
    <path d="M8 16h6" />
  </svg>
)

export const IconFilter = ({ className, ...rest }: IconProps) => (
  <svg {...baseProps} className={className} {...rest}>
    <path d="M4 6h16" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </svg>
)

export const IconTheme = ({ className, ...rest }: IconProps) => (
  <svg {...baseProps} className={className} {...rest}>
    <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5 6.5 6.5 0 1 1-8.5-8.5z" />
  </svg>
)

export const IconRole = ({ className, ...rest }: IconProps) => (
  <svg {...baseProps} className={className} {...rest}>
    <path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" />
    <path d="M5.2 20a6.8 6.8 0 0 1 13.6 0" />
  </svg>
)
