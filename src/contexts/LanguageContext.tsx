import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    // Header
    'header.cta': 'Comenzar Gratis',
    
    // Hero
    'hero.title': 'La nueva generación de integración',
    'hero.titleHighlight': 'WhatsApp para GHL',
    'hero.subtitle': 'Conecta con QR, maneja +10 números por subcuenta, mejores precios.',
    'hero.cta': 'Prueba QuickZap Ahora & Gratis!',
    'hero.trial': '¡Solicita tu prueba gratuita de 5 días!',
    
    // Chat Mockup
    'chat.contact': 'Cliente Potencial',
    'chat.online': 'en línea',
    'chat.message1': '¡Hola! Me interesa su producto',
    'chat.message2': '¡Perfecto! Te ayudo ahora mismo 😊',
    'chat.message3': '¿Cuáles son los precios?',
    'chat.message4': 'Te envío toda la información completa...',
    
    // Value Proposition
    'value.stopPaying': '¡Deja de Pagar por Mensaje Enviado!',
    'value.stopPayingDesc1': 'Sabemos que comprar un número de teléfono para países que no son Estados Unidos puede ser un proceso difícil.',
    'value.stopPayingDesc2': 'No te preocupes por pagar por mensaje enviado. No necesitas usar Twilio o la API oficial de WhatsApp.',
    'value.connectTitle': 'Conecta Cualquier Número de WhatsApp Escaneando un Código QR',
    'value.connectDesc1': 'Solo necesitarás escanear un código QR y conectar WhatsApp en tu teléfono, como lo haces normalmente para WhatsApp Web.',
    'value.connectDesc2': 'Si tus representantes de ventas están en diferentes países, podrán usar sus teléfonos y números locales dando confianza a los prospectos.',
    'value.cta': 'Obtén 5 Días de Prueba Gratis',
    'value.ctaSubtext': 'cancelar en cualquier momento - sin contratos',
    
    // Features
    'features.title': 'Libera el Poder de la Automatización con',
    'features.subtitle': 'Simplifica, Conecta y Convierte: La revolución en comunicación empresarial está aquí',
    'features.unlimited.title': 'Números Ilimitados por Subcuenta GHL',
    'features.unlimited.desc': 'Conecta todos los números de WhatsApp que necesites sin restricciones. Perfecta escalabilidad para agencias y empresas grandes.',
    'features.n8n.title': 'Nodo para N8N',
    'features.n8n.desc': 'Integración completa con N8N para crear flujos de automatización avanzados. Conecta QuickZap con cientos de aplicaciones y servicios.',
    'features.whitelabel.title': 'Dashboard White Label',
    'features.whitelabel.desc': 'Personaliza completamente el dashboard con tu marca, colores y logo. Ofrece la solución a tus clientes bajo tu propia identidad.',
    'features.messages.title': 'Mensajes Ilimitados de WhatsApp',
    'features.messages.desc': 'Envía todos los mensajes que necesites sin límites ni restricciones. Comunícate libremente con tus clientes y prospects.',
    'features.chats.title': 'Chats de WhatsApp en la Pestaña',
    'features.chats.desc': 'Escanea el código QR, conecta tu teléfono y todos verán las mismas conversaciones en tiempo real. Todos los chats de WhatsApp en un lugar para todo tu equipo de ventas.',
    
    // Pricing
    'pricing.title': 'Elige el Plan Perfecto para tu Negocio',
    'pricing.subtitle': 'Sin sorpresas, sin costos ocultos. Paga una vez y aprovecha todo el poder de QuickZap',
    'pricing.starter.badge': 'Starter Plan',
    'pricing.starter.subtitle': 'Para pequeñas empresas en crecimiento',
    'pricing.starter.cta': 'Comenzar 5 días gratis →',
    'pricing.master.badge': 'Más Popular',
    'pricing.master.subtitle': 'Para empresas en expansión',
    'pricing.master.cta': 'Elegir Master Plan →',
    'pricing.enterprise.badge': 'Enterprise',
    'pricing.enterprise.subtitle': 'Para operaciones de gran escala',
    'pricing.enterprise.cta': 'Agendar demo →',
    
    // FAQ
    'faq.title': 'Preguntas Frecuentes',
    'faq.subtitle': 'Resolvemos las dudas más comunes sobre QuickZap',
    
    // Final CTA
    'finalCta.title': '¿Listo para Revolucionar tu Comunicación?',
    'finalCta.subtitle': 'Únete a miles de empresas que ya están usando QuickZap para transformar su atención al cliente',
    'finalCta.button': 'Comenzar Prueba Gratuita',
    
    // Footer
    'footer.copyright': '© 2025 QuickZap. La revolución en integración WhatsApp para GoHighLevel.',
    'footer.support': 'Soporte:',
    'footer.whatsapp': 'WhatsApp:',
  },
  en: {
    // Header
    'header.cta': 'Start Free',
    
    // Hero
    'hero.title': 'The new generation of',
    'hero.titleHighlight': 'WhatsApp integration for GHL',
    'hero.subtitle': 'Connect with QR, manage +10 numbers per subaccount, better prices.',
    'hero.cta': 'Try QuickZap Now & Free!',
    'hero.trial': 'Request your 5-day free trial!',
    
    // Chat Mockup
    'chat.contact': 'Potential Client',
    'chat.online': 'online',
    'chat.message1': 'Hello! I\'m interested in your product',
    'chat.message2': 'Perfect! I\'ll help you right now 😊',
    'chat.message3': 'What are the prices?',
    'chat.message4': 'I\'ll send you all the complete information...',
    
    // Value Proposition
    'value.stopPaying': 'Stop Paying Per Message Sent!',
    'value.stopPayingDesc1': 'We know that buying a phone number for countries that are not the United States can be a difficult process.',
    'value.stopPayingDesc2': 'Don\'t worry about paying per message sent. No need to use Twilio or the official WhatsApp API.',
    'value.connectTitle': 'Connect Any WhatsApp Number by Scanning a QR Code',
    'value.connectDesc1': 'You\'ll just need to scan a QR code and connect WhatsApp on your phone, as you usually do for WhatsApp Web.',
    'value.connectDesc2': 'If your sales reps are in different countries, they\'ll be able to use their phones and local numbers giving confidence to the leads.',
    'value.cta': 'Get 5 Day Free Trial',
    'value.ctaSubtext': 'cancel anytime - no contracts',
    
    // Features
    'features.title': 'Unleash the Power of Automation with',
    'features.subtitle': 'Simplify, Connect and Convert: The revolution in business communication is here',
    'features.unlimited.title': 'Unlimited Numbers per GHL Subaccount',
    'features.unlimited.desc': 'Connect all the WhatsApp numbers you need without restrictions. Perfect scalability for agencies and large companies.',
    'features.n8n.title': 'Node for N8N',
    'features.n8n.desc': 'Complete integration with N8N to create advanced automation flows. Connect QuickZap with hundreds of applications and services.',
    'features.whitelabel.title': 'White Label Dashboard',
    'features.whitelabel.desc': 'Completely customize the dashboard with your brand, colors and logo. Offer the solution to your clients under your own identity.',
    'features.messages.title': 'Unlimited WhatsApp Messages',
    'features.messages.desc': 'Send all the messages you need without limits or restrictions. Communicate freely with your clients and prospects.',
    'features.chats.title': 'WhatsApp Chats in Tab',
    'features.chats.desc': 'Scan the QR code, connect your phone and everyone will see the same conversations in real time. All WhatsApp chats in one place for your entire sales team.',
    
    // Pricing
    'pricing.title': 'Choose the Perfect Plan for Your Business',
    'pricing.subtitle': 'No surprises, no hidden costs. Pay once and harness all the power of QuickZap',
    'pricing.starter.badge': 'Starter Plan',
    'pricing.starter.subtitle': 'For growing small businesses',
    'pricing.starter.cta': 'Start 5 days free →',
    'pricing.master.badge': 'Most Popular',
    'pricing.master.subtitle': 'For expanding businesses',
    'pricing.master.cta': 'Choose Master Plan →',
    'pricing.enterprise.badge': 'Enterprise',
    'pricing.enterprise.subtitle': 'For large-scale operations',
    'pricing.enterprise.cta': 'Schedule demo →',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'We solve the most common questions about QuickZap',
    
    // Final CTA
    'finalCta.title': 'Ready to Revolutionize Your Communication?',
    'finalCta.subtitle': 'Join thousands of companies already using QuickZap to transform their customer service',
    'finalCta.button': 'Start Free Trial',
    
    // Footer
    'footer.copyright': '© 2025 QuickZap. The revolution in WhatsApp integration for GoHighLevel.',
    'footer.support': 'Support:',
    'footer.whatsapp': 'WhatsApp:',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};