import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

export function GoldParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const pointer = { x: width * 0.5, y: height * 0.4, active: false };
    const count = width < 768 ? 24 : 44;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.12 - Math.random() * 0.25,
      size: 0.9 + Math.random() * 1.9,
      alpha: 0.18 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
    }));

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 193, 88, ${p.alpha * 0.6})`;
        ctx.fill();
      }
    };

    if (prefersReducedMotion) {
      drawStatic();
      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pointermove', onPointerMove);
      };
    }

    let rafId = 0;
    let tick = 0;

    const render = () => {
      tick += 0.015;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 32000 && distSq > 16) {
            const force = (1 - distSq / 32000) * 0.018;
            p.x += dx * force;
            p.y += dy * force;
          }
        }

        p.x += p.vx + Math.sin(tick + p.phase) * 0.12;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const twinkle = 0.65 + 0.35 * Math.sin(tick * 2 + p.phase);
        const a = p.alpha * twinkle;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.2);
        grad.addColorStop(0, `rgba(246, 223, 144, ${a})`);
        grad.addColorStop(0.45, `rgba(212, 175, 55, ${a * 0.45})`);
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full opacity-75"
    />
  );
}
