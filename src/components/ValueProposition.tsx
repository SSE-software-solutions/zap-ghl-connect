import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const ValueProposition = () => {
  const { t } = useLanguage();
  
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
    <section className="py-20 bg-white text-gray-900 relative">
      {/* WhatsApp Logo Decoration */}
      <div className="absolute top-20 left-8 opacity-10 hidden lg:block">
        <img 
          src="/lovable-uploads/d2e731f6-478a-41c5-9fb6-eeb251d8bef1.png" 
          alt="WhatsApp Logo" 
          className="w-32 h-32 object-contain"
        />
      </div>
      
      <div className="absolute bottom-20 right-8 opacity-10 hidden lg:block">
        <img 
          src="/lovable-uploads/d2e731f6-478a-41c5-9fb6-eeb251d8bef1.png" 
          alt="WhatsApp Logo" 
          className="w-24 h-24 object-contain transform rotate-12"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-12">
            {/* Stop Paying Section */}
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-whatsapp via-blue-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl relative">
                📱
                {/* Small WhatsApp logo on icon */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <img 
                    src="/lovable-uploads/d2e731f6-478a-41c5-9fb6-eeb251d8bef1.png" 
                    alt="WhatsApp" 
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight text-gray-900">
                  {t('value.stopPaying')}
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {t('value.stopPayingDesc1')}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('value.stopPayingDesc2')}
                </p>
              </div>
            </div>

            {/* QR Connection Section */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-black leading-tight text-gray-900">
                {t('value.connectTitle')}
              </h3>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg leading-relaxed">
                  {t('value.connectDesc1')}
                </p>
                <p className="text-lg leading-relaxed">
                  {t('value.connectDesc2')}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Button
                variant="hero"
                size="xl"
                onClick={() => scrollToSection('pricing')}
                className="bg-gradient-to-r from-blue-500 to-whatsapp hover:from-blue-600 hover:to-whatsapp-dark shadow-2xl hover:shadow-blue-500/25"
              >
                <div className="flex flex-col items-center">
                  <span>{t('value.cta')}</span>
                  <span className="text-sm opacity-90">{t('value.ctaSubtext')}</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Right Content - QR Code Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Real QR Code with styling */}
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                {/* QR Code Container with gradient background */}
                <div className="w-80 h-80 bg-gradient-to-br from-whatsapp via-green-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-2xl p-8">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center p-4">
                    <img 
                      src="/lovable-uploads/477492c2-560f-45bf-a930-3280b63eb02e.png" 
                      alt="Código QR para conectar WhatsApp con QuickZap" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-whatsapp rounded-full flex items-center justify-center shadow-lg">
                <img 
                  src="/lovable-uploads/d2e731f6-478a-41c5-9fb6-eeb251d8bef1.png" 
                  alt="WhatsApp" 
                  className="w-6 h-6 object-contain animate-bounce"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl animate-pulse shadow-lg">
                📲
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;