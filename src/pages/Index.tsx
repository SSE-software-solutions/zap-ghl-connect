import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
};

export default Index;
