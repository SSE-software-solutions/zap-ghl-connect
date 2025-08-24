import { useEffect, useRef, useState } from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
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
    description: 'Integración completa con N8N para crear flujos de automatización avanzados. Conecta QuickZap con cientos de aplicaciones y servicios.'
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-white p-8 rounded-3xl border border-gray-100 hover:border-whatsapp/20 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 ${
                visibleCards.includes(index) ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-gray-900 leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;