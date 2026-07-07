export function ElectraCoreLogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="url(#ec-bg)" />
      <path d="M19 4L11 16H17L13 28L22 13H16L19 4Z" fill="url(#ec-bolt)" />
      <defs>
        <linearGradient id="ec-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A1000" />
          <stop offset="100%" stopColor="#0A0A0C" />
        </linearGradient>
        <linearGradient id="ec-bolt" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD060" />
          <stop offset="60%" stopColor="#F0A500" />
          <stop offset="100%" stopColor="#C07000" />
        </linearGradient>
      </defs>
    </svg>
  );
}
