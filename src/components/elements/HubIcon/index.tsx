interface HubIconProps {
  size?: number;
  className?: string;
}

export function HubIcon({ size = 20, className }: HubIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line x1="16" y1="16" x2="23" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="16" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="16" x2="9" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="16" x2="9" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="3.5" fill="currentColor"/>
      <circle cx="23" cy="9" r="2" fill="currentColor"/>
      <circle cx="23" cy="23" r="2" fill="currentColor"/>
      <circle cx="9" cy="23" r="2" fill="currentColor"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </svg>
  );
}
