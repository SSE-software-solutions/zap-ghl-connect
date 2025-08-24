import { useEffect, useRef, useState } from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
  logo?: string;
}

const features: Feature[] = [
  {
    icon: '📱',
    title: 'Números Ilimitados por Subcuenta GHL',
    description: 'Conecta todos los números de WhatsApp que necesites sin restricciones. Perfecta escalabilidad para agencias y empresas grandes.'
  },
  {
    icon: '🔗',
    title: 'Nodo para N8N',
    description: 'Integración completa con N8N para crear flujos de automatización avanzados. Conecta QuickZap con cientos de aplicaciones y servicios.',
    logo: '/lovable-uploads/a0c1ddc7-6695-4255-98dc-100eed627db9.png'
  },
  {
    icon: '🎨',
    title: 'Dashboard White Label',
    description: 'Personaliza completamente el dashboard con tu marca, colores y logo. Ofrece la solución a tus clientes bajo tu propia identidad.'
  },
  {
    icon: '💬',
    title: 'Mensajes Ilimitados de WhatsApp',
    description: 'Envía todos los mensajes que necesites sin límites ni restricciones. Comunícate libremente con tus clientes y prospects.'
  },
  {
    icon: '🤖',
    title: 'Chats de WhatsApp en la Pestaña',
    description: 'Escanea el código QR, conecta tu teléfono y todos verán las mismas conversaciones en tiempo real. Todos los chats de WhatsApp en un lugar para todo tu equipo de ventas.'
  }
];

const Features = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the animation of feature cards
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight">
            Libera el Poder de la Automatización con{' '}
            <span className="text-gradient-whatsapp">QuickZap</span>
          </h2>
          <p className="text-xl text-whatsapp font-semibold max-w-4xl mx-auto">
            Simplifica, Conecta y Convierte: La revolución en comunicación empresarial está aquí
          </p>
        </div>

        {/* Featured Cards - First 3 features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {features.slice(0, 3).map((feature, index) => (
            <div
              key={index}
              className={`group bg-white p-8 rounded-3xl border border-gray-100 hover:border-whatsapp/20 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 ${
                visibleCards.includes(index) ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center mb-6">
                <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.logo ? (
                    <div className="flex items-center justify-center h-20">
                      <img 
                        src={feature.logo} 
                        alt={`${feature.title} Logo`} 
                        className="h-16 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-5xl mb-4">
                      {feature.icon}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-gray-900 leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Centered Main Features - Last 2 features */}
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {features.slice(3).map((feature, index) => (
            <div
              key={index + 3}
              className={`group bg-gradient-to-br from-white to-whatsapp-light/10 p-10 rounded-3xl border-2 border-whatsapp/10 hover:border-whatsapp/30 transition-all duration-500 hover:shadow-whatsapp/20 hover:shadow-2xl hover:-translate-y-3 ${
                visibleCards.includes(index + 3) ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
            <div className="text-center">
              <div className="relative mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.logo ? (
                  <div className="flex items-center justify-center h-24">
                    <img 
                      src={feature.logo} 
                      alt={`${feature.title} Logo`} 
                      className="h-20 object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-6xl mb-6">
                    {feature.icon}
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-black mb-6 text-gray-900 leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;