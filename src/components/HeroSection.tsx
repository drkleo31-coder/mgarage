import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from '../utils/mgarage';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#060607] pt-16"
    >
      {/* Background Video Layer */}
      <motion.div
        style={prefersReducedMotion ? undefined : { scale: videoScale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <video
          data-testid="hero-video"
          poster="/assets/aistudio/hero-poster.jpg"
          className="h-full w-full object-cover object-center brightness-[0.82] contrast-[1.08]"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/assets/aistudio/hero-bg.mp4" type="video/mp4" />
          <source src="/assets/aistudio/snapinsta-1795644531939_9eb52ef4.mov" type="video/quicktime" />
        </video>
      </motion.div>

      {/* Multi-stop cinematic dark scrims + smooth transition into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#060607]/65 via-[#060607]/25 to-[#060607]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_46%,rgba(6,6,7,0.28)_0%,rgba(6,6,7,0.58)_62%,rgba(6,6,7,0.92)_100%)]"
      />

      {/* Hero Foreground Content */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
      >
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 sm:mb-8"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28)_0%,transparent_70%)] blur-xl"
          />
          <img
            src="/assets/aistudio/IMG_5647_53d29c7d.png"
            alt="Emblema oficial M Garage Estética Automotiva"
            className="relative h-32 w-32 rounded-full border border-[#D4AF37]/40 object-cover shadow-[0_0_48px_rgba(212,175,55,0.24)] sm:h-40 sm:w-40"
          />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 text-xs font-medium tracking-[0.28em] uppercase text-[#E2BE53] sm:text-sm"
        >
          Estética Automotiva
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-display max-w-4xl text-balance text-4xl font-semibold tracking-[0.06em] text-[#F8F7F4] sm:text-6xl lg:text-7xl"
        >
          <span className="gold-gradient-text">M GARAGE</span>
        </motion.h1>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-xl text-base leading-relaxed text-[#E3E0D8] sm:text-lg"
        >
          Cuidado técnico, brilho profundo e proteção de alto padrão para valorizar cada linha do seu veículo.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
        >
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-metallic-sweep inline-flex min-h-[48px] items-center justify-center gap-3 rounded-sm bg-[#D4AF37] px-8 py-3.5 text-sm font-bold tracking-[0.1em] uppercase text-[#060607] shadow-[0_12px_36px_rgba(212,175,55,0.28)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#E2BE53] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D578]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Agendar pelo WhatsApp</span>
          </a>

          <a
            href="#servicos"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-white/20 bg-[#0B0B0E]/75 px-7 py-3.5 text-sm font-medium tracking-[0.06em] text-[#F8F7F4] transition-colors duration-200 hover:border-[#D4AF37]/60 hover:text-[#F3D578] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <span>Explorar serviços</span>
          </a>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-8 flex items-center gap-3 text-xs tracking-[0.16em] text-[#B8B4AA]"
        >
          <span>Atendimento direto</span>
          <span aria-hidden="true" className="text-[#D4AF37]">·</span>
          <span className="tabular-nums text-[#E5E2DC]">{WHATSAPP_DISPLAY}</span>
        </motion.div>
      </motion.div>

      {/* Bottom smooth section transition & scroll cue */}
      <a
        href="#apresentacao"
        aria-label="Rolar para apresentação da M Garage"
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#060607]/60 text-[#D4AF37] transition-colors hover:border-[#D4AF37] hover:text-[#F3D578] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}
