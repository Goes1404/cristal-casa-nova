import { useState } from 'react';
import { Menu, X, Home, Building, Users, Phone } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Início', href: '#home', icon: Home },
    { name: 'Imóveis', href: '#properties', icon: Building },
    { name: 'Sobre Nós', href: '#about', icon: Users },
    { name: 'Contato', href: '#contact', icon: Phone },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
            </div>
            <div className="font-heading font-bold text-xl md:text-2xl text-primary">
              Corretora Cristal
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-crystal-gray hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 text-crystal-gray hover:text-primary transition-colors duration-300 font-medium py-2"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;