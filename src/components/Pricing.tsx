import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

interface PricingPlan {
  name: string;
  badge?: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  featured?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    badge: 'Starter Plan',
    subtitle: 'Para pequeñas empresas en crecimiento',
    price: '$29',
    period: '/mes',
    buttonText: 'Comenzar 5 días gratis →',
    features: [
      'Hasta 3 subcuentas',
      '10 números de WhatsApp por subcuenta',
      'Mensajes ilimitados',
      'Whitelabel',
      'Soporte Premium',
      'Sin cobros ocultos',
      'Nodo para N8N',
      'Comunidad para Soporte'
    ]
  },
  {
    name: 'Master',
    badge: 'Más Popular',
    subtitle: 'Para empresas en expansión',
    price: '$297',
    period: '/mes',
    buttonText: 'Elegir Master Plan →',
    featured: true,
    features: [
      'Hasta 10 subcuentas',
      '20 números de WhatsApp por subcuenta',
      'Mensajes ilimitados',
      'Whitelabel',
      'Soporte Premium',
      'Sin cobros ocultos',
      'Nodo para N8N',
      'Comunidad para Soporte'
    ]
  },
  {
    name: 'Enterprise',
    badge: 'Enterprise',
    subtitle: 'Para operaciones de gran escala',
    price: '$397',
    period: '/mes',
    buttonText: 'Agendar demo →',
    features: [
      'Subcuentas ilimitadas',
      'Números ilimitados por subcuenta',
      'Mensajes ilimitados',
      'Whitelabel',
      'Soporte VIP',
      'Sin cobros ocultos',
      'Nodo para N8N',
      'Comunidad para Soporte'
    ]
  }
];

const Pricing = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            plans.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 200);
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
    <section id="pricing" ref={sectionRef} className="py-20 bg-gradient-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight">
            Elige el Plan Perfecto para tu Negocio
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sin sorpresas, sin costos ocultos. Paga una vez y aprovecha todo el poder de Enterprise
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
                plan.featured 
                  ? 'border-whatsapp scale-105 lg:scale-110' 
                  : 'border-gray-100 hover:border-whatsapp/20'
              } ${
                visibleCards.includes(index) ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.badge && (
                <div className="bg-gradient-whatsapp text-white px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider inline-block mb-6">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-8">{plan.subtitle}</p>

              <div className="mb-8">
                <span className="text-4xl font-black text-whatsapp">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <Button
                variant={plan.featured ? "whatsapp" : "whatsapp-outline"}
                className="w-full mb-8 h-12"
              >
                {plan.buttonText}
              </Button>

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-whatsapp/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-whatsapp text-sm font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;