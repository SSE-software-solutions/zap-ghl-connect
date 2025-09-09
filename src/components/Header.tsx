import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

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
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b6192fd9-a58b-4a50-bd2a-809422896d69.png" 
                alt="QuickZap Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-2xl font-black text-whatsapp tracking-tight">
              QUICKZAP
            </div>
          </div>

          {/* Language Selector and Action Buttons */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white"
            >
              Login
            </Button>
            <Button
              variant="whatsapp"
              size="lg"
              onClick={() => scrollToSection('pricing')}
              className="shadow-whatsapp hover:shadow-whatsapp-hover"
            >
              Comenzar Ahora
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;