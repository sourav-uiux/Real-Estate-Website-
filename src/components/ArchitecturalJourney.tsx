import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  INTERIOR_SPACES,
  JOURNEY_CHAPTERS,
  MATERIAL_STUDIES,
  IMAGES,
} from '../data/residenceData';
import { VillaThreeScene } from './VillaThreeScene';

export function ArchitecturalJourney() {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activeSpaceId, setActiveSpaceId] = useState(INTERIOR_SPACES[0].id);
  const [activeMaterialId, setActiveMaterialId] = useState(MATERIAL_STUDIES[0].id);
  const [spaceImgError, setSpaceImgError] = useState<Record<string, boolean>>({});
  const [detailImgError, setDetailImgError] = useState(false);

  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Observe chapter narrative cards on scroll to drive smooth 3D camera progression
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idxAttr = entry.target.getAttribute('data-chapter-index');
            if (idxAttr !== null) {
              const parsed = Number(idxAttr);
              if (!Number.isNaN(parsed)) {
                setActiveChapterIdx(parsed);
              }
            }
          }
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0.1,
      },
    );

    chapterRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const activeChapter = JOURNEY_CHAPTERS[activeChapterIdx] ?? JOURNEY_CHAPTERS[0];
  const activeSpace =
    INTERIOR_SPACES.find((s) => s.id === activeSpaceId) ?? INTERIOR_SPACES[0];
  const activeMaterial =
    MATERIAL_STUDIES.find((m) => m.id === activeMaterialId) ?? MATERIAL_STUDIES[0];

  return (
    <section id="journey" className="bg-[#F7F4EF] text-[#171614] pt-24 md:pt-32">
      {/* Section Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-[#D8D0C5] pb-10">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs tracking-[0.2em] uppercase text-[#9B8364]">
              Signature Journey · Land to Interior
            </p>
            <h2 className="font-serif text-[clamp(2.2rem,4vw,3.75rem)] leading-[1.06] font-light">
              An unbroken progression from coastal cliff to private sanctuary.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm md:text-base text-[#5A5650] leading-relaxed max-w-md lg:ml-auto">
              Navigate the interactive 3D architectural model below or select any chapter to trace the spatial sequence from the headland approach through the living pavilion.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Three.js 3D Architectural Estate Viewport */}
      <VillaThreeScene
        activeChapterIndex={activeChapterIdx}
        onSelectChapter={setActiveChapterIdx}
      />

      {/* Five Chapters Strip — Continuous Narrative Synchronization */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: 5 Interactive Architectural Progression Chapters */}
          <div className="lg:col-span-7 divide-y divide-[#D8D0C5] border-y border-[#D8D0C5]">
            {JOURNEY_CHAPTERS.map((chapter, index) => {
              const isSelected = index === activeChapterIdx;
              return (
                <button
                  key={chapter.id}
                  ref={(el) => {
                    chapterRefs.current[index] = el;
                  }}
                  data-chapter-index={index}
                  type="button"
                  onClick={() => setActiveChapterIdx(index)}
                  className={`w-full text-left py-6 md:py-7 px-3 md:px-5 transition-colors flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-8 ${
                    isSelected ? 'bg-[#EBE6DE]/85' : 'hover:bg-[#EBE6DE]/40'
                  }`}
                >
                  <span
                    className={`text-xs tracking-[0.18em] uppercase tabular-nums shrink-0 ${
                      isSelected ? 'text-[#9B8364] font-semibold' : 'text-[#5A5650]'
                    }`}
                  >
                    {chapter.index} — {chapter.label}
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-serif text-2xl md:text-3xl font-normal leading-snug text-[#171614]">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-[#5A5650] leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Synchronized Architectural Context Frame */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EBE6DE]">
              <img
                src={
                  activeChapterIdx === 0
                    ? IMAGES.heroAerial
                    : activeChapterIdx === 1 || activeChapterIdx === 2
                      ? IMAGES.exteriorArrival
                      : activeChapterIdx === 3
                        ? IMAGES.interiorLiving
                        : IMAGES.detailStonePool
                }
                alt={activeChapter.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700"
              />
            </div>

            <div className="border-t border-[#D8D0C5] pt-5 space-y-3">
              <div className="flex items-center justify-between text-xs tracking-[0.14em] uppercase text-[#5A5650]">
                <span>{activeChapter.elevation}</span>
                <span className="text-[#9B8364]">{activeChapter.focusMaterial}</span>
              </div>
              <p className="font-serif text-2xl text-[#171614]">
                {activeChapter.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scene 04 — Interior Discovery (All 7 Curated Spaces) */}
      <div className="bg-[#EBE6DE] py-20 md:py-28 border-t border-[#D8D0C5]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D8D0C5]">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs tracking-[0.2em] uppercase text-[#9B8364]">
                04 — Interior Discovery
              </p>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3.3rem)] leading-[1.08] font-light">
                Seven spaces choreographed for coastal light.
              </h2>
            </div>
            <p className="text-xs tracking-[0.14em] uppercase text-[#5A5650] tabular-nums">
              {INTERIOR_SPACES.findIndex((s) => s.id === activeSpace.id) + 1} /{' '}
              {INTERIOR_SPACES.length} Curated Rooms
            </p>
          </div>

          {/* Interactive Space Selector Tabs */}
          <div
            className="flex flex-wrap gap-2 py-8 border-b border-[#D8D0C5]"
            role="tablist"
            aria-label="Interior Spaces"
          >
            {INTERIOR_SPACES.map((space) => {
              const selected = space.id === activeSpace.id;
              return (
                <button
                  key={space.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveSpaceId(space.id)}
                  className={`px-4 py-2.5 text-xs tracking-[0.1em] uppercase transition-colors whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-[#171614] text-[#F7F4EF]'
                      : 'bg-[#F7F4EF] text-[#5A5650] hover:text-[#171614] border border-[#D8D0C5]'
                  }`}
                >
                  {space.name}
                </button>
              );
            })}
          </div>

          {/* Active Interior Space Showcase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSpace.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-10 items-stretch"
            >
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[460px] overflow-hidden bg-[#D8D0C5]">
                {!spaceImgError[activeSpace.id] ? (
                  <img
                    src={activeSpace.image}
                    alt={activeSpace.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setSpaceImgError((prev) => ({ ...prev, [activeSpace.id]: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 text-center text-[#5A5650] font-serif text-2xl">
                    {activeSpace.name}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between py-2 space-y-8">
                <div className="space-y-5">
                  <div className="flex items-center gap-3 text-xs tracking-[0.14em] uppercase text-[#5A5650]">
                    <span>{activeSpace.level}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums text-[#9B8364]">{activeSpace.area}</span>
                  </div>

                  <h3 className="font-serif text-3xl md:text-4xl font-light text-[#171614]">
                    {activeSpace.name}
                  </h3>

                  <p className="text-base text-[#171614]/85 leading-relaxed">
                    {activeSpace.concept}
                  </p>

                  <p className="text-sm text-[#5A5650] leading-relaxed border-t border-[#D8D0C5] pt-4">
                    {activeSpace.architecturalNote}
                  </p>
                </div>

                <div className="space-y-4 border-t border-[#D8D0C5] pt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase tracking-[0.14em] text-[#5A5650]">
                      Orientation
                    </span>
                    <span className="font-medium text-[#171614]">
                      {activeSpace.orientation}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <span className="uppercase tracking-[0.14em] text-[#5A5650]">
                      Material Palette
                    </span>
                    <p className="text-[#171614] font-medium">
                      {activeSpace.materials.join('  ·  ')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scene 05 — The Signature Details */}
      <div className="bg-[#171614] text-[#F7F4EF] py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <p className="text-xs tracking-[0.2em] uppercase text-[#B89F7D]">
                05 — Signature Details
              </p>
              <h2 className="font-serif text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.08] font-light">
                Crafted in natural stone, patinated bronze, and timber.
              </h2>
              <p className="text-sm md:text-base text-[#D8D0C5] leading-relaxed max-w-lg">
                Every architectural joint is designed without ornament—relying instead on shadow reveals, hand-fluted travertine masonry, and fixtures milled specifically for Villa Vérone.
              </p>
            </div>

            <div className="divide-y divide-white/15 border-y border-white/15">
              {MATERIAL_STUDIES.map((mat) => {
                const isSelected = mat.id === activeMaterial.id;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setActiveMaterialId(mat.id)}
                    className={`w-full text-left py-4 px-3 flex items-center justify-between gap-4 transition-colors ${
                      isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="w-7 h-7 shrink-0 border border-white/25"
                        style={{ backgroundColor: mat.swatchHex }}
                      />
                      <div>
                        <p className="font-serif text-xl text-[#F7F4EF]">{mat.name}</p>
                        <p className="text-xs text-[#B89F7D]">{mat.origin}</p>
                      </div>
                    </div>
                    <span className="text-xs tracking-[0.12em] uppercase text-[#D8D0C5] hidden sm:inline">
                      {mat.finish}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1 text-sm text-[#D8D0C5] leading-relaxed">
              <span className="text-[#B89F7D] uppercase tracking-[0.14em] text-xs block mb-1">
                Material Note — {activeMaterial.name}
              </span>
              {activeMaterial.note}
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] overflow-hidden bg-[#26231F]">
            {!detailImgError ? (
              <img
                src={IMAGES.detailStonePool}
                alt="Macro architectural detail of fluted travertine masonry, bronze railing, and infinity pool edge"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setDetailImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-[#D8D0C5]">
                Travertine &amp; Bronze Craftsmanship
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
