import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToActionSection = () => {
  return (
    <section
      className="py-16 bg-griote-blue-dark relative"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 md:p-12 text-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url('https://example.com/adinkra-pattern.png')`, // Motif adinkra subtil
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-griote-white mb-6 animate-fade-in-up"
          >
            Prêt à rejoindre la communauté panafricaine ?
          </h2>
          <p
            className="text-lg sm:text-xl text-griote-white/90 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            Partagez vos recherches, découvrez de nouveaux savoirs, contribuez à Griote AI et accédez aux meilleures opportunités académiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inscription">
              <Button
                className="bg-griote-accent text-griote-blue hover:bg-griote-accent-light hover:text-griote-blue-dark text-lg px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Créer un compte maintenant
              </Button>
            </Link>
            <Link to="/a-propos">
              <Button
                variant="outline"
                className="border-griote-accent text-griote-accent hover:bg-griote-accent hover:text-griote-blue text-lg px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                En savoir plus
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;