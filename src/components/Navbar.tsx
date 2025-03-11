
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { session, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-10 transition-all duration-300 ease-in-out ${
      scrolled || pathname !== '/' ? 'bg-background/80 backdrop-blur-md py-3 shadow-sm' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-tight">nupt.me</Link>
        
        <div className="flex items-center space-x-2">
          {session.user ? (
            <>
              <Button asChild variant="ghost" className="hidden md:flex">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={signOut} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button asChild className="btn-hover">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
