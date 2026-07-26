import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import Mountain from './Mountain';
import Marquee from './Marquee';

// Deterministic barcode pattern (avoids Math.random for stable renders)
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1];

const wordReveal: Variants = {
  hidden: { y: '105%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 0.85, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const STATEMENT = ['Built for Cold', 'Made for Height', 'Forged to Last'];

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const graffitiY = useTransform(scrollYProgress, [0, 1], ['-8%', '18%']);
  const mountainY = useTransform(scrollYProgress, [0, 1], ['12%', '-6%']);

  return (
    <section id="about" ref={ref} className="relative bg-frost-deep overflow-hidden">
      {/* top marquee divider */}
      <div className="border-y border-frost-line py-3 bg-frost-deep/60">
        <Marquee items={['EXTREME COLD LINE', 'ALTITUDE OPS', 'GLOSS SERIES', 'METAL EDITION', 'BUILT IN THE MOUNTAINS']} />
      </div>

      {/* manifesto copy over graffiti */}
      <div className="relative px-5 sm:px-8 lg:px-12 pt-24 pb-10 max-w-[1600px] mx-auto">
        <motion.span
          style={{ y: graffitiY }}
          className="tag absolute inset-x-0 top-6 text-center text-[6rem] sm:text-[12rem] lg:text-[16rem] leading-none rotate-[-4deg] !opacity-[0.08]"
        >
          FRZN
        </motion.span>

        <div className="relative flex flex-col lg:flex-row justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-md"
          >
            <p className="mono text-sm sm:text-base leading-relaxed text-frost-white/85 uppercase tracking-wide">
              FRZN was born in the mountains. Not as a trend, but as a response.
            </p>
            <p className="tech-label mt-6">[ PROTOCOL: ALTITUDE OPS_X1 ]</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mono text-xs sm:text-sm text-frost-white/70 uppercase tracking-wide text-left lg:text-right self-end max-w-[220px]"
          >
            For those who climb, not for the crowd
          </motion.p>
        </div>
      </div>

      {/* mountain scene */}
      <div className="relative h-[420px] sm:h-[560px] lg:h-[680px] overflow-hidden">
        <motion.div style={{ y: mountainY }} className="absolute inset-0 scale-110">
          <Mountain className="w-full h-full" />
        </motion.div>
        {/* grain over mountain */}
        <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

        {/* giant statement */}
        <div id="footer" className="absolute bottom-6 sm:bottom-10 left-0 w-full px-5 sm:px-8 lg:px-12">
          <div className="max-w-[1600px] mx-auto">
            <h2 className="display text-[3rem] sm:text-[5rem] lg:text-[7rem] text-frost-white leading-[0.86]">
              {STATEMENT.map((line, i) => (
                <span key={i} className="block reveal-mask">
                  <motion.span
                    className="block"
                    variants={wordReveal}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>
        </div>
      </div>

      {/* footer bar */}
      <footer className="bg-frost-ink">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-6">
            <span className="display text-xl text-frost-white">FRZN</span>
            <span className="mono text-[10px] text-frost-white/50 tracking-widest uppercase">
              ©2025 FRZN Wear — All Rights Reserved
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="mono text-[10px] text-frost-white/50 tracking-widest">SKU_FRZN_ARTIC01</span>
            {/* barcode */}
            <svg width="150" height="34" viewBox="0 0 150 34" aria-hidden="true">
              {(() => {
                let x = 0;
                return BARS.map((w, i) => {
                  const rect = (
                    <rect key={i} x={x} y={0} width={i % 2 === 0 ? w : w} height="34" fill={i % 2 === 0 ? '#f2f5f6' : 'transparent'} />
                  );
                  x += w + 1;
                  return rect;
                });
              })()}
            </svg>
          </div>
        </div>
      </footer>
    </section>
  );
}
