import { useState, useEffect } from 'react';
import { Search, Upload, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import grioteImage from '@/assets/griote.jpg';

interface HeroSectionProps {
  isAuthenticated?: boolean;
}

const HeroSection = ({ isAuthenticated = false }: HeroSectionProps) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative w-full min-h-[600px] flex items-center bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(30, 58, 138, 0.95) 100%)',
      }} 
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div
            className={`text-center lg:text-left transition-all duration-1000 ease-out transform ${
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-griote-white mb-6 leading-tight">
              Partagez vos savoirs,<br />
              <span className="text-griote-accent">illuminez l'Afrique</span>
            </h1>

            <p className="text-lg sm:text-xl text-griote-white/90 mb-8 leading-relaxed max-w-2xl">
              Plateforme panafricaine dédiée à la valorisation des travaux académiques, 
              au développement de l'intelligence artificielle africaine et à l'accès aux opportunités d'études.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/recherche">
                <Button className="px-8 py-4 w-full sm:w-auto bg-griote-accent text-griote-blue rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-300">
                  Explorer les projets
                </Button>
              </Link>

              <Link to={isAuthenticated ? '/depot' : '/connexion'}>
                <Button
                  variant="outline"
                  className="px-8 py-4 w-full sm:w-auto border-2 border-griote-accent text-griote-accent rounded-lg font-semibold hover:bg-griote-accent hover:text-griote-blue transition-colors duration-300"
                >
                  Déposer un projet
                </Button>
              </Link>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-griote-white/20">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-griote-accent mb-1">1000+</div>
                <div className="text-sm text-griote-white/80">Projets partagés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-griote-accent mb-1">500+</div>
                <div className="text-sm text-griote-white/80">Étudiants connectés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-griote-accent mb-1">50+</div>
                <div className="text-sm text-griote-white/80">Opportunités disponibles</div>
              </div>
            </div>
          </div>

          {/* Image africaine authentique */}
          <div className="hidden lg:block relative">
            <div
              className={`transition-all duration-1000 ease-out transform ${
                fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src={grioteImage}
                  alt="Sage africain - Gardien de la tradition orale"
                  className="w-full h-auto rounded-2xl shadow-2xl border-4 border-griote-accent/20"
                  style={{
                    filter: 'sepia(10%) saturate(120%) brightness(105%) contrast(110%)'
                  }}
                />
                {/* Overlay décoratif avec motifs africains */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-griote-blue/20 via-transparent to-griote-accent/10"></div>
                
                {/* Symboles Adinkra décoratifs */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-griote-accent rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-griote-blue font-bold text-lg">★</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-griote-blue rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-griote-accent font-bold">◆</span>
                </div>
                
                {/* Citation inspirante */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                  <p className="text-griote-accent text-xs font-medium italic opacity-90">
                    "La parole est sacrée, elle crée et transforme", Sagesse africaine
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motif décoratif africain (optionnel, pour renforcer l'esthétique) */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-[url('https://example.com/african-border-pattern.png')] bg-repeat-x opacity-50"></div>
    </section>
  );
};

export default HeroSection;