interface PufferFigureProps {
  className?: string;
  /** Light tint (top of gradient) */
  from?: string;
  /** Dark tint (bottom of gradient) */
  to?: string;
  /** Show the goggle visor bar */
  goggles?: boolean;
  /** Unique id to avoid gradient collisions when many render */
  uid: string;
}

/**
 * A stylised, geometric hooded-puffer figure rendered entirely in SVG.
 * Used in place of photography so the site deploys with zero external assets.
 */
export default function PufferFigure({
  className = '',
  from = '#c4d0d9',
  to = '#5f7482',
  goggles = true,
  uid,
}: PufferFigureProps) {
  const bodyGrad = `body-${uid}`;
  const hoodGrad = `hood-${uid}`;

  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      role="img"
      aria-label="Puffer jacket figure"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={bodyGrad} x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="55%" stopColor={to} />
          <stop offset="100%" stopColor={to} stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id={hoodGrad} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      {/* Body / shoulders — big puffy trapezoid */}
      <path
        d="M52 400 C46 300 40 236 66 196 C82 172 108 160 150 160 C192 160 218 172 234 196 C260 236 254 300 248 400 Z"
        fill={`url(#${bodyGrad})`}
      />

      {/* Quilt padding lines on the body */}
      <g stroke={to} strokeOpacity="0.35" strokeWidth="2.5" fill="none">
        <path d="M60 232 C110 218 190 218 240 232" />
        <path d="M56 270 C110 254 190 254 244 270" />
        <path d="M54 308 C110 292 190 292 246 308" />
        <path d="M52 346 C110 330 190 330 248 346" />
      </g>
      {/* Highlight on top of each roll */}
      <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" fill="none">
        <path d="M64 222 C112 208 188 208 236 222" />
        <path d="M60 260 C112 244 188 244 240 260" />
        <path d="M58 298 C112 282 188 282 242 298" />
      </g>

      {/* Center zip */}
      <line x1="150" y1="170" x2="150" y2="392" stroke={to} strokeOpacity="0.5" strokeWidth="3" />

      {/* Hood — dome flaring to shoulders */}
      <path
        d="M78 176 C70 104 104 44 150 44 C196 44 230 104 222 176 C204 150 178 138 150 138 C122 138 96 150 78 176 Z"
        fill={`url(#${hoodGrad})`}
      />
      {/* Hood inner rim */}
      <path
        d="M92 168 C88 108 114 60 150 60 C186 60 212 108 208 168 C190 148 172 140 150 140 C128 140 110 148 92 168 Z"
        fill={to}
        fillOpacity="0.55"
      />

      {/* Face opening */}
      <ellipse cx="150" cy="120" rx="42" ry="50" fill="#0e141a" fillOpacity="0.85" />

      {/* Goggle visor */}
      {goggles && (
        <g>
          <rect x="112" y="104" width="76" height="26" rx="13" fill={from} />
          <rect x="112" y="104" width="76" height="26" rx="13" fill="#ffffff" fillOpacity="0.15" />
          <rect x="120" y="109" width="30" height="8" rx="4" fill="#ffffff" fillOpacity="0.5" />
        </g>
      )}
    </svg>
  );
}
