import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GALLERY_ITEMS, GalleryItem } from '../data/residenceData';
import { filterGalleryByCategory } from '../utils/inquiryValidation';

const CATEGORIES = ['All', 'Architecture', 'Interiors', 'Details'] as const;

export function EditorialGallery() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems: GalleryItem[] = filterGalleryByCategory(GALLERY_ITEMS, activeCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleItems.length,
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + visibleItems.length) % visibleItems.length,
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, visibleItems.length]);

  const activeLightboxItem =
    lightboxIndex !== null ? visibleItems[lightboxIndex] ?? null : null;

  return (
    <section className="bg-[#EBE6DE] text-[#171614] py-24 md:py-32 border-t border-[#D8D0C5]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D8D0C5]">
          <div className="space-y-3">
            <p className="text-xs tracking-[0.2em] uppercase text-[#9B8364]">
              Curated Visual Monograph
            </p>
            <h2 className="font-serif text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1.06] font-light">
              Selected architectural plates.
            </h2>
          </div>

          <div
            className="flex flex-wrap items-center gap-1.5"
            role="tablist"
            aria-label="Gallery category filter"
          >
            {CATEGORIES.map((category) => {
              const selected = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setActiveCategory(category);
                    setLightboxIndex(null);
                  }}
                  className={`px-4 py-2 text-xs tracking-[0.12em] uppercase transition-colors whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-[#171614] text-[#F7F4EF]'
                      : 'bg-[#F7F4EF] text-[#5A5650] hover:text-[#171614] border border-[#D8D0C5]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-12">
          {visibleItems.map((item, idx) => {
            const colSpan =
              item.aspect === 'wide'
                ? 'md:col-span-7'
                : item.aspect === 'square'
                  ? 'md:col-span-5'
                  : 'md:col-span-4';

            return (
              <div key={item.id} className={`${colSpan} flex flex-col gap-3`}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Inspect ${item.title} in full-screen gallery`}
                  className="group relative aspect-[16/10] w-full overflow-hidden bg-[#D8D0C5] text-left"
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </button>
                <div className="flex items-baseline justify-between gap-4 pt-1">
                  <div>
                    <h3 className="font-serif text-2xl text-[#171614]">{item.title}</h3>
                    <p className="text-xs text-[#5A5650] mt-0.5">{item.caption}</p>
                  </div>
                  <span className="text-[11px] tracking-[0.14em] uppercase text-[#9B8364] shrink-0">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Fullscreen Lightbox */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          className="fixed inset-0 z-50 bg-[#171614] text-[#F7F4EF] flex flex-col justify-between p-6 md:p-10"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs tracking-[0.16em] uppercase text-[#B89F7D] tabular-nums">
              Plate 0{lightboxIndex + 1} / 0{visibleItems.length} ·{' '}
              {activeLightboxItem.category}
            </div>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close gallery lightbox"
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-white/25 hover:bg-white/10 text-xs tracking-[0.14em] uppercase transition-colors"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-6 overflow-hidden">
            <img
              src={activeLightboxItem.image}
              alt={activeLightboxItem.imageAlt}
              referrerPolicy="no-referrer"
              className="max-h-[72vh] max-w-full object-contain"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/15 pt-5">
            <div>
              <h3 className="font-serif text-2xl text-[#F7F4EF]">
                {activeLightboxItem.title}
              </h3>
              <p className="text-sm text-[#D8D0C5]">{activeLightboxItem.caption}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + visibleItems.length) % visibleItems.length,
                  )
                }
                aria-label="Previous photograph"
                className="inline-flex items-center justify-center w-11 h-11 border border-white/25 hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % visibleItems.length)
                }
                aria-label="Next photograph"
                className="inline-flex items-center justify-center w-11 h-11 border border-white/25 hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
