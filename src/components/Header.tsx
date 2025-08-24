import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-md shadow-lg' 
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-whatsapp rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-whatsapp">
              ⚡
            </div>
            <div className="text-2xl font-black text-whatsapp tracking-tight">
              QUICKZAP
            </div>
          </div>

          {/* CTA Button */}
          <Button
            variant="whatsapp"
            size="lg"
            onClick={() => scrollToSection('pricing')}
            className="shadow-whatsapp hover:shadow-whatsapp-hover"
          >
            Comenzar Gratis
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;