import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LIFESTYLE_ITEMS, LOCATION_PINS } from '../data/residenceData';

export function LifestyleAndLocation() {
  const [activeLifestyleId, setActiveLifestyleId] = useState(LIFESTYLE_ITEMS[0].id);
  const [selectedPinId, setSelectedPinId] = useState(LOCATION_PINS[1].id);

  const activeLifestyle =
    LIFESTYLE_ITEMS.find((item) => item.id === activeLifestyleId) ?? LIFESTYLE_ITEMS[0];
  const originPin = LOCATION_PINS[0];
  const selectedPin =
    LOCATION_PINS.find((p) => p.id === selectedPinId) ?? LOCATION_PINS[1];

  return (
    <>
      {/* 7. Lifestyle Experience */}
      <section id="lifestyle" className="bg-[#EBE6DE] text-[#171614] py-24 md:py-32 border-t border-[#D8D0C5]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-[#D8D0C5] items-end">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-xs tracking-[0.2em] uppercase text-[#9B8364]">
                The Lifestyle
              </p>
              <h2 className="font-serif text-[clamp(2.2rem,3.8vw,3.5rem)] leading-[1.06] font-light">
                Private coastal living without compromise.
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-base text-[#5A5650] leading-relaxed max-w-xl lg:ml-auto">
                From early morning laps suspended above the sea to quiet evenings in the cedar wellness sanctuary, every outdoor terrace and interior pavilion elevates daily ritual.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-stretch">
            {/* Left: Interactive Lifestyle Chapters */}
            <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-[#D8D0C5] border-y border-[#D8D0C5]">
              {LIFESTYLE_ITEMS.map((item, idx) => {
                const isSelected = item.id === activeLifestyle.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveLifestyleId(item.id)}
                    className={`w-full text-left py-6 px-4 transition-colors ${
                      isSelected ? 'bg-[#F7F4EF]' : 'hover:bg-[#F7F4EF]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs tracking-[0.14em] uppercase text-[#9B8364] mb-1.5">
                      <span>0{idx + 1} · {item.caption}</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-normal text-[#171614]">
                      {item.title}
                    </h3>
                    {isSelected && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-[#5A5650] leading-relaxed">
                          {item.description}
                        </p>
                        <p className="text-xs tracking-[0.1em] uppercase text-[#171614] pt-1">
                          {item.metrics}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Cinematic Lifestyle Photograph */}
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[520px] overflow-hidden bg-[#D8D0C5]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeLifestyle.id}
                  src={activeLifestyle.image}
                  alt={activeLifestyle.imageAlt}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0.4, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Location & Surroundings */}
      <section id="location" className="bg-[#F7F4EF] text-[#171614] py-24 md:py-32 border-t border-[#D8D0C5]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-14">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs tracking-[0.2em] uppercase text-[#9B8364]">
                Location &amp; Peninsula
              </p>
              <h2 className="font-serif text-[clamp(2.2rem,3.8vw,3.5rem)] leading-[1.06] font-light">
                Saint-Jean-Cap-Ferrat, poised between Nice and Monaco.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm md:text-base text-[#5A5650] leading-relaxed">
                Surrounded by sheltered anchorages, coastal pine paths, and deep-water marinas while remaining twenty-five minutes from private international aviation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch border-t border-[#D8D0C5] pt-12">
            {/* Restrained Architectural Vector Map */}
            <div className="lg:col-span-7 bg-[#EBE6DE] border border-[#D8D0C5] p-6 md:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs tracking-[0.16em] uppercase text-[#5A5650] pb-4 border-b border-[#D8D0C5]">
                <span>Côte d’Azur Coastal Axis</span>
                <span className="tabular-nums text-[#9B8364]">
                  {selectedPin.name} · {selectedPin.travelTime}
                </span>
              </div>

              <div className="relative w-full aspect-[16/10] my-4">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  role="img"
                  aria-label="Minimalist architectural map of Saint-Jean-Cap-Ferrat and nearby coastal destinations"
                >
                  {/* Sea & Peninsula Stylized Coastal Contour */}
                  <rect x="0" y="0" width="100" height="100" fill="#E3DDD2" />
                  <path
                    d="M0,0 L100,0 L100,26 C84,22 76,26 68,36 C60,44 64,52 72,62 C76,68 70,74 61,72 C52,70 50,78 44,77 C37,75 38,54 32,46 C26,38 14,42 0,58 Z"
                    fill="#F7F4EF"
                    stroke="#C5BBA9"
                    strokeWidth="0.6"
                  />
                  {/* Subtle Topographic Hairlines */}
                  <path
                    d="M8,16 C28,14 48,18 72,12"
                    fill="none"
                    stroke="#D8D0C5"
                    strokeWidth="0.4"
                    strokeDasharray="1.5 1.5"
                  />
                  <path
                    d="M42,36 C48,46 52,58 49,68"
                    fill="none"
                    stroke="#D8D0C5"
                    strokeWidth="0.4"
                  />

                  {/* Active Route Line from Villa Vérone to Selected Pin */}
                  {!selectedPin.isEstate && (
                    <line
                      x1={originPin.x}
                      y1={originPin.y}
                      x2={selectedPin.x}
                      y2={selectedPin.y}
                      stroke="#9B8364"
                      strokeWidth="0.7"
                      strokeDasharray="1.5 1.2"
                    />
                  )}

                  {/* Interactive Pins */}
                  {LOCATION_PINS.map((pin) => {
                    const isSelected = pin.id === selectedPin.id;
                    return (
                      <g
                        key={pin.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedPinId(pin.id)}
                      >
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={pin.isEstate ? 2.6 : isSelected ? 2.2 : 1.5}
                          fill={pin.isEstate ? '#171614' : isSelected ? '#9B8364' : '#5A5650'}
                        />
                        {(pin.isEstate || isSelected) && (
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r={4.2}
                            fill="none"
                            stroke={pin.isEstate ? '#171614' : '#9B8364'}
                            strokeWidth="0.45"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="pt-4 border-t border-[#D8D0C5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5A5650]">
                <span>{selectedPin.description}</span>
                <span className="tabular-nums uppercase tracking-[0.14em] text-[#171614] shrink-0">
                  {selectedPin.distance}
                </span>
              </div>
            </div>

            {/* Destination Directory */}
            <div className="lg:col-span-5 divide-y divide-[#D8D0C5] border-y border-[#D8D0C5] flex flex-col justify-between">
              {LOCATION_PINS.map((pin) => {
                const isSelected = pin.id === selectedPin.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => setSelectedPinId(pin.id)}
                    className={`w-full text-left py-4 px-3 flex items-baseline justify-between gap-4 transition-colors ${
                      isSelected ? 'bg-[#EBE6DE]' : 'hover:bg-[#EBE6DE]/50'
                    }`}
                  >
                    <div>
                      <p className="font-serif text-2xl text-[#171614]">{pin.name}</p>
                      <p className="text-xs text-[#5A5650]">{pin.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-[#171614] tabular-nums">
                        {pin.travelTime}
                      </p>
                      <p className="text-xs text-[#9B8364] tabular-nums">{pin.distance}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
