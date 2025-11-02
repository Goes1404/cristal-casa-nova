import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Building, Users, Phone, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

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
          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-crystal-gray hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </a>
            ))}
            {isAdmin && (
              <Link to="/admin" className="btn-hero flex items-center gap-2 px-4 py-2">
                <UserCircle className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
            {!user && (
              <Link to="/auth" className="btn-hero flex items-center gap-2 px-4 py-2">
                <UserCircle className="h-4 w-4" />
                <span>Entrar</span>
              </Link>
            )}
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
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-primary font-medium py-2"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}
              {!user && (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-primary font-medium py-2"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Entrar</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;