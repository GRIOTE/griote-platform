import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Button } from '../components/ui/button';
import { useAuth } from '../auth/useAuth';
import { Link } from 'react-router-dom';
import { Archive, Lightbulb, Target, Users, ArrowRight, Mail } from 'lucide-react';
import { Card } from '../components/ui/card';

const APropos = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Hero Section – Impactante avec motif culturel discret */}
        <section className="relative bg-primary-gradient py-28 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg"
              alt="Motif culturel africain"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-accent mb-10">
              Griote Africa
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-white/90 mb-20 max-w-3xl mx-auto">
              La mémoire, le savoir et l’innovation africaine réunis dans un seul écosystème.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/inscription">
                <Button
                  size="lg"
                  className="px-12 py-8 text-xl font-semibold bg-white text-primary hover:bg-accent/90"
                >
                  Rejoindre la communauté
                </Button>
              </Link>

              <Link to="/depots">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-12 py-8 text-xl font-semibold text-foreground bg-accent inline-flex items-center gap-3"
                >
                  Explorer les dépôts
                  <ArrowRight className="w-6 h-6" />
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
                  <Archive className="w-14 h-14 text-blue-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl text-blue-500 font-bold mb-3">Préservation & Diffusion</h3>
                    <p className="text-foreground/80 text-lg">
                      Archiver les travaux académiques africains et les rendre accessibles mondialement, pour que chaque thèse, mémoire ou recherche compte et soit citée.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <Lightbulb className="w-14 h-14 text-blue-500 shrink-0" />
                  <div>
                    <h3 className="text-2xl text-blue-500 font-bold mb-3">Innovation & Souveraineté</h3>
                    <p className="text-foreground/80 text-lg">
                      Développer Griote AI et des projets open source entraînés sur nos savoirs et langues, pour une technologie véritablement adaptée à nos réalités.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <Target className="w-14 h-14 text-blue-500 shrink-0" />
                  <div>
                    <h3 className="text-2xl text-blue-500 font-bold mb-3">Excellence & Collaboration</h3>
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
            <div className="mt-24 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-foreground">
                Une Équipe Engagée
              </h2>
              <div className="max-w-4xl mx-auto">
                <Link to="/a-propos/bureau-executif">
                  <Card className="relative overflow-hidden rounded-3xl border border-border group hover:shadow-2xl transition-all">

                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop"
                      alt="Équipe africaine en réunion"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-black/60" />

                    <div className="relative z-10 p-12 lg:p-16 flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Users className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-3xl font-bold text-white mb-4">
                        Bureau Exécutif
                      </h3>

                      <p className="text-white/90 text-lg max-w-xl mb-6">
                        Pilote la vision et les décisions clés du projet.
                      </p>

                      <span className="inline-flex items-center gap-2 text-blue-400 font-semibold text-lg group-hover:translate-x-2 group-hover:text-blue-300 transition-transform">
                        Découvrir l’équipe
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Call to Action final – Puissant et centré */}
        <section className="relative bg-primary-gradient py-28 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg"
              alt="Motif culturel africain"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 text-center max-w-5xl">

            <h2 className="text-4xl lg:text-6xl font-extrabold text-accent mb-8">
              Rejoindre & Contribuer au Savoir Africain
            </h2>

            <p className="text-xl font-black lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Un espace ouvert à tous ceux qui produisent et valorisent le savoir africain.
      Chercheurs, étudiants, professionnels : votre contribution compte.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {/* Bouton principal */}
              <Link to="/inscription">
                <Button
                  className="px-12 py-8 text-2xl font-bold bg-white text-primary hover:bg-accent hover:text-primary transition-all inline-flex items-center gap-3"
                >
                  Commencer
                  <ArrowRight className="w-20 h-6" />
                </Button>
              </Link>

              {/* Bouton secondaire */}
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="px-12 py-8 text-xl font-semibold text-foreground bg-accent inline-flex items-center gap-3"
                >
                  Nous contacter
                  <Mail className="w-12 h-12" /> {/* 48px */}
                </Button>
              </Link>

            </div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default APropos;