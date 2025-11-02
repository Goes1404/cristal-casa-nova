import { Shield, Heart, Award, Users } from 'lucide-react';
import agentImage from '@/assets/agent-portrait.jpg';
const AboutSection = () => {
  const values = [{
    icon: Shield,
    title: 'Confiança',
    description: 'Transparência total em todas as negociações'
  }, {
    icon: Heart,
    title: 'Atendimento Personalizado',
    description: 'Cada cliente é único e merece atenção especial'
  }, {
    icon: Award,
    title: 'Excelência',
    description: 'Padrão de qualidade reconhecido no mercado'
  }, {
    icon: Users,
    title: 'Experiência',
    description: 'Mais de 15 anos conectando pessoas aos seus lares'
  }];
  return <section id="about" className="py-20 bg-gradient-to-b from-white to-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-section">Quem é a Corretora Cristal?</h2>
            <p className="text-lead max-w-2xl mx-auto">
              Uma empresa comprometida em transformar sonhos em realidade através 
              do mercado imobiliário.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-strong">
                <img src={agentImage} alt="Corretora Cristal - Atendimento Profissional" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-accent text-white p-6 rounded-xl shadow-glow">
                <div className="text-2xl font-bold">7+</div>
                <div className="text-sm opacity-90">Anos no Mercado</div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:pl-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Nossa História
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Fundada com o propósito de revolucionar a experiência de compra e venda 
                  de imóveis, a Corretora Cristal nasceu da paixão por conectar pessoas aos 
                  seus lares ideais.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Com mais de 15 anos de experiência no mercado imobiliário, desenvolvemos 
                  uma abordagem única que combina expertise técnica, atendimento humanizado 
                  e total transparência em cada transação.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-crystal-gray">Consultoria especializada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-crystal-gray">Acompanhamento completo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-crystal-gray">Documentação segura</span>
                </div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
            const Icon = value.icon;
            return <div key={index} className="card-crystal text-center group">
                  <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-heading font-semibold text-lg text-primary mb-2">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>;
          })}
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;