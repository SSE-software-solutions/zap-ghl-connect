import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { WhopCheckoutEmbed } from '@whop/react/checkout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Register = () => {
  const { t } = useLanguage();

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
                <WhopCheckoutEmbed planId="plan_GuRmD70Tb9Pj0" />

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
    </main>
  );
};

export default Register;