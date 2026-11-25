import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Copy, MessageCircle } from 'lucide-react';
import {
  buildWhatsAppUrl,
  SERVICES,
  WHATSAPP_DISPLAY,
  type ServiceId,
} from '../utils/mgarage';

export function QuoteSection() {
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceId>('polimento');
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) ?? SERVICES[0];

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_DISPLAY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="orcamento"
      className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0E] py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.12)_0%,transparent_65%)]"
      />

      <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="gold-shimmer-border rounded-sm bg-[#060607] p-6 sm:p-12 lg:p-14"
        >
          <div className="text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.26em] uppercase text-[#D4AF37]">
              Orçamento Personalizado
            </p>
            <h2 className="font-display text-balance text-3xl font-semibold tracking-[0.04em] text-[#F8F7F4] sm:text-5xl">
              Solicite seu atendimento na M Garage.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#C7C3B8]">
              Escolha o serviço desejado abaixo para iniciar a conversa no WhatsApp com a mensagem já preparada para o seu veículo.
            </p>
          </div>

          {/* Service Selector Buttons (Strictly the 4 services) */}
          <div
            role="radiogroup"
            aria-label="Escolha um serviço para orçamento"
            className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {SERVICES.map((service) => {
              const isSelected = service.id === selectedServiceId;
              return (
                <button
                  key={service.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`flex min-h-[76px] flex-col items-start justify-between rounded-sm border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37]/12 shadow-[0_8px_24px_rgba(212,175,55,0.15)]'
                      : 'border-white/10 bg-[#0E0E12] hover:border-[#D4AF37]/45'
                  }`}
                >
                  <span className="font-display text-[11px] tracking-[0.2em] text-[#D4AF37] tabular-nums">
                    {service.index}
                  </span>
                  <span className="mt-1 font-display text-base font-semibold text-[#F8F7F4]">
                    {service.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Preview of automatic message & Primary WhatsApp Conversion CTA */}
          <div className="mt-8 rounded-sm border border-white/10 bg-[#0B0B0E] p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A9A59B]">
              Mensagem automática selecionada
            </p>
            <p
              data-testid="quote-message-preview"
              className="mt-2 text-sm leading-relaxed text-[#E5E2DC] sm:text-base"
            >
              “{selectedService.whatsappMessage}”
            </p>

            <div className="mt-6 flex flex-col items-stretch justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#B5B0A6]">
                  WhatsApp:{' '}
                  <strong className="font-semibold tabular-nums text-[#F8F7F4]">
                    {WHATSAPP_DISPLAY}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  aria-label="Copiar número de WhatsApp"
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-sm border border-white/15 px-3 py-1.5 text-xs text-[#D6D3CD] transition-colors hover:border-[#D4AF37]/60 hover:text-[#F3D578] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <a
                data-testid="quote-whatsapp-cta"
                href={buildWhatsAppUrl(selectedService.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-metallic-sweep inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-sm bg-[#D4AF37] px-8 py-3.5 text-xs font-bold tracking-[0.12em] uppercase text-[#060607] shadow-[0_12px_32px_rgba(212,175,55,0.28)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#E2BE53] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D578]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Solicitar {selectedService.title}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
