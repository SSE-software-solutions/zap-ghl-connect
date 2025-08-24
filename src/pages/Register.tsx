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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Nombre Completo *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-12"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Corporativo *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-12"
                        placeholder="tu@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        Empresa *
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        className="h-12"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-12"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="whatsapp"
                      size="xl"
                      className="w-full h-14 text-lg font-bold shadow-whatsapp hover:shadow-whatsapp-hover"
                    >
                      Comenzar Prueba Gratuita 🚀
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
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
                </form>
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