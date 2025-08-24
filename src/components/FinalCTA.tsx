import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FinalCTA = () => {
  const navigate = useNavigate();
  
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
    <section className="py-20 bg-gradient-whatsapp text-white text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
            ¿Listo para Revolucionar tu Comunicación?
          </h2>
          
          <p className="text-xl md:text-2xl opacity-90 font-medium">
            Únete a miles de empresas que ya están usando QuickZap para transformar su atención al cliente
          </p>

          <div className="pt-4">
            <Button
              variant="hero-white"
              size="xl"
              onClick={() => navigate('/register')}
              className="shadow-xl hover:shadow-2xl"
            >
              Comenzar Prueba Gratuita
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;