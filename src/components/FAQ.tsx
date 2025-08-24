import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "¿QuickZap utiliza la API oficial de WhatsApp?",
    answer: "No, QuickZap no utiliza la API oficial de WhatsApp. Sin embargo, esto nos permite ofrecer una ventaja única: enviar mensajes ilimitados de WhatsApp con una tarifa plana, sin costos adicionales."
  },
  {
    question: "¿Cómo asegura QuickZap la seguridad y evita bloqueos o problemas de spam?",
    answer: "QuickZap ofrece medidas de seguridad para reducir el riesgo de bloqueos de número o problemas de spam. Puedes conectar hasta 10 números hasta números ilimitados dependiendo de tu plan adquirido en una sola subcuenta y cambiar fácilmente el número emisor. Además, nuestra función spintax te permite crear variaciones de mensajes, reduciendo las probabilidades de ser marcado como spam. Es importante señalar que, aunque existe un riesgo de bloqueo de números, nuestro grupo comunitario puede brindarte consejos valiosos para evitarlos."
  },
  {
    question: "¿Existe riesgo de que mi número sea bloqueado con QuickZap?",
    answer: "Sí, existe un riesgo de bloqueo ya que QuickZap no utiliza la API oficial de WhatsApp. Sin embargo, siguiendo buenas prácticas como calentar tu número y aprovechando los consejos y experiencias compartidos en nuestro grupo comunitario, puedes minimizar este riesgo y asegurar una estrategia de mensajería estable y exitosa."
  },
  {
    question: "¿Puede QuickZap integrarse con N8N para crear un bot fácilmente?",
    answer: "¡Absolutamente! QuickZap ofrece una integración con N8N, lo que te permite crear un bot de manera sencilla utilizando el poder de la IA de N8N."
  },
  {
    question: "¿Cómo funciona la pestaña de conversaciones en GHL con QuickZap?",
    answer: "Con QuickZap, la pestaña de conversaciones de GHL está diseñada para reemplazar la función de SMS. Aún puedes usar variables para recordatorios de citas, tal como lo harías en un flujo típico de SMS. La diferencia es que, en lugar de enviar un SMS, QuickZap envía un mensaje de WhatsApp, ofreciendo un canal más práctico y atractivo para tus clientes."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre QuickZap
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-to-r from-white to-whatsapp-light/5 border border-gray-200 rounded-2xl px-6 py-2 hover:border-whatsapp/20 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-whatsapp transition-colors duration-300 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-4 pb-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;