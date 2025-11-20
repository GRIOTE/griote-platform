import { useState, useEffect } from 'react';
import { Brain, Sparkles, Users, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const GrioteAISection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "IA Collaborative",
      description: "Développée par et pour la communauté africaine"
    },
    {
      icon: Sparkles,
      title: "Innovation Ouverte",
      description: "Contribuez au développement de l'intelligence artificielle africaine"
    },
    {
      icon: Users,
      title: "Communauté Active",
      description: "Rejoignez des milliers de développeurs et chercheurs"
    }
  ];

  return (
    <section className="py-16 bg-griote-gray-50 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-r from-griote-accent to-griote-blue"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-12 transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-griote-accent/10 px-4 py-2 rounded-full mb-6">
            <Zap className="w-5 h-5 text-griote-accent" />
            <span className="text-griote-blue font-semibold">Découvrez Griote AI</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-griote-blue mb-6">
            L'Intelligence Artificielle
            <br />
            <span className="text-griote-accent">Développée par l'Afrique</span>
          </h2>
          
          <p className="text-lg text-griote-gray-600 max-w-3xl mx-auto leading-relaxed">
            Griote AI est une intelligence artificielle révolutionnaire créée par notre communauté 
            de chercheurs et développeurs africains. Explorez les possibilités infinies de l'IA 
            qui comprend et valorise les contextes africains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`bg-white border-griote-accent/20 hover:border-griote-accent/40 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-griote-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-griote-accent" />
                </div>
                <h3 className="text-xl font-semibold text-griote-blue mb-3">
                  {feature.title}
                </h3>
                <p className="text-griote-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={`text-center transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '400ms' }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="bg-griote-accent text-griote-blue hover:bg-griote-accent-light px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link to="/griote-ai">
                Découvrir Griote AI
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              className="border-2 border-griote-blue text-griote-blue hover:bg-griote-blue hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
              asChild
            >
              <Link to="/contribuer">
                Contribuer au projet
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-griote-gray-600 mt-6 max-w-2xl mx-auto">
            Griote AI est un projet open-source développé collaborativement par la communauté. 
            Participez à la révolution de l'IA africaine.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GrioteAISection;
