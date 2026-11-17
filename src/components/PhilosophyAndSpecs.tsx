import { motion } from 'motion/react';
import { IMAGES, PROPERTY_SPECS } from '../data/residenceData';

export function PhilosophyAndSpecs() {
  return (
    <section id="architecture" className="bg-[#F7F4EF] text-[#171614]">
      {/* 5. Architecture & Design Philosophy — Asymmetric Magazine Spread */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32 border-b border-[#D8D0C5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EBE6DE]">
              <img
                src={IMAGES.exteriorArrival}
                alt="Architectural arrival court at Villa Vérone with travertine walls, cedar soffit, and reflecting basin"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs tracking-[0.14em] uppercase text-[#5A5650]">
              North Arrival Courtyard · Vein-Cut Roman Travertine &amp; Patinated Bronze
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-8 lg:pt-8"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-[#9B8364]">
              Architectural Philosophy
            </p>

            <h2 className="font-serif text-[clamp(2.2rem,3.6vw,3.5rem)] leading-[1.06] font-light">
              Architecture shaped by light, space, and permanence.
            </h2>

            <div className="space-y-5 text-base text-[#5A5650] leading-relaxed max-w-[54ch]">
              <p>
                Rather than imposing a vertical monument onto the Cap Ferrat shoreline, Villa Vérone steps quietly along three natural limestone contours—allowing the Mediterranean horizon to remain the primary elevation.
              </p>
              <p>
                Deep cantilevered eaves protect interior rooms from summer zenith sun while inviting low golden-hour reflections off the infinity water court deep into the timber-lined ceilings.
              </p>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-[#D8D0C5]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EBE6DE]">
                <img
                  src={IMAGES.interiorLiving}
                  alt="Interior architectural transition from travertine hearth to sea terrace"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <span className="text-xs tracking-[0.16em] uppercase text-[#9B8364]">
                  Spatial Principle
                </span>
                <p className="font-serif text-xl leading-snug text-[#171614]">
                  “Stone anchors the earth; glass dissolves the threshold.”
                </p>
                <span className="text-xs text-[#5A5650]">
                  Studio Atelier Vérone · Paris &amp; Nice
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 6. The Residence — Property Overview (Editorial Brochure Layout) */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-[#D8D0C5]">
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs tracking-[0.2em] uppercase text-[#9B8364]">
              The Residence · Dossier
            </p>
            <h2 className="font-serif text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.08] font-light">
              Proportioned for quiet coastal permanence.
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm border-t lg:border-t-0 border-[#D8D0C5] pt-6 lg:pt-0">
              <div>
                <span className="block text-xs uppercase tracking-[0.14em] text-[#5A5650]">
                  Property
                </span>
                <span className="font-serif text-xl text-[#171614]">Villa Vérone</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-[0.14em] text-[#5A5650]">
                  Peninsula Address
                </span>
                <span className="font-serif text-xl text-[#171614]">
                  Saint-Jean-Cap-Ferrat
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-[0.14em] text-[#5A5650]">
                  Classification
                </span>
                <span className="font-serif text-xl text-[#171614]">
                  Freehold Coastal Estate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Large Typographic Figures Grid — Clean Hairlines, Zero Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-b border-[#D8D0C5]">
          {PROPERTY_SPECS.map((spec, idx) => (
            <div
              key={spec.id}
              className={`py-10 px-2 sm:px-6 border-b border-[#D8D0C5] ${
                idx % 3 !== 2 ? 'lg:border-r' : ''
              } ${idx % 2 === 0 ? 'sm:border-r lg:border-r' : ''} last:border-b-0`}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-5xl md:text-6xl font-light tracking-tight text-[#171614] tabular-nums">
                  {spec.value}
                </span>
                {spec.unit && (
                  <span className="font-serif text-2xl text-[#9B8364]">{spec.unit}</span>
                )}
              </div>
              <p className="mt-4 text-xs tracking-[0.16em] uppercase text-[#171614] font-medium">
                {spec.label}
              </p>
              <p className="mt-2 text-sm text-[#5A5650] leading-relaxed max-w-xs">
                {spec.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
