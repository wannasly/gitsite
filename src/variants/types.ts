import type { Lang } from '../content';

/** Every design variant is a full standalone page and receives exactly this. */
export interface VariantProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}
