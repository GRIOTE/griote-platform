import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { BookOpen, Users, Target, Heart, Globe, Award, Lightbulb, Zap } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';

const CestQuoiGriote = () => {
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
                  C'est quoi Griote Foundation ?
                </h1>
                <p className="text-xl text-griote-accent/80 leading-relaxed">
                  Une initiative panafricaine qui révolutionne l'accès aux savoirs académiques
                  en Afrique et dans la diaspora.
                </p>
              </div>

              <div className="relative animate-fade-in">
                <div className="bg-griote-accent/10 rounded-3xl p-8 backdrop-blur-sm border border-griote-accent/20">
                  <div className="w-24 h-24 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🌍</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-griote-accent text-center mb-4">
                    Notre Vision
                  </h3>
                  <p className="text-griote-accent/80 text-center">
                    Connecter les talents académiques africains et valoriser leurs savoirs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Définition */}
        <section className="py-16 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-griote-blue mb-8 text-center flex items-center justify-center">
                <Lightbulb className="w-8 h-8 mr-3 text-griote-accent" />
                Qu'est-ce que Griote Foundation ?
              </h2>

              <div className="bg-gradient-to-r from-griote-blue/5 to-griote-accent/5 rounded-3xl p-8 md:p-12">
                <p className="text-lg text-griote-gray-800 leading-relaxed mb-6">
                  Griote Foundation est une plateforme numérique innovante conçue pour valoriser,
                  préserver et diffuser les savoirs académiques africains. Inspirés par les griots
                  traditionnels qui transmettaient oralement l'histoire et la sagesse africaine,
                  nous créons un espace virtuel où les chercheurs, étudiants et académiciens
                  peuvent partager leurs travaux et accéder aux connaissances de leurs pairs.
                </p>

                <p className="text-lg text-griote-gray-800 leading-relaxed mb-8">
                  Notre mission est de combler le fossé entre les institutions académiques africaines
                  et le reste du monde, en offrant un accès équitable aux opportunités de recherche,
                  de publication et de collaboration internationale.
                </p>

                <blockquote className="text-2xl font-light text-griote-blue italic mb-6 text-center">
                  "Griote Foundation : Où les savoirs africains rencontrent l'innovation numérique"
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Fonctionnalités Clés */}
        <section className="py-16 bg-griote-blue bg-kente">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-griote-accent mb-6">
                Fonctionnalités Clés
              </h2>
              <p className="text-xl text-griote-accent/80 max-w-3xl mx-auto">
                Découvrez ce qui rend Griote Foundation unique
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-griote-blue" />
                </div>
                <h3 className="text-xl font-semibold text-griote-accent mb-4">
                  Dépôt de Travaux
                </h3>
                <p className="text-griote-accent/80">
                  Partagez vos recherches, thèses et publications dans un environnement sécurisé.
                </p>
              </div>

              <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-20 h-20 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-griote-blue" />
                </div>
                <h3 className="text-xl font-semibold text-griote-accent mb-4">
                  Réseau Académique
                </h3>
                <p className="text-griote-accent/80">
                  Connectez-vous avec des chercheurs africains et internationaux.
                </p>
              </div>

              <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-20 h-20 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-griote-blue" />
                </div>
                <h3 className="text-xl font-semibold text-griote-accent mb-4">
                  Bourses d'Excellence
                </h3>
                <p className="text-griote-accent/80">
                  Accédez aux meilleures opportunités de financement académique.
                </p>
              </div>

              <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-20 h-20 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-griote-blue" />
                </div>
                <h3 className="text-xl font-semibold text-griote-accent mb-4">
                  Griote AI
                </h3>
                <p className="text-griote-accent/80">
                  Intelligence artificielle au service de la recherche académique.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="py-16 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-griote-blue mb-8 flex items-center">
                  <Heart className="w-8 h-8 mr-3 text-griote-accent" />
                  Nos Valeurs
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-griote-accent rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Globe className="w-6 h-6 text-griote-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-griote-blue mb-2">Accessibilité</h3>
                      <p className="text-griote-gray-800">
                        Démocratiser l'accès au savoir académique africain pour tous.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-griote-accent rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Target className="w-6 h-6 text-griote-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-griote-blue mb-2">Excellence</h3>
                      <p className="text-griote-gray-800">
                        Maintenir les plus hauts standards de qualité académique.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-griote-accent rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Users className="w-6 h-6 text-griote-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-griote-blue mb-2">Collaboration</h3>
                      <p className="text-griote-gray-800">
                        Favoriser les échanges et la coopération entre académiciens.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-griote-blue mb-8 flex items-center">
                  <Award className="w-8 h-8 mr-3 text-griote-accent" />
                  Notre Impact
                </h2>

                <div className="bg-gradient-to-br from-griote-blue/5 to-griote-accent/5 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-griote-accent mb-2">50+</div>
                      <div className="text-griote-blue">Pays couverts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-griote-accent mb-2">10K+</div>
                      <div className="text-griote-blue">Utilisateurs actifs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-griote-accent mb-2">5K+</div>
                      <div className="text-griote-blue">Travaux déposés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-griote-accent mb-2">500+</div>
                      <div className="text-griote-blue">Bourses distribuées</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* L'Héritage des Griots */}
        <section className="py-16 bg-griote-blue bg-bogolan">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-griote-accent mb-8">
                L'Héritage des Griots
              </h2>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
                <p className="text-lg text-griote-accent/80 leading-relaxed mb-6">
                  Dans les sociétés ouest-africaines traditionnelles, les griots étaient les dépositaires
                  de la mémoire collective. Ils préservaient l'histoire, les généalogies, les hauts faits
                  et la sagesse ancestrale à travers la transmission orale.
                </p>

                <p className="text-lg text-griote-accent/80 leading-relaxed mb-8">
                  Aujourd'hui, Griote Foundation perpétue cet héritage en créant une mémoire numérique
                  des savoirs académiques africains. Chaque recherche partagée, chaque collaboration
                  établie contribue à tisser un nouveau récit de l'excellence africaine sur la scène mondiale.
                </p>

                <blockquote className="text-2xl font-light text-white italic mb-6">
                  "Les griots d'aujourd'hui utilisent des serveurs au lieu de tambours,
                  mais leur mission reste la même : préserver et transmettre le savoir."
                </blockquote>
                <cite className="text-griote-accent/70">— Griote Foundation</cite>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CestQuoiGriote;