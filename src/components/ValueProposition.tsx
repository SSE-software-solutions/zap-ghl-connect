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
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-12">
            {/* Stop Paying Section */}
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-whatsapp via-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 relative">
                  📱
                  {/* WhatsApp badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                    <img 
                      src="/lovable-uploads/aeac0860-1a6f-4d0e-a68d-cd9400af9e04.png" 
                      alt="WhatsApp" 
                      className="w-3.5 h-3.5 object-contain"
                    />
                  </div>
                </div>
                
                <div className="flex-1 flex items-center gap-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-gray-900">
                    {t('value.stopPaying')}
                  </h2>
                  
                  {/* WhatsApp Logo al costado - MÁS GRANDE */}
                  <div className="flex-shrink-0 hidden md:block">
                    <img 
                      src="/lovable-uploads/aeac0860-1a6f-4d0e-a68d-cd9400af9e04.png" 
                      alt="WhatsApp Logo" 
                      className="w-24 h-24 lg:w-32 lg:h-32 object-contain opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pl-22">
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('value.stopPayingDesc1')}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('value.stopPayingDesc2')}
                </p>
              </div>
            </div>

            {/* QR Connection Section */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-gray-900">
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
            <div className="pt-4">
              <Button
                variant="hero"
                size="xl"
                onClick={() => scrollToSection('pricing')}
                className="bg-gradient-to-r from-whatsapp to-green-500 hover:from-green-600 hover:to-whatsapp shadow-xl hover:shadow-2xl hover:shadow-whatsapp/30 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-bold">{t('value.cta')}</span>
                  <span className="text-sm opacity-90 font-medium">{t('value.ctaSubtext')}</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Right Content - QR Code Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              {/* QR Code Container with enhanced styling */}
              <div className="relative transform group-hover:scale-105 transition-all duration-500">
                <div className="w-80 h-80 bg-gradient-to-br from-whatsapp via-green-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-2xl p-6 relative overflow-hidden">
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-white/5 rounded-3xl"></div>
                  
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center p-4 relative z-10 shadow-inner">
                    <img 
                      src="/lovable-uploads/477492c2-560f-45bf-a930-3280b63eb02e.png" 
                      alt="Código QR para conectar WhatsApp con QuickZap" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Corner accent */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full backdrop-blur-sm"></div>
                </div>
              </div>
              
              {/* Enhanced floating elements */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-whatsapp rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
                <img 
                  src="/lovable-uploads/d2e731f6-478a-41c5-9fb6-eeb251d8bef1.png" 
                  alt="WhatsApp" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              
              <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl animate-pulse shadow-xl border-4 border-white">
                📲
              </div>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-whatsapp/20 via-transparent to-blue-500/20 rounded-3xl blur-xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;