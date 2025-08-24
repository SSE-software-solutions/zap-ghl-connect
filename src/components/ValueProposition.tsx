import { Button } from '@/components/ui/button';

const ValueProposition = () => {
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
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-12">
            {/* Stop Paying Section */}
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-whatsapp via-blue-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl">
                📱
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  ¡Deja de Pagar por Mensaje Enviado!
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Sabemos que comprar un número de teléfono para países que no son Estados Unidos puede ser un proceso difícil.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  No te preocupes por pagar por mensaje enviado. No necesitas usar Twilio o la API oficial de WhatsApp.
                </p>
              </div>
            </div>

            {/* QR Connection Section */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-black leading-tight">
                Conecta Cualquier Número de WhatsApp Escaneando un Código QR
              </h3>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">
                  Solo necesitarás escanear un código QR y conectar WhatsApp en tu teléfono, como lo haces normalmente para WhatsApp Web.
                </p>
                <p className="text-lg leading-relaxed">
                  Si tus representantes de ventas están en diferentes países, podrán usar sus teléfonos y números locales dando confianza a los prospectos.
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
                Obtén 5 Días de Prueba Gratis
                <span className="text-sm opacity-90 block">cancelar en cualquier momento - sin contratos</span>
              </Button>
            </div>
          </div>

          {/* Right Content - QR Code Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* QR Code Mockup */}
              <div className="w-64 h-64 bg-gradient-to-br from-whatsapp via-green-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-1 w-40 h-40">
                    {/* QR Code Pattern */}
                    {Array.from({ length: 64 }, (_, i) => (
                      <div
                        key={i}
                        className={`${
                          Math.random() > 0.5 ? 'bg-gray-900' : 'bg-transparent'
                        } rounded-sm`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-whatsapp rounded-full flex items-center justify-center text-white text-xl animate-bounce shadow-lg">
                ⚡
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