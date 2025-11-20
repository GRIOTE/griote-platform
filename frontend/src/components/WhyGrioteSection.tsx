import { useState, useEffect } from 'react';
import { Shield, BookOpen, Star, GraduationCap } from 'lucide-react';

const features = [
  {
    icon: Shield, // Remplacer par un SVG adinkra (ex. Gye Nyame) si disponible
    title: 'Sécurité garantie',
    description: 'Vos données et travaux sont protégés par des protocoles de sécurité avancés.',
  },
  {
    icon: BookOpen, // Remplacer par Sankofa pour symboliser l'apprentissage
    title: 'Ouvert à tous',
    description: 'Accessible à tous les étudiants et chercheurs africains, sans discrimination.',
  },
  {
    icon: Star, // Remplacer par un symbole de liberté ou d'excellence
    title: 'Accès ouvert',
    description: 'Plateforme ouverte pour démocratiser l\'accès au savoir africain.',
  },
  {
    icon: GraduationCap, // Remplacer par un symbole d'éducation africaine
    title: 'Opportunités d\'études',
    description: 'Accès privilégié aux bourses de Master 2, Doctorat et post-doctorat.',
  },
];

const WhyGrioteSection = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="py-16 relative bg-griote-blue"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(30, 58, 138, 0.98) 100%)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-griote-white mb-4 transition-all duration-1000 ease-out ${
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Pourquoi choisir Griote ?
          </h2>
          <p
            className={`text-lg sm:text-xl text-griote-white/90 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ease-out delay-100 ${
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Une plateforme pensée par et pour la communauté académique panafricaine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`text-center transition-all duration-500 ease-out transform rounded-2xl p-6 bg-griote-white hover:bg-griote-gray-50 hover:shadow-xl cursor-pointer ${
                  fadeIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-griote-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-griote-blue" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-griote-blue mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-griote-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Citation inspirante */}
        <div className="mt-16 text-center relative">
          <div
            className="inline-block bg-griote-blue/20 rounded-lg p-6 max-w-3xl mx-auto transition-all duration-700 ease-out"
          >
            <blockquote
              className={`text-xl sm:text-2xl md:text-3xl font-light text-griote-accent italic mb-4 ${
                fadeIn ? 'opacity-100' : 'opacity-0'
              }`}
            >
              "Le griot ne se contente pas de raconter l'histoire, il la préserve et la transmet."
            </blockquote>
            <cite className="text-griote-white/80 text-sm sm:text-base">
              — Sagesse africaine traditionnelle
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyGrioteSection;