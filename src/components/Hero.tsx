
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen flex flex-col justify-center items-center px-6 opacity-0">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-block px-3 py-1 rounded-full bg-secondary text-sm font-medium mb-4 animate-float">
          Create beautiful wedding seating plans
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Wedding planning made simple with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
            Seatastic
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Design your perfect seating arrangement with our intuitive drag-and-drop tool.
          Effortlessly manage guests and tables for your special day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            size="lg" 
            className="btn-hover group"
            onClick={() => navigate('/planner')}
          >
            Try it now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="btn-hover"
            onClick={() => navigate('/dashboard')}
          >
            View Demo
          </Button>
        </div>
      </div>

      <div className="mt-20 w-full max-w-5xl mx-auto relative overflow-hidden rounded-xl shadow-2xl opacity-90">
        <div className="glassmorphism rounded-xl p-1 relative z-10">
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
            alt="Wedding Seating Chart" 
            className="rounded-lg w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent rounded-lg opacity-60"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-blue-500/10 rounded-xl"></div>
      </div>
    </div>
  );
};

export default Hero;
