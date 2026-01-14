import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
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
        <section className="bg-griote-blue py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-griote-white mb-8">
                Qu'est-ce que Griote Foundation ?
              </h1>
              <p className="text-xl text-griote-white/90 leading-relaxed mb-12">
                Une plateforme panafricaine dédiée à la valorisation et à la diffusion des savoirs académiques africains.
                Nous connectons les talents du continent pour bâtir l'avenir de l'innovation académique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/inscription" className="bg-griote-accent text-griote-blue hover:bg-griote-accent-light px-8 py-4 rounded-lg font-semibold transition-colors">
                  Rejoindre la communauté
                </a>
                <a href="/depots" className="border-2 border-griote-white text-griote-white hover:bg-griote-white hover:text-griote-blue px-8 py-4 rounded-lg font-semibold transition-colors">
                  Explorer les dépôts
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Définition */}
        <section className="py-20 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-griote-blue mb-8 text-center">
                Définition
              </h2>

              <div className="bg-gradient-to-r from-griote-blue/5 to-griote-accent/5 rounded-3xl p-8 md:p-12 border border-griote-gray-100">
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
        <section className="py-20 bg-griote-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-griote-blue mb-6">
                Fonctionnalités Principales
              </h2>
              <p className="text-lg text-griote-gray-800 max-w-3xl mx-auto">
                Découvrez les outils qui rendent Griote Foundation unique et efficace
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 rounded-2xl bg-griote-white border border-griote-gray-100 shadow-lg">
                <div className="w-16 h-16 bg-griote-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-griote-blue">D</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-griote-blue">
                  Dépôt de Travaux
                </h3>
                <p className="text-griote-gray-800">
                  Partagez vos recherches, thèses et publications dans un environnement sécurisé.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-griote-white border border-griote-gray-100 shadow-lg">
                <div className="w-16 h-16 bg-griote-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-griote-blue">R</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-griote-blue">
                  Réseau Académique
                </h3>
                <p className="text-griote-gray-800">
                  Connectez-vous avec des chercheurs africains et internationaux.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-griote-white border border-griote-gray-100 shadow-lg">
                <div className="w-16 h-16 bg-griote-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-griote-blue">B</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-griote-blue">
                  Bourses d'Excellence
                </h3>
                <p className="text-griote-gray-800">
                  Accédez aux meilleures opportunités de financement académique.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-griote-white border border-griote-gray-100 shadow-lg">
                <div className="w-16 h-16 bg-griote-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-griote-blue">AI</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-griote-blue">
                  Griote AI
                </h3>
                <p className="text-griote-gray-800">
                  Intelligence artificielle au service de la recherche académique.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="py-20 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-griote-blue mb-8">
                  Nos Valeurs
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-griote-accent rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-lg font-bold text-griote-blue">A</span>
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
                      <span className="text-lg font-bold text-griote-blue">E</span>
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
                      <span className="text-lg font-bold text-griote-blue">C</span>
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
                <h2 className="text-3xl md:text-4xl font-bold text-griote-blue mb-8">
                  Notre Impact
                </h2>

                <div className="bg-gradient-to-br from-griote-blue/5 to-griote-accent/5 rounded-2xl p-8 border border-griote-gray-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-griote-accent mb-2">50+</div>
                      <div className="text-griote-gray-800">Pays couverts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-griote-accent mb-2">10K+</div>
                      <div className="text-griote-gray-800">Utilisateurs actifs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-griote-accent mb-2">5K+</div>
                      <div className="text-griote-gray-800">Travaux déposés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-griote-accent mb-2">500+</div>
                      <div className="text-griote-gray-800">Bourses distribuées</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* L'Héritage des Griots */}
        <section className="py-20 bg-griote-blue">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-griote-white mb-8">
                L'Héritage des Griots
              </h2>

              <div className="bg-griote-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
                <p className="text-lg text-griote-white/90 leading-relaxed mb-6">
                  Dans les sociétés ouest-africaines traditionnelles, les griots étaient les dépositaires
                  de la mémoire collective. Ils préservaient l'histoire, les généalogies, les hauts faits
                  et la sagesse ancestrale à travers la transmission orale.
                </p>

                <p className="text-lg text-griote-white/90 leading-relaxed mb-8">
                  Aujourd'hui, Griote Foundation perpétue cet héritage en créant une mémoire numérique
                  des savoirs académiques africains. Chaque recherche partagée, chaque collaboration
                  établie contribue à tisser un nouveau récit de l'excellence africaine sur la scène mondiale.
                </p>

                <blockquote className="text-2xl font-light text-griote-white italic mb-6">
                  "Les griots d'aujourd'hui utilisent des serveurs au lieu de tambours,
                  mais leur mission reste la même : préserver et transmettre le savoir."
                </blockquote>
                <cite className="text-griote-white/70">— Griote Foundation</cite>
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