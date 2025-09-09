import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import PropertiesSection from '../components/PropertiesSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <PropertiesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
