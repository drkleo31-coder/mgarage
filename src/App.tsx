import { MotionConfig } from 'motion/react';
import { GoldParticlesCanvas } from './components/GoldParticlesCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrandPresentation } from './components/BrandPresentation';
import { ServicesSection } from './components/ServicesSection';
import { InteractiveCar3D } from './components/InteractiveCar3D';
import { QuoteSection } from './components/QuoteSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#060607] text-[#F8F7F4]">
        <GoldParticlesCanvas />
        <Navbar />
        <main className="relative z-20">
          <HeroSection />
          <BrandPresentation />
          <ServicesSection />
          <InteractiveCar3D />
          <QuoteSection />
        </main>
        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </MotionConfig>
  );
}
