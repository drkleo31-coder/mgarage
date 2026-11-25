import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, SERVICES, WHATSAPP_DISPLAY } from '../utils/mgarage';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#D4AF37]/20 bg-[#050506] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
          {/* Brand Identity */}
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/IMG_5647_53d29c7d.png"
              alt="M Garage Estética Automotiva"
              className="h-16 w-16 rounded-full border border-[#D4AF37]/40 object-cover"
            />
            <div>
              <p className="font-display text-lg font-semibold tracking-[0.14em] text-[#F8F7F4]">
                <span className="gold-gradient-text">M</span> GARAGE
              </p>
              <p className="mt-1 text-xs tracking-[0.18em] uppercase text-[#A9A59B]">
                Estética Automotiva
              </p>
            </div>
          </div>

          {/* Site Navigation & Services */}
          <nav
            aria-label="Links do rodapé"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#B5B0A6]"
          >
            <a href="#inicio" className="transition-colors hover:text-[#F3D578]">
              Início
            </a>
            <a href="#apresentacao" className="transition-colors hover:text-[#F3D578]">
              Apresentação
            </a>
            <a href="#servicos" className="transition-colors hover:text-[#F3D578]">
              Serviços
            </a>
            <a href="#estudio-3d" className="transition-colors hover:text-[#F3D578]">
              Estúdio 3D
            </a>
            <a href="#orcamento" className="transition-colors hover:text-[#F3D578]">
              Orçamento
            </a>
          </nav>

          {/* Direct WhatsApp Contact */}
          <div>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-sm border border-[#D4AF37]/45 bg-[#0B0B0E] px-5 py-2.5 text-sm font-semibold text-[#F3D578] transition-colors hover:bg-[#D4AF37] hover:text-[#060607] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="tabular-nums">{WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[#8C887E] sm:flex-row sm:items-center">
          <p>© {year} M Garage Estética Automotiva. Todos os direitos reservados.</p>
          <p className="tracking-wide">
            {SERVICES.map((s) => s.title).join(' · ')}
          </p>
        </div>
      </div>
    </footer>
  );
}
