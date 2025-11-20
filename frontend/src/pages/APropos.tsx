
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { BookOpen, Users, Target, Heart, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const APropos = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-griote-white">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main>
        {/* Hero Section */}
        <section className="bg-griote-blue bg-bogolan py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-griote-accent mb-6">
                  À propos de la Fondation Griote
                </h1>
                <p className="text-xl text-griote-accent/80 leading-relaxed">
                  Inspirés par les griots, gardiens traditionnels de la mémoire africaine, 
                  nous créons des ponts entre les savoirs ancestraux et l'innovation contemporaine.
                </p>
              </div>
              
              <div className="relative animate-fade-in">
                <div className="bg-griote-accent/10 rounded-3xl p-8 backdrop-blur-sm border border-griote-accent/20">
                  <div className="w-24 h-24 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🌍</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-griote-accent text-center mb-4">
                    Une Vision Panafricaine
                  </h3>
                  <p className="text-griote-accent/80 text-center">
                    Connecter les talents académiques de tout le continent africain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notre Mission */}
        <section className="py-16 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-griote-blue mb-8 flex items-center">
                  <Target className="w-8 h-8 mr-3 text-griote-accent" />
                  Notre Mission
                </h2>
                
                <div className="space-y-6">
                  <p className="griote-body text-griote-gray-800 leading-relaxed">
                    La Fondation Griote est née d'une vision simple mais ambitieuse : 
                    créer un écosystème numérique qui valorise et préserve les savoirs académiques africains. 
                    Comme les griots d'autrefois qui transmettaient oralement l'histoire et la sagesse, 
                    nous utilisons la technologie pour perpétuer cette noble tradition.
                  </p>
                  
                  <p className="griote-body text-griote-gray-800 leading-relaxed">
                    Notre plateforme permet aux étudiants, chercheurs et académiciens de partager leurs travaux, 
                    d'accéder aux recherches de leurs pairs et de postuler aux meilleures opportunités de bourses. 
                    Nous croyons que le savoir ne doit connaître aucune frontière et que chaque contribution 
                    académique mérite d'être reconnue et diffusée.
                  </p>
                  
                  <div className="bg-griote-blue/5 p-6 rounded-xl border-l-4 border-griote-accent">
                    <p className="griote-body text-griote-blue font-medium italic">
                      "Valoriser les savoirs africains pour illuminer l'avenir du continent 
                      et contribuer au progrès de l'humanité."
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="griote-card p-6">
                  <Globe className="w-12 h-12 text-griote-accent mb-4" />
                  <h3 className="griote-subtitle font-semibold mb-3">Portée Panafricaine</h3>
                  <p className="griote-secondary text-griote-gray-800/80">
                    Connectant plus de 54 pays africains dans un réseau académique unifié.
                  </p>
                </div>

                <div className="griote-card p-6">
                  <Award className="w-12 h-12 text-griote-accent mb-4" />
                  <h3 className="griote-subtitle font-semibold mb-3">Bourses d'Excellence</h3>
                  <p className="griote-secondary text-griote-gray-800/80">
                    Accès privilégié aux meilleures opportunités de financement académique.
                  </p>
                </div>

                <div className="griote-card p-6">
                  <Heart className="w-12 h-12 text-griote-accent mb-4" />
                  <h3 className="griote-subtitle font-semibold mb-3">Accès Ouvert</h3>
                  <p className="griote-secondary text-griote-gray-800/80">
                    Plateforme ouverte pour démocratiser l'accès au savoir africain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notre Vision */}
        <section className="py-16 bg-griote-blue bg-kente">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-griote-accent mb-6 flex items-center justify-center">
                <BookOpen className="w-8 h-8 mr-3" />
                Notre Vision
              </h2>
              <p className="text-xl text-griote-accent/80 max-w-3xl mx-auto">
                Faire de l'Afrique un hub mondial d'innovation académique et scientifique
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-griote-blue" />
                </div>
                <h3 className="text-xl font-semibold text-griote-accent mb-4">
                  Communauté Unie
                </h3>
                <p className="text-griote-accent/80">
                  Créer un réseau solidaire d'académiciens africains qui s'entraident et collaborent.
                </p>
              </div>

              <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-20 h-20 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-griote-blue" />
                </div>
                <h3 className="text-xl font-semibold text-griote-accent mb-4">
                  Savoir Accessible
                </h3>
                <p className="text-griote-accent/80">
                  Rendre la connaissance académique africaine facilement accessible au monde entier.
                </p>
              </div>

              <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="w-20 h-20 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-griote-blue" />
                </div>
                <h3 className="text-xl font-semibold text-griote-accent mb-4">
                  Excellence Reconnue
                </h3>
                <p className="text-griote-accent/80">
                  Faire reconnaître l'excellence académique africaine sur la scène internationale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* L'héritage des Griots */}
        <section className="py-16 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-griote-blue mb-8">
                L'Héritage des Griots
              </h2>
              
              <div className="bg-gradient-to-r from-griote-blue/5 to-griote-accent/5 rounded-3xl p-8 md:p-12">
                <p className="text-lg text-griote-gray-800 leading-relaxed mb-6">
                  Dans les traditions ouest-africaines, les griots étaient bien plus que des conteurs. 
                  Ils étaient les gardiens de la mémoire collective, les conseillers des rois, 
                  et les liens vivants entre les générations.
                </p>
                
                <p className="text-lg text-griote-gray-800 leading-relaxed mb-8">
                  Aujourd'hui, nous perpétuons cet héritage en créant un espace numérique 
                  où les savoirs académiques africains peuvent être préservés, partagés et célébrés. 
                  Chaque recherche partagée sur notre plateforme devient une note dans la grande 
                  symphonie du savoir africain.
                </p>

                <blockquote className="text-2xl font-light text-griote-blue italic mb-6">
                  "Quand un vieillard meurt, c'est une bibliothèque qui brûle."
                </blockquote>
                <cite className="text-griote-gray-800/70">— Amadou Hampâté Bâ</cite>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-griote-blue bg-bogolan">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-griote-accent mb-6">
                Rejoignez Notre Mission
              </h2>
              <p className="text-xl text-griote-accent/80 mb-8 max-w-2xl mx-auto">
                Participez à la construction du plus grand réseau académique africain
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/inscription">
                  <Button className="griote-button text-lg px-8 py-4">
                    Créer un compte
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="griote-button-outline text-lg px-8 py-4">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default APropos;
