
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

const Index = () => {
  useEffect(() => {
    // Smooth scroll to top on page load
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen page-transition">
      <Navbar />
      <Hero />
      <Features />
      
      <footer className="bg-background py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-bold">Seatastic</h3>
              <p className="text-sm text-muted-foreground mt-2">Elegant wedding seating arrangements made simple.</p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h4 className="text-sm font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Seatastic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
