
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Planner', path: '/planner' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 glassmorphism' : 'py-5 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">Seatastic</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${
                location.pathname === item.path ? 'after:scale-x-100 after:origin-bottom-left' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button className="btn-hover">Sign In</Button>
        </div>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="container mx-auto px-6 py-4 md:hidden glassmorphism animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium ${
                  location.pathname === item.path ? 'font-bold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button className="btn-hover w-full">Sign In</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
