export function Footer() {
  return (
    <footer className="bg-[#171614] text-[#F7F4EF] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/15">
          <div className="md:col-span-5 space-y-4">
            <p className="font-serif text-3xl md:text-4xl font-light tracking-[0.03em]">
              Villa Vérone
            </p>
            <p className="text-sm text-[#D8D0C5] max-w-sm leading-relaxed">
              Saint-Jean-Cap-Ferrat · Côte d’Azur. A monolithic architectural residence sculpted in Roman travertine, smoked cedar, and structural glass.
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center px-5 py-2.5 border border-[#B89F7D] text-[#F7F4EF] hover:bg-[#B89F7D] hover:text-[#171614] transition-colors text-xs tracking-[0.14em] uppercase"
              >
                Schedule Private Viewing
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs tracking-[0.18em] uppercase text-[#B89F7D] font-sans">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D8D0C5]">
              <li>
                <a href="#journey" className="hover:text-[#F7F4EF] transition-colors">
                  Residences &amp; 3D Journey
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-[#F7F4EF] transition-colors">
                  Architecture &amp; Overview
                </a>
              </li>
              <li>
                <a href="#lifestyle" className="hover:text-[#F7F4EF] transition-colors">
                  Lifestyle
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#F7F4EF] transition-colors">
                  Location
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F7F4EF] transition-colors">
                  Private Viewing
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs tracking-[0.18em] uppercase text-[#B89F7D] font-sans">
              Private Estate Desk
            </h3>
            <div className="space-y-2 text-sm text-[#D8D0C5]">
              <p>24 Boulevard du Général de Gaulle</p>
              <p>06230 Saint-Jean-Cap-Ferrat, France</p>
              <p className="pt-2 tabular-nums">+33 4 93 00 48 12</p>
              <p>private@villaverone.fr</p>
            </div>
            <div className="flex items-center gap-6 pt-3 text-xs tracking-[0.14em] uppercase text-[#D8D0C5]">
              <a href="#journey" className="hover:text-[#B89F7D] transition-colors">
                Architectural Monograph
              </a>
              <a href="#contact" className="hover:text-[#B89F7D] transition-colors">
                Press Dossier
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#A8A095]">
          <p>© 2026 Villa Vérone · Saint-Jean-Cap-Ferrat. All rights reserved.</p>
          <p>Architectural Specification &amp; Imagery for Private Presentation.</p>
        </div>
      </div>
    </footer>
  );
}
