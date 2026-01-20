import { ArrowRight, Star } from 'lucide-react';
import heroImage from '@/assets/hero-luxury-home.jpg';

const HeroSection = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image - Fixed for desktop, scroll for mobile (iOS fix) */}
      <div 
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary/50 dark:from-background/80 dark:to-background/60" />
      
      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-accent fill-current" />
            <span className="text-white/90 font-medium">Corretora de Confiança</span>
          </div>

          {/* Main Heading */}
          <h1 className="heading-hero mb-6">
            A chave para o seu{' '}
            <span className="bg-gradient-to-r from-accent to-crystal-accent bg-clip-text text-transparent">
              imóvel dos sonhos
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lead text-white/90 max-w-2xl mx-auto mb-12">
            Encontre casas, apartamentos e terrenos com atendimento personalizado 
            e a transparência que você merece.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-hero inline-flex items-center space-x-2"
            >
              <span>Ver Imóveis em Destaque</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline text-white border-white hover:bg-white hover:text-primary"
            >
              Fale Conosco
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-white/80">Imóveis Vendidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">7+</div>
              <div className="text-white/80">Anos de Experiência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80">Clientes Satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-white/80">Atendimento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;