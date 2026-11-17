import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';
import { IMAGES } from '../data/residenceData';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 26,
        opacity: 0,
        duration: 1.05,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      if (bgImgRef.current) {
        gsap.fromTo(
          bgImgRef.current,
          { scale: 1.06 },
          { scale: 1.0, duration: 1.8, ease: 'power2.out' },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[92vh] h-[100svh] max-h-[1040px] w-full overflow-hidden bg-[#221F1B] text-[#F7F4EF] flex items-end"
    >
      {/* Background Architectural Photograph + Zero-Broken-Image Fallback */}
      {!imgFailed ? (
        <img
          ref={bgImgRef}
          src={IMAGES.heroAerial}
          alt="Villa Vérone cantilevered limestone residence overlooking the Mediterranean Sea at golden hour"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#342F28] via-[#26231F] to-[#171614]"
        />
      )}

      {/* Measured Contrast Scrim for WCAG AA/AAA Readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#171614]/90 via-[#171614]/45 to-[#171614]/45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-tr from-[#171614]/75 via-[#171614]/30 to-transparent"
      />

      {/* Editorial Composition */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 pb-12 md:pb-20 pt-28 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-3xl space-y-6">
          <p className="hero-stagger text-xs tracking-[0.2em] uppercase text-[#E2D5C1]">
            Saint-Jean-Cap-Ferrat · Côte d’Azur · Private Release
          </p>

          <h1 className="hero-stagger font-serif text-[clamp(2.65rem,5.4vw,5.25rem)] leading-[1.02] font-light tracking-[-0.015em] text-[#F7F4EF]">
            Where limestone meets the Mediterranean horizon.
          </h1>

          <p className="hero-stagger text-base md:text-lg text-[#E8E2D9] max-w-xl leading-relaxed font-light">
            A monolithic travertine and smoked-cedar cliffside residence conceived as an unbroken spatial dialogue between sea, stone, and golden light.
          </p>

          <div className="hero-stagger pt-2">
            <a
              href="#journey"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#F7F4EF] text-[#171614] hover:bg-[#E8E2D9] transition-colors text-xs tracking-[0.16em] uppercase font-medium"
            >
              <span>Explore the Residence</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Restrained Scroll Indicator & Collection Reference */}
        <div className="hero-stagger hidden md:flex flex-col items-end gap-5 text-right shrink-0">
          <div className="text-xs tracking-[0.16em] uppercase text-[#D8D0C5] space-y-1">
            <p className="tabular-nums">43°40′58″ N · 7°19′49″ E</p>
            <p className="text-[#B89F7D]">1,420 m² · 4,800 m² Parcel</p>
          </div>
          <div className="flex flex-col items-center gap-2 self-end pr-2">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#D8D0C5]">
              Scroll
            </span>
            <div className="w-px h-14 bg-[#F7F4EF]/30 relative overflow-hidden">
              <div className="w-full h-1/2 bg-[#B89F7D]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
