import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const CRAFT_PRINCIPLES = [
  {
    index: '01',
    title: 'Identidade Exclusiva',
    text: 'Cada veículo recebe atenção individualizada, respeitando texturas, curvas e acabamentos originais.',
  },
  {
    index: '02',
    title: 'Precisão nos Detalhes',
    text: 'Da lavagem completa à remoção de imperfeições, cada etapa é executada com rigor técnico.',
  },
  {
    index: '03',
    title: 'Valorização Real',
    text: 'Produtos de alta qualidade selecionados para proteger e preservar a presença do seu carro.',
  },
] as const;

export function BrandPresentation() {
  const containerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const emblemY = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const headlineX = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  return (
    <section
      id="apresentacao"
      ref={containerRef}
      className="relative overflow-hidden border-t border-[#D4AF37]/15 bg-[#060607] py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial Typography Column */}
          <div className="lg:col-span-7">
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 text-xs font-semibold tracking-[0.26em] uppercase text-[#D4AF37]"
            >
              M Garage Estética Automotiva
            </motion.p>

            <motion.h2
              style={prefersReducedMotion ? undefined : { x: headlineX }}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-balance text-3xl font-semibold leading-[1.15] tracking-[0.03em] text-[#F8F7F4] sm:text-5xl"
            >
              Presença impecável em cada reflexo e acabamento.
            </motion.h2>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-[#C7C3B8] sm:text-lg"
            >
              Na M Garage, a estética automotiva une técnica refinada, iluminação de inspeção e produtos de alta performance para devolver profundidade ao brilho e preservar o interior e o exterior do seu veículo.
            </motion.p>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
              {CRAFT_PRINCIPLES.map((item, idx) => (
                <motion.div
                  key={item.index}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-2"
                >
                  <span className="font-display block text-xs tracking-[0.2em] text-[#D4AF37] tabular-nums">
                    {item.index}
                  </span>
                  <h3 className="font-sans text-sm font-semibold tracking-wide text-[#F8F7F4]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#9E9A90]">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Parallax Brand Crest Showcase */}
          <div className="lg:col-span-5">
            <motion.div
              style={prefersReducedMotion ? undefined : { y: emblemY }}
              className="gold-shimmer-border relative mx-auto max-w-md overflow-hidden rounded-sm bg-[#0B0B0E] p-8 sm:p-10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.2)_0%,transparent_70%)]"
              />
              <div className="relative flex flex-col items-center text-center">
                <img
                  src="/assets/aistudio/IMG_5647_53d29c7d.png"
                  alt="Logo M Garage Estética Automotiva em preto e dourado metálico"
                  className="h-52 w-52 rounded-full border border-[#D4AF37]/30 object-cover shadow-[0_20px_50px_rgba(0,0,0,0.85)] sm:h-60 sm:w-60"
                />
                <div className="mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                <p className="font-display mt-5 text-sm tracking-[0.22em] uppercase text-[#E2BE53]">
                  Padrão M Garage
                </p>
                <p className="mt-2 text-sm text-[#A9A59B]">
                  Lavagem · Higienização · Polimento · Proteção
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
