
import { useEffect, useRef } from 'react';
import { 
  Users, 
  TableProperties, 
  MousePointerClick, 
  Smartphone,
  Share2,
  Download
} from 'lucide-react';

const features = [
  {
    icon: <MousePointerClick className="h-10 w-10 text-pink-500" />,
    title: 'Drag & Drop Interface',
    description: 'Intuitively place guests at tables with our easy-to-use drag and drop interface.'
  },
  {
    icon: <Users className="h-10 w-10 text-blue-500" />,
    title: 'Guest Management',
    description: 'Keep track of your guests, their dietary requirements, and RSVP status.'
  },
  {
    icon: <TableProperties className="h-10 w-10 text-purple-500" />,
    title: 'Custom Table Layouts',
    description: 'Create various table shapes and sizes to match your venue perfectly.'
  },
  {
    icon: <Smartphone className="h-10 w-10 text-green-500" />,
    title: 'Mobile Friendly',
    description: 'Plan on the go with our fully responsive design that works on all devices.'
  },
  {
    icon: <Share2 className="h-10 w-10 text-amber-500" />,
    title: 'Collaborative Planning',
    description: 'Share your seating plan with others to get feedback and suggestions.'
  },
  {
    icon: <Download className="h-10 w-10 text-teal-500" />,
    title: 'Export Options',
    description: 'Download your seating plan as PDF or image to share with your venue and vendors.'
  }
];

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const featureElements = document.querySelectorAll('.feature-card');
    featureElements.forEach((el) => observer.observe(el));

    return () => {
      featureElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div ref={featuresRef} className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Everything You Need for Perfect Seating</h2>
          <p className="text-muted-foreground">
            Our comprehensive tools make wedding seating arrangement effortless and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card glassmorphism p-6 rounded-xl card-hover opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
