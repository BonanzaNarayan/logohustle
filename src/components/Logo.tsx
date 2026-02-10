export const Logo = ({ className }: { className?: string }) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#47C6B4" />
          <stop offset="100%" stopColor="#115E67" />
        </linearGradient>
        <filter id="logo-noise">
            <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.65" 
                numOctaves="1" 
                stitchTiles="stitch"
            />
        </filter>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
      <rect 
            width="32" 
            height="32" 
            rx="8"
            filter="url(#logo-noise)" 
            opacity="0.1" 
            style={{ mixBlendMode: 'soft-light' }} 
        />
      <path
        d="M22.6111 9.42255L11.5 20.5337M18.0556 9.42255L6.94446 20.5337M27.1667 9.42255L16.0556 20.5337"
        stroke="#1F2937"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );