import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Residences', href: '#journey' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Lifestyle', href: '#lifestyle' },
  { label: 'Location', href: '#location' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? 'bg-[#F7F4EF] text-[#171614] border-b border-[#D8D0C5]'
          : 'bg-transparent text-[#F7F4EF]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-serif text-2xl md:text-[26px] tracking-[0.04em] font-normal whitespace-nowrap shrink-0"
        >
          Villa Vérone
        </a>

        {/* Zone 2: 5 Clean Single-Line Nav Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.08em] uppercase font-normal"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 whitespace-nowrap shrink-0 transition-opacity hover:opacity-75"
            >
              <span>{link.label}</span>
              <span
                aria-hidden="true"
                className={`absolute left-0 bottom-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                  scrolled ? 'bg-[#9B8364]' : 'bg-[#F7F4EF]'
                }`}
              />
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className={`hidden sm:inline-flex items-center px-5 py-2.5 text-xs tracking-[0.12em] uppercase transition-colors whitespace-nowrap shrink-0 border ${
              scrolled || mobileOpen
                ? 'border-[#171614] bg-[#171614] text-[#F7F4EF] hover:bg-[#2F2C28]'
                : 'border-[#F7F4EF]/60 bg-[#171614]/35 text-[#F7F4EF] hover:bg-[#F7F4EF] hover:text-[#171614]'
            }`}
          >
            Private Viewing
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 border border-current/25 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden bg-[#F7F4EF] text-[#171614] border-t border-[#D8D0C5] px-6 py-8 flex flex-col gap-5"
        >
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-baseline justify-between py-2 border-b border-[#D8D0C5]/70 font-serif text-2xl"
            >
              <span>{link.label}</span>
              <span className="text-xs font-sans tracking-[0.16em] text-[#9B8364] tabular-nums">
                0{idx + 1}
              </span>
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-flex items-center justify-center py-3.5 px-6 bg-[#171614] text-[#F7F4EF] text-xs tracking-[0.14em] uppercase"
          >
            Request Private Viewing
          </a>
        </nav>
      )}
    </header>
  );
}
