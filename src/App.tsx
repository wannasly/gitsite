import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Site from './Site';
import type { Lang } from './content';

export default function App() {
  const [lang, setLang] = useState<Lang>('ru');

  return (
    <MotionConfig reducedMotion="user">
      <Site lang={lang} setLang={setLang} />
    </MotionConfig>
  );
}
