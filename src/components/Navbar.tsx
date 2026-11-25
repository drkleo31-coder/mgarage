import { useEffect, useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/mgarage';

const NAV_LINKS = [
  { href: '#apresentacao', label: 'Apresentação' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#estudio-3d', label: 'Estúdio 3D' },
  { href: '#orcamento', label: 'Orçamento' },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? 'bg-[#060607]/95 border-b border-[#D4AF37]/20'
          : 'bg-gradient-to-b from-[#060607]/85 to-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#inicio"
          onClick={closeMenu}
          className="font-display text-lg font-semibold tracking-[0.16em] text-[#F8F7F4] whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          <span className="gold-gradient-text">M</span> GARAGE
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 text-sm font-medium text-[#D6D3CD] transition-colors duration-200 hover:text-[#F8F7F4] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary CTA + Mobile drawer toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-metallic-sweep hidden sm:inline-flex items-center gap-2 rounded-sm border border-[#D4AF37]/60 bg-[#D4AF37] px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase text-[#060607] transition-all duration-200 hover:bg-[#E2BE53] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D578]"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 bg-[#0B0B0E] text-[#F8F7F4] transition-colors hover:border-[#D4AF37]/60 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Menu móvel"
          className="border-t border-[#D4AF37]/20 bg-[#060607] px-4 py-5 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex min-h-[44px] items-center justify-between border-b border-white/5 py-2 text-base font-medium text-[#E5E2DC] transition-colors hover:text-[#D4AF37]"
              >
                <span>{link.label}</span>
              </a>
            ))}
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mt-2 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-sm bg-[#D4AF37] px-5 py-3 text-xs font-bold tracking-[0.12em] uppercase text-[#060607]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
