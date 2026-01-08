import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Button } from '../components/ui/button';
import { useAuth } from '../auth/useAuth';
import { Link } from 'react-router-dom';
import { Archive, Lightbulb, Target, Users, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/card';

const APropos = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header isAuthenticated={isAuthenticated} onLogout={logout} />

      <main>
        {/* Hero Section – Impactante avec motif culturel discret */}
        <section className="relative bg-gradient-to-br from-primary to-blue-900 py-28 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg" 
              alt="Motif culturel africain" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8">
              Griote Project-Africa
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Une initiative dédiée à la valorisation, l’archivage et la diffusion des savoirs africains.<br />
              Nous construisons un écosystème académique et technologique souverain pour connecter les talents du continent et façonner l’avenir de l’innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/inscription">
                <Button size="lg" className="px-10 py-6 text-lg font-semibold bg-white text-primary hover:bg-accent/90">
                  Rejoindre la communauté
                </Button>
              </Link>
              <Link to="/recherche">
                <Button variant="outline" size="lg" className="px-10 py-6 text-lg font-semibold border-white text-white hover:bg-white/10">
                  Explorer les dépôts
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section unique enrichie : Mission, Vision, Valeurs & Équipe – Plus qualitative, visuelle et fluide */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">

            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Notre Mission, Notre Vision, Nos Valeurs
              </h2>
              <p className="text-xl text-foreground/70 max-w-4xl mx-auto">
                Griote Project-Africa repose sur une ambition claire : faire de l’Afrique un leader mondial du savoir et de l’innovation technologique, en préservant et valorisant ses propres productions intellectuelles.
              </p>
            </div>

            {/* Grille dynamique avec images intégrées pour plus de vie */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              {/* Colonne texte + piliers */}
              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <Archive className="w-14 h-14 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Préservation & Diffusion</h3>
                    <p className="text-foreground/80 text-lg">
                      Archiver les travaux académiques africains et les rendre accessibles mondialement, pour que chaque thèse, mémoire ou recherche compte et soit citée.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <Lightbulb className="w-14 h-14 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Innovation & Souveraineté</h3>
                    <p className="text-foreground/80 text-lg">
                      Développer Griote AI et des projets open source entraînés sur nos savoirs et langues, pour une technologie véritablement adaptée à nos réalités.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <Target className="w-14 h-14 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Excellence & Collaboration</h3>
                    <p className="text-foreground/80 text-lg">
                      Promouvoir l’excellence académique africaine et favoriser les partenariats panafricains et internationaux.
                    </p>
                  </div>
                </div>
              </div>

              {/* Colonne visuelle */}
              <div className="grid grid-cols-2 gap-6">
                <img src="https://www.shutterstock.com/image-photo/male-female-doctors-diverse-backgrounds-600nw-2673117813.jpg" alt="Chercheurs africains collaborant" className="rounded-2xl object-cover h-64 shadow-lg" />
                <img src="https://i0.wp.com/livingopensource.org/wp-content/uploads/2024/06/Living-Open-Source-training-in-Kenya.jpg?resize=1024%2C682&ssl=1" alt="Formation open source en Afrique" className="rounded-2xl object-cover h-64 shadow-lg mt-12" />
                <img src="https://i.natgeofe.com/n/6d15d22a-e7f9-45b1-966b-812935567f6c/RSTimbuktuLead1.jpg" alt="Manuscrits de Tombouctou – préservation du savoir" className="rounded-2xl object-cover h-64 shadow-lg" />
                <img src="https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2025/12/young-people-computer.jpg" alt="Jeunes africains en innovation technologique" className="rounded-2xl object-cover h-64 shadow-lg mt-12" />
              </div>
            </div>

            {/* Équipe – Intégrée dans la même section pour fluidité */}
            <div className="mt-24">
              <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
                Portée par une Équipe Engagée
              </h2>
              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <Link to="/a-propos/bureau-executif">
                  <Card className="p-10 rounded-3xl text-center hover:shadow-2xl transition-all hover:-translate-y-3 border border-border/30 group">
                    <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
                      <Users className="w-20 h-20 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Bureau Exécutif</h3>
                    <p className="text-foreground/80 text-lg mb-6">
                      La direction stratégique qui pilote la vision et les opérations de la fondation.
                    </p>
                    <span className="text-primary font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                      Découvrir l'équipe <ArrowRight className="w-5 h-5" />
                    </span>
                  </Card>
                </Link>

                <Link to="/a-propos/contributeurs">
                  <Card className="p-10 rounded-3xl text-center hover:shadow-2xl transition-all hover:-translate-y-3 border border-border/30 group">
                    <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
                      <Lightbulb className="w-20 h-20 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Contributeurs & Partenaires</h3>
                    <p className="text-foreground/80 text-lg mb-6">
                      Chercheurs, experts et institutions qui enrichissent quotidiennement notre écosystème.
                    </p>
                    <span className="text-primary font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                      Rencontrer les contributeurs <ArrowRight className="w-5 h-5" />
                    </span>
                  </Card>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Call to Action final – Puissant et centré */}
        <section className="py-24 lg:py-32 bg-gradient-to-br from-primary to-blue-900">
          <div className="container mx-auto px-4 text-center max-w-5xl">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8">
              Rejoignez le Mouvement Panafricain du Savoir
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto">
              Ensemble, construisons le plus grand réseau académique et technologique d’Afrique.<br />
              Votre voix, votre recherche, votre expertise comptent.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/inscription">
                <Button size="xl" className="px-12 py-8 text-2xl font-bold bg-white text-primary hover:bg-accent/90">
                  Commencer maintenant
                </Button>
              </Link>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default APropos;