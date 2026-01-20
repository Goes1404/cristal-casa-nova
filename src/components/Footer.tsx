import { Instagram, Facebook, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleNavClick = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(href);
        element?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    } else {
      const element = document.getElementById(href);
      element?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const socialLinks = [{
    icon: Instagram,
    href: '#',
    label: 'Instagram'
  }, {
    icon: Facebook,
    href: '#',
    label: 'Facebook'
  }];
  const quickLinks = [{
    name: 'Início',
    href: 'home'
  }, {
    name: 'Imóveis',
    href: 'properties'
  }, {
    name: 'Sobre Nós',
    href: 'about'
  }, {
    name: 'Contato',
    href: 'contact'
  }];
  return <footer className="bg-primary text-primary-foreground">
      <div className="container-premium py-16 md:py-20 text-primary border-primary-foreground bg-primary-foreground">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-medium">
                <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
              </div>
              <div className="font-heading font-bold text-2xl tracking-tight">
                Corretora Cristal
              </div>
            </div>
            
            <p className="leading-relaxed mb-8 max-w-md text-base text-slate-300">
              Assessoria imobiliária focada em seus objetivos. Garanto segurança, transparência e os melhores resultados para você e seu patrimônio.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return <a key={index} href={social.href} aria-label={social.label} className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-accent hover:scale-105 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </a>;
            })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-8 tracking-tight">
              Links Rápidos
            </h3>
            <ul className="space-y-4 text-crystal-gray">
              {quickLinks.map((link, index) => <li key={index}>
                  <button onClick={() => handleNavClick(link.href)} className="hover:translate-x-1 transition-all duration-300 text-left font-medium text-primary">
                    {link.name}
                  </button>
                </li>)}
              <li>
                <Link to="/auth" className="flex items-center gap-2 hover:translate-x-1 transition-all duration-300 font-medium text-primary">
                  <Lock className="w-4 h-4" />
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-8 tracking-tight text-primary">
              Contato
            </h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <a href="tel:+5511996188216" className="transition-colors font-medium text-primary">
                  (11) 99618-8216
                </a>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <a href="mailto:sq1brunaleite@gmail.com" className="transition-colors font-medium text-primary">
                  sq1brunaleite@gmail.com
                </a>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div className="font-medium leading-relaxed text-primary">
                  Calçada Antares, 264 - 2° Andar<br />
                  Alphaville, Santana de Parnaíba - SP<br />
                  CEP: 06654-450
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium text-primary">
              © 2025 Corretora Cristal. Todos os direitos reservados.
            </div>
            
            <div className="flex gap-8 text-sm">
              <a href="#" className="transition-colors font-medium text-primary">
                Política de Privacidade
              </a>
              <a href="#" className="transition-colors font-medium text-primary">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;