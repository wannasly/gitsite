import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  style?: React.CSSProperties;
  /** How strongly the element follows the cursor (px range) */
  strength?: number;
}

/**
 * Element that subtly drifts toward the cursor while hovered, then springs back.
 * Falls back to a plain element when the user prefers reduced motion.
 */
export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  ariaLabel,
  style,
  strength = 14,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * strength * 2);
    y.set(relY * strength * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const commonProps = {
    ref: ref as never,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onClick,
    'aria-label': ariaLabel,
    style: { ...style, x: sx, y: sy },
    className,
  };

  if (href) {
    return (
      <motion.a href={href} {...commonProps}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" {...commonProps}>
      {children}
    </motion.button>
  );
}
