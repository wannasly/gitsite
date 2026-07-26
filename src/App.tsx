import { useState, useEffect, useCallback } from 'react';
import { MotionConfig } from 'framer-motion';
import type { Lang } from './content';

import V1Lab from './variants/V1Lab';
import V2Noir from './variants/V2Noir';
import V3Editorial from './variants/V3Editorial';
import V4Blueprint from './variants/V4Blueprint';

const VARIANTS = [
  { id: 1, code: '01', name: 'LAB', hint: 'Швейцарский брутализм' },
  { id: 2, code: '02', name: 'NOIR', hint: 'Тёмное премиум-агентство' },
  { id: 3, code: '03', name: 'EDITORIAL', hint: 'Крупная типографика' },
  { id: 4, code: '04', name: 'BLUEPRINT', hint: 'Технический минимализм' },
];

function readVariantFromUrl(): number {
  const params = new URLSearchParams(window.location.search);
  const v = parseInt(params.get('v') || '1', 10);
  return v >= 1 && v <= VARIANTS.length ? v : 1;
}

export default function App() {
  const [variant, setVariant] = useState<number>(readVariantFromUrl);
  const [lang, setLang] = useState<Lang>('ru');
  const [barHidden, setBarHidden] = useState(false);

  const changeVariant = useCallback((v: number) => {
    setVariant(v);
    const params = new URLSearchParams(window.location.search);
    params.set('v', String(v));
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Number keys 1-4 jump between variants
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= VARIANTS.length) changeVariant(n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeVariant]);

  const props = { lang, setLang };

  return (
    <MotionConfig reducedMotion="user">
      {variant === 1 && <V1Lab {...props} />}
      {variant === 2 && <V2Noir {...props} />}
      {variant === 3 && <V3Editorial {...props} />}
      {variant === 4 && <V4Blueprint {...props} />}

      {/* ---- Temporary variant chooser (removed once a direction is picked) ---- */}
      <div
        className={`fixed z-[200] left-1/2 -translate-x-1/2 transition-all duration-300 ${
          barHidden ? 'bottom-3' : 'bottom-4 sm:bottom-6'
        }`}
      >
        {barHidden ? (
          <button
            onClick={() => setBarHidden(false)}
            className="font-mono text-[10px] tracking-widest uppercase bg-black/80 text-white backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 hover:bg-black transition-colors cursor-pointer"
          >
            Показать варианты
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-black/85 backdrop-blur-xl border border-white/15 rounded-full p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.45)] max-w-[94vw] overflow-x-auto no-bar">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50 pl-3 pr-2 hidden sm:inline whitespace-nowrap">
              Вариант
            </span>
            {VARIANTS.map((v) => {
              const active = variant === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => changeVariant(v.id)}
                  aria-pressed={active}
                  title={v.hint}
                  className={`font-mono text-[10px] sm:text-[11px] tracking-[0.12em] uppercase px-3 sm:px-4 py-2.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    active ? 'bg-white text-black font-bold' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="opacity-60 mr-1.5">{v.code}</span>
                  {v.name}
                </button>
              );
            })}
            <button
              onClick={() => setBarHidden(true)}
              aria-label="Скрыть панель выбора"
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-0.5 cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
