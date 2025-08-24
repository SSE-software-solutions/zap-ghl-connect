import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Register = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se implementaría la lógica de registro
    console.log('Datos del formulario:', formData);
  };

  return (
    <main className="min-h-screen bg-gradient-hero">
      <Header />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                Comienza tu <span className="text-gradient-whatsapp">Prueba Gratuita</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                5 días completamente gratis. Sin tarjeta de crédito requerida.
              </p>
            </div>

            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
                <CardDescription className="text-lg">
                  Completa tus datos para comenzar
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div
                  id="whop-embedded-checkout"
                  data-whop-checkout-plan-id="plan_GuRmD70Tb9Pj0"
                  data-whop-checkout-theme="light"
                  data-whop-checkout-hide-price="false"
                  style={{ height: 'fit-content', overflow: 'hidden', maxWidth: '560px', margin: '0 auto' }}
                ></div>

                <div className="text-center text-sm text-muted-foreground mt-6">
                  <p>
                    Al registrarte, aceptas nuestros{' '}
                    <a href="#" className="text-whatsapp hover:underline">
                      Términos de Servicio
                    </a>{' '}
                    y{' '}
                    <a href="#" className="text-whatsapp hover:underline">
                      Política de Privacidad
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 text-center">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-whatsapp/10 rounded-full flex items-center justify-center">
                    <span className="text-whatsapp text-xl">✓</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">5 días gratis</p>
                    <p className="text-sm text-muted-foreground">Sin compromisos</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-whatsapp/10 rounded-full flex items-center justify-center">
                    <span className="text-whatsapp text-xl">🔒</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">100% Seguro</p>
                    <p className="text-sm text-muted-foreground">Datos protegidos</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-whatsapp/10 rounded-full flex items-center justify-center">
                    <span className="text-whatsapp text-xl">⚡</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Activación inmediata</p>
                    <p className="text-sm text-muted-foreground">Listo en minutos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.onCheckoutComplete = function(planId, receiptId) {
              console.log("Checkout completado:", planId, receiptId);
              window.location.href = "https://www.uscaleup.ai/";
            };
          `
        }}
      />
    </main>
  );
};

export default Register;