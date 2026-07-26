interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  separator?: string;
  className?: string;
}

/** Infinite horizontal marquee. Pauses on hover. Duplicated track for seamless loop. */
export default function Marquee({ items, reverse = false, separator = '◆', className = '' }: MarqueeProps) {
  const track = [...items, ...items];
  return (
    <div className={`overflow-hidden select-none ${className}`} aria-hidden="true">
      <div className={`flex w-max ${reverse ? 'animate-marquee-rev' : 'animate-marquee'} hover:[animation-play-state:paused]`}>
        {track.map((item, i) => (
          <span key={i} className="flex items-center mono text-xs tracking-widest uppercase whitespace-nowrap">
            <span className="mx-5 text-frost-white/45">{separator}</span>
            <span className="text-frost-white/75">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
