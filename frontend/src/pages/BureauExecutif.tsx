import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Users, Award, Target, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';

const BureauExecutif = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const executives = [
    {
      name: "Dr. Amadou Diallo",
      role: "Président",
      bio: "Expert en sciences de l'éducation avec plus de 20 ans d'expérience dans l'enseignement supérieur africain.",
      image: "👨‍🏫",
      contact: { email: "president@griote.foundation", phone: "+221 XX XXX XX XX" }
    },
    {
      name: "Prof. Fatou Ndiaye",
      role: "Vice-Présidente",
      bio: "Spécialiste en technologies éducatives et directrice de recherche à l'Université Cheikh Anta Diop.",
      image: "👩‍🏫",
      contact: { email: "vice-president@griote.foundation", phone: "+221 XX XXX XX XX" }
    },
    {
      name: "M. Ibrahim Sow",
      role: "Secrétaire Général",
      bio: "Ingénieur en informatique avec une passion pour l'innovation numérique au service de l'éducation.",
      image: "👨‍💼",
      contact: { email: "secretaire@griote.foundation", phone: "+221 XX XXX XX XX" }
    },
    {
      name: "Dr. Amina Traoré",
      role: "Trésorière",
      bio: "Économiste spécialisée dans le financement de l'éducation et le développement durable.",
      image: "👩‍💼",
      contact: { email: "tresorier@griote.foundation", phone: "+221 XX XXX XX XX" }
    }
  ];

  return (
    <div className="min-h-screen bg-griote-white">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main>
        {/* Hero Section */}
        <section className="bg-griote-blue bg-bogolan py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-griote-accent mb-6">
                Bureau Exécutif
              </h1>
              <p className="text-xl text-griote-accent/80 max-w-3xl mx-auto">
                L'équipe dirigeante qui pilote la vision et les opérations de Griote Foundation
              </p>
            </div>
          </div>
        </section>

        {/* Mission du Bureau */}
        <section className="py-16 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-griote-blue mb-8 text-center flex items-center justify-center">
                <Target className="w-8 h-8 mr-3 text-griote-accent" />
                Mission du Bureau Exécutif
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-griote-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-griote-blue mb-3">Leadership</h3>
                  <p className="text-griote-gray-800">
                    Guider la stratégie globale et assurer l'alignement avec la vision panafricaine.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-griote-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-griote-blue mb-3">Gouvernance</h3>
                  <p className="text-griote-gray-800">
                    Superviser les opérations quotidiennes et maintenir les standards d'excellence.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-griote-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-griote-blue mb-3">Innovation</h3>
                  <p className="text-griote-gray-800">
                    Promouvoir l'innovation technologique au service de l'éducation africaine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Membres du Bureau */}
        <section className="py-16 bg-griote-blue bg-kente">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-griote-accent mb-6">
                Membres du Bureau Exécutif
              </h2>
              <p className="text-xl text-griote-accent/80 max-w-3xl mx-auto">
                Découvrez l'équipe qui dirige Griote Foundation vers l'excellence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {executives.map((executive, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <div className="w-20 h-20 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">
                    {executive.image}
                  </div>
                  <h3 className="text-xl font-semibold text-griote-accent mb-2">
                    {executive.name}
                  </h3>
                  <p className="text-griote-accent/80 font-medium mb-4">
                    {executive.role}
                  </p>
                  <p className="text-griote-accent/70 text-sm mb-4">
                    {executive.bio}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-griote-accent/80 text-sm">
                      <Mail className="w-4 h-4 mr-2" />
                      {executive.contact.email}
                    </div>
                    <div className="flex items-center justify-center text-griote-accent/80 text-sm">
                      <Phone className="w-4 h-4 mr-2" />
                      {executive.contact.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-griote-blue mb-6">
                Nous Contacter
              </h2>
              <p className="text-lg text-griote-gray-800 mb-8">
                Pour toute question concernant la gouvernance ou les opérations de Griote Foundation,
                n'hésitez pas à contacter notre bureau exécutif.
              </p>
              <div className="bg-gradient-to-r from-griote-blue/5 to-griote-accent/5 rounded-2xl p-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-griote-accent mr-3" />
                    <span className="text-griote-blue">bureau@griote.foundation</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-griote-accent mr-3" />
                    <span className="text-griote-blue">+221 XX XXX XX XX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BureauExecutif;