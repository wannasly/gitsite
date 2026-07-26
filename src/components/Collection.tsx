import { Plus, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import PufferFigure from './PufferFigure';

interface Product {
  id: string;
  name: string;
  type: string;
  price: string;
  swatches: { label: string; hex: string }[];
  from: string;
  to: string;
  goggles: boolean;
}

const PRODUCTS: Product[] = [
  { id: 'aurora', name: 'Aurora Silver', type: 'Reflective Puffer Jacket', price: '$999.99', swatches: [{ label: 'White', hex: '#eef1f2' }, { label: 'Blue', hex: '#6f8fa8' }], from: '#eef1f3', to: '#93a5b1', goggles: true },
  { id: 'orbit', name: 'Orbit Silver', type: 'High-Gloss Puffer', price: '$1,299.99', swatches: [{ label: 'Silver', hex: '#c3ccd2' }], from: '#dfe6ea', to: '#9aa8b1', goggles: true },
  { id: 'stealth', name: 'Stealth Black', type: 'Heavy Shield Puffer', price: '$1,199.99', swatches: [{ label: 'Black', hex: '#1b2228' }, { label: 'White', hex: '#eef1f2' }], from: '#5a6873', to: '#20272e', goggles: false },
  { id: 'glacier', name: 'Glacier White', type: 'Insulated Puffer Jacket', price: '$1,299.99', swatches: [{ label: 'Grey', hex: '#aeb9c0' }], from: '#e7ebee', to: '#8b98a2', goggles: true },
  { id: 'polar-gloss', name: 'Polar Gloss', type: 'Blue Puffer Jacket', price: '$899.99', swatches: [{ label: 'Blue Gloss', hex: '#5f7f97' }], from: '#c7d5df', to: '#5c7488', goggles: false },
  { id: 'stealth-2', name: 'Stealth Black', type: 'Heavy Puffer Jacket', price: '$1,199.99', swatches: [{ label: 'Navy', hex: '#28343f' }, { label: 'Black', hex: '#1b2228' }], from: '#4c5a66', to: '#1d242b', goggles: true },
  { id: 'icefield', name: 'Icefield Blue', type: 'Tech Puffer Jacket', price: '$999.99', swatches: [{ label: 'Blue', hex: '#6a8aa3' }], from: '#bcccd8', to: '#557087', goggles: true },
  { id: 'polar-white', name: 'Polar White', type: 'Shell Puffer Jacket', price: '$1,499.99', swatches: [{ label: 'White', hex: '#eef1f2' }], from: '#eff2f4', to: '#a7b3bc', goggles: true },
];

const gridContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article variants={cardVariant} className="group flex flex-col">
      <div
        className="quilt notch-tr relative aspect-3/4 overflow-hidden tile-vignette cursor-pointer"
        style={{ ['--quilt-tint' as string]: product.to }}
      >
        <div className="absolute inset-0 flex items-end justify-center">
          <PufferFigure
            uid={product.id}
            from={product.from}
            to={product.to}
            goggles={product.goggles}
            className="w-[78%] h-auto translate-y-5 transition-transform duration-500 ease-out group-hover:translate-y-0 group-hover:scale-[1.04]"
          />
        </div>

        {/* quick add */}
        <div className="absolute top-3 left-3 translate-y-[-8px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="inline-flex items-center gap-1 bg-frost-white text-frost-ink mono text-[10px] tracking-widest px-2.5 py-1.5 rounded-full">
            <Plus className="w-3 h-3" /> ADD
          </span>
        </div>
      </div>

      {/* info */}
      <div className="pt-4 space-y-2">
        <div>
          <h3 className="display text-base leading-tight text-frost-white">{product.name}</h3>
          <p className="mono text-[11px] text-frost-white/55 tracking-wide uppercase mt-0.5">{product.type}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {product.swatches.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 mono text-[10px] text-frost-white/70 uppercase tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full border border-frost-white/40" style={{ background: s.hex }} />
              {s.label}
            </span>
          ))}
        </div>
        <div className="mono text-sm text-frost-white pt-1">{product.price}</div>
      </div>
    </motion.article>
  );
}

export default function Collection() {
  return (
    <section id="collection" className="relative bg-frost-base py-20 sm:py-28">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="display text-5xl sm:text-6xl xl:text-7xl text-frost-white"
          >
            New Collection
          </motion.h2>

          <div className="flex flex-col sm:flex-row gap-8 lg:pt-3">
            <div className="space-y-1">
              <div className="tech-label">[ NEW COLLECTION ]</div>
              <div className="tech-label">[ SERIES_01 ]</div>
              <div className="tech-label">[ PUFFERS ]</div>
            </div>
            <div className="space-y-1">
              <div className="tech-label">PUFFER JACKETS</div>
              <div className="tech-label">METAL EDITION</div>
              <div className="tech-label">GLOSS SERIES</div>
              <div className="tech-label">EXTREME COLD LINE</div>
            </div>
            <button className="self-start inline-flex items-center gap-2 mono text-xs tracking-widest text-frost-ink bg-frost-white px-4 py-2.5 rounded-full hover:bg-frost-snow transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" /> FILTERS
            </button>
          </div>
        </div>

        {/* grid */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {/* Featured AURORA card spans two columns */}
          <motion.article
            variants={cardVariant}
            className="group col-span-2 flex flex-col"
          >
            <div
              className="quilt notch-tr relative aspect-3/4 lg:aspect-auto lg:h-full min-h-[340px] overflow-hidden tile-vignette cursor-pointer"
              style={{ ['--quilt-tint' as string]: '#7d909d' }}
            >
              <span className="tag absolute bottom-6 left-6 text-7xl sm:text-8xl rotate-[-8deg] !opacity-[0.14]">FRZN</span>

              <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-10">
                <PufferFigure
                  uid="aurora-feat"
                  from="#e9eef1"
                  to="#7d909d"
                  className="w-[46%] max-w-[240px] h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="text-right">
                  <div className="display text-4xl sm:text-6xl text-frost-white">
                    AURORA<sup className="text-lg align-super">™</sup>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-5 left-6 flex items-center gap-4">
                <span
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-frost-white/50 text-frost-white group-hover:bg-frost-white group-hover:text-frost-ink transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </span>
                <div>
                  <div className="tech-label !text-frost-white/80">ADD TO CART</div>
                  <div className="display text-xl text-frost-white">$1,999</div>
                </div>
              </div>
            </div>
          </motion.article>

          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
