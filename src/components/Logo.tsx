export const Logo = ({ className }: { className?: string }) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
      <path
        d="M19.9984 9.33203L12.0016 22.668M15.3321 9.33203L8.66797 22.668M23.332 9.33203L16.6678 22.668"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  