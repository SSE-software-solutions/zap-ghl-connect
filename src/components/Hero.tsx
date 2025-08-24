import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ChatMockup from './ChatMockup';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const targetPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="min-h-screen pt-20 bg-gradient-hero">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className={`space-y-6 ${isVisible ? 'animate-slide-left' : 'opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                La nueva generación de integración{" "}
                <span className="text-gradient-whatsapp">WhatsApp para GHL</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                Conecta con <strong className="text-whatsapp">QR</strong>, maneja{" "}
                <strong className="text-whatsapp">+10 números por subcuenta</strong>,{" "}
                <strong className="text-whatsapp">mejores precios</strong>.
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 ${isVisible ? 'animate-slide-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <Button
                variant="hero"
                size="xl"
                onClick={() => scrollToSection('pricing')}
                className="shadow-whatsapp hover:shadow-whatsapp-hover"
              >
                Prueba Enterprise Ahora & Gratis!
              </Button>
            </div>

            <div className={`text-sm text-muted-foreground italic ${isVisible ? 'animate-slide-left' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              ¡Solicita tu prueba gratuita de 5 días!
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className={`${isVisible ? 'animate-slide-right animate-float' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <ChatMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;