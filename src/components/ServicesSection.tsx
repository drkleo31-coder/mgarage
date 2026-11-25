import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { buildWhatsAppUrl, SERVICES, type ServiceId } from '../utils/mgarage';

export function ServicesSection() {
  const [activeServiceId, setActiveServiceId] = useState<ServiceId>('polimento');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useReducedMotion();

  const activeService = SERVICES.find((s) => s.id === activeServiceId) ?? SERVICES[0];

  return (
    <section
      id="servicos"
      className="relative border-t border-white/10 bg-[#0B0B0E] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.26em] uppercase text-[#D4AF37]">
              Portfólio Exclusivo
            </p>
            <h2 className="font-display text-balance text-3xl font-semibold tracking-[0.04em] text-[#F8F7F4] sm:text-5xl">
              Quatro serviços essenciais.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#B5B0A6] sm:text-base">
            Selecione o serviço desejado para conhecer a abordagem visual ou solicitar seu atendimento direto pelo WhatsApp.
          </p>
        </div>

        {/* Interactive Quick Selector Bar */}
        <div
          role="tablist"
          aria-label="Selecionar serviço em destaque"
          className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/10 pb-6"
        >
          {SERVICES.map((service) => {
            const isSelected = service.id === activeServiceId;
            return (
              <button
                key={service.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveServiceId(service.id)}
                className={`inline-flex min-h-[42px] items-center gap-2 rounded-sm px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#060607] shadow-[0_6px_20px_rgba(212,175,55,0.22)]'
                    : 'border border-white/10 bg-[#131318] text-[#C7C3B8] hover:border-[#D4AF37]/50 hover:text-[#F8F7F4]'
                }`}
              >
                <span className="tabular-nums opacity-80">{service.index}</span>
                <span>{service.title}</span>
              </button>
            );
          })}
        </div>

        {/* Four Exclusive Services Editorial Grid */}
        <div
          data-testid="services-grid"
          className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {SERVICES.map((service, idx) => {
            const isActive = service.id === activeServiceId;
            const imgFailed = failedImages[service.id];

            return (
              <motion.article
                key={service.id}
                data-testid={`service-card-${service.id}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActiveServiceId(service.id)}
                className={`group relative flex flex-col overflow-hidden rounded-sm border bg-[#060607] transition-all duration-300 ${
                  isActive
                    ? 'border-[#D4AF37]/65 shadow-[0_24px_60px_rgba(0,0,0,0.75)]'
                    : 'border-white/10 hover:border-[#D4AF37]/45'
                }`}
              >
                {/* Media Container (4:3) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111115]">
                  {!imgFailed ? (
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [service.id]: true }))
                      }
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#16161B] to-[#08080A] p-6 text-center">
                      <ShieldCheck className="mb-3 h-10 w-10 text-[#D4AF37]" aria-hidden="true" />
                      <p className="font-display text-lg text-[#F8F7F4]">{service.title}</p>
                    </div>
                  )}

                  {/* Measured contrast scrim & metallic sheen */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060607] via-[#060607]/20 to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(120deg,transparent_25%,rgba(243,213,120,0.14)_50%,transparent_75%)]"
                  />

                  <span className="font-display absolute top-5 left-5 text-sm font-semibold tracking-[0.22em] text-[#F3D578] tabular-nums">
                    {service.index}
                  </span>
                </div>

                {/* Card Copy & Contextual WhatsApp CTA */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[0.04em] text-[#F8F7F4] sm:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-[#C7C3B8]">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <a
                      href={buildWhatsAppUrl(service.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Solicitar orçamento de ${service.title} pelo WhatsApp`}
                      className="btn-metallic-sweep inline-flex min-h-[44px] items-center gap-2.5 rounded-sm border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-5 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#F3D578] transition-all duration-200 hover:bg-[#D4AF37] hover:text-[#060607] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Solicitar {service.title}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Active Service Summary Strip */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-sm border border-[#D4AF37]/25 bg-[#060607] p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
              Serviço em foco · {activeService.index}
            </p>
            <p className="mt-1 text-base font-medium text-[#F8F7F4]">
              {activeService.title} — <span className="text-[#C7C3B8]">{activeService.description}</span>
            </p>
          </div>
          <a
            href={buildWhatsAppUrl(activeService.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-metallic-sweep inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-[#D4AF37] px-6 py-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#060607] transition-colors hover:bg-[#E2BE53] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D578]"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Orçamento para {activeService.title}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
