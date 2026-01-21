// src/components/Header.tsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Building, Users, Phone, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ThemeToggle';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = [{
    name: 'Início',
    href: 'home',
    icon: Home
  }, {
    name: 'Imóveis',
    href: 'properties',
    icon: Building
  }, {
    name: 'Sobre Nós',
    href: 'about',
    icon: Users
  }, {
    name: 'Contato',
    href: 'contact',
    icon: Phone
  }];
  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
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
  return <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 shadow-soft border-b border-border">
      <div className="container mx-auto px-4 bg-[#000024]/[0.77]">
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
            {navigation.map(item => <button key={item.name} onClick={() => handleNavClick(item.href)} className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                {item.name}
              </button>)}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mostrar Admin somente quando isAdmin === true */}
            {isAdmin === true && <Link to="/admin" className="btn-hero flex items-center gap-2 px-4 py-2">
                <UserCircle className="h-4 w-4" />
                <span>Admin</span>
              </Link>}

            {/* Mostrar botão Entrar quando não há usuário */}
            {!user && !loading && <Link to="/auth" className="btn-hero flex items-center gap-2 px-4 py-2">
                <UserCircle className="h-4 w-4" />
                <span>Entrar</span>
              </Link>}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navigation.map(item => {
            const Icon = item.icon;
            return <button key={item.name} onClick={() => handleNavClick(item.href)} className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300 font-medium py-2 text-left">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>;
          })}

              {isAdmin === true && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-primary font-medium py-2">
                  <UserCircle className="w-5 h-5" />
                  <span>Admin</span>
                </Link>}

              {!user && !loading && <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-primary font-medium py-2">
                  <UserCircle className="w-5 h-5" />
                  <span>Entrar</span>
                </Link>}
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;