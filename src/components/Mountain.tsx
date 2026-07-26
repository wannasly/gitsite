interface MountainProps {
  className?: string;
}

/** Layered snowy mountain range, pure SVG — no photography needed. */
export default function Mountain({ className = '' }: MountainProps) {
  return (
    <svg
      viewBox="0 0 1440 640"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mtn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8598a6" />
          <stop offset="100%" stopColor="#6f8291" />
        </linearGradient>
        <linearGradient id="mtn-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9b8c3" />
          <stop offset="100%" stopColor="#7e919e" />
        </linearGradient>
        <linearGradient id="mtn-main-shadow" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#4d5f6c" />
          <stop offset="100%" stopColor="#33424d" />
        </linearGradient>
        <linearGradient id="mtn-main-snow" x1="0.5" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#eef2f4" />
          <stop offset="100%" stopColor="#b9c6cf" />
        </linearGradient>
        <linearGradient id="mtn-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4a55" />
          <stop offset="100%" stopColor="#222d35" />
        </linearGradient>
      </defs>

      <rect width="1440" height="640" fill="url(#mtn-sky)" />

      {/* back range */}
      <path d="M0 380 L220 250 L360 330 L520 210 L680 320 L860 220 L1040 330 L1200 240 L1440 360 L1440 640 L0 640 Z" fill="url(#mtn-back)" opacity="0.85" />

      {/* main massif — shadow side */}
      <path d="M360 640 L760 150 L1160 640 Z" fill="url(#mtn-main-shadow)" />
      {/* main massif — snow (lit) side */}
      <path d="M760 150 L1160 640 L820 640 L720 360 L760 150 Z" fill="url(#mtn-main-snow)" opacity="0.95" />
      {/* snow cap detail */}
      <path d="M760 150 L700 300 L742 285 L720 360 L800 250 L770 260 Z" fill="#f3f6f7" opacity="0.9" />
      {/* ridge crevasses */}
      <g stroke="#2b3842" strokeOpacity="0.35" strokeWidth="3" fill="none">
        <path d="M760 170 L690 420 L640 640" />
        <path d="M760 175 L830 430 L900 640" />
      </g>

      {/* left secondary peak */}
      <path d="M60 640 L320 300 L560 640 Z" fill="url(#mtn-main-shadow)" opacity="0.9" />
      <path d="M320 300 L440 490 L360 470 L560 640 L320 640 Z" fill="url(#mtn-main-snow)" opacity="0.55" />

      {/* foreground darker ridge */}
      <path d="M0 640 L180 500 L420 600 L640 520 L900 610 L1140 520 L1440 600 L1440 640 Z" fill="url(#mtn-front)" opacity="0.92" />
    </svg>
  );
}
