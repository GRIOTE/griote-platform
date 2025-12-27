import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Users, Code, BookOpen, Heart, Github, Linkedin, Mail } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';

const Contributeurs = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const contributors = [
    {
      name: "Dr. Kofi Mensah",
      role: "Chercheur en IA",
      contribution: "Développement de Griote AI et algorithmes de recommandation",
      image: "👨‍🔬",
      expertise: "Intelligence Artificielle",
      social: { github: "kofi-ai", linkedin: "kofi-mensah", email: "kofi@griote.foundation" }
    },
    {
      name: "Ing. Nia Sow",
      role: "Développeuse Full-Stack",
      contribution: "Architecture de la plateforme et développement frontend/backend",
      image: "👩‍💻",
      expertise: "Développement Web",
      social: { github: "nia-dev", linkedin: "nia-sow", email: "nia@griote.foundation" }
    },
    {
      name: "Prof. Jean-Baptiste Nkurunziza",
      role: "Expert en Éducation",
      contribution: "Conception pédagogique et validation des contenus académiques",
      image: "👨‍🏫",
      expertise: "Pédagogie",
      social: { linkedin: "jb-nkurunziza", email: "jb@griote.foundation" }
    },
    {
      name: "Dr. Zainab Okafor",
      role: "Designer UX/UI",
      contribution: "Design de l'interface utilisateur et expérience utilisateur",
      image: "👩‍🎨",
      expertise: "Design UX/UI",
      social: { linkedin: "zainab-okafor", email: "zainab@griote.foundation" }
    },
    {
      name: "M. Ahmed Hassan",
      role: "Spécialiste DevOps",
      contribution: "Infrastructure cloud et déploiement automatisé",
      image: "👨‍🔧",
      expertise: "DevOps & Cloud",
      social: { github: "ahmed-devops", linkedin: "ahmed-hassan", email: "ahmed@griote.foundation" }
    },
    {
      name: "Dr. Mariam Diallo",
      role: "Ethnologue",
      contribution: "Recherche sur les traditions orales africaines et validation culturelle",
      image: "👩‍🎓",
      expertise: "Ethnologie",
      social: { linkedin: "mariam-diallo", email: "mariam@griote.foundation" }
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
                Nos Contributeurs
              </h1>
              <p className="text-xl text-griote-accent/80 max-w-3xl mx-auto">
                La communauté d'experts qui enrichit et fait vivre Griote Foundation
              </p>
            </div>
          </div>
        </section>

        {/* Rôle des Contributeurs */}
        <section className="py-16 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-griote-blue mb-8 text-center flex items-center justify-center">
                <Heart className="w-8 h-8 mr-3 text-griote-accent" />
                Le Rôle des Contributeurs
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-griote-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-griote-blue mb-3">Innovation Technique</h3>
                  <p className="text-griote-gray-800">
                    Développement technologique et amélioration continue de la plateforme.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-griote-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-griote-blue mb-3">Expertise Académique</h3>
                  <p className="text-griote-gray-800">
                    Validation des contenus et enrichissement du savoir académique africain.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-griote-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-griote-blue mb-3">Communauté</h3>
                  <p className="text-griote-gray-800">
                    Construction d'une communauté solidaire d'académiciens africains.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Équipe des Contributeurs */}
        <section className="py-16 bg-griote-blue bg-kente">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-griote-accent mb-6">
                Équipe des Contributeurs
              </h2>
              <p className="text-xl text-griote-accent/80 max-w-3xl mx-auto">
                Découvrez les talents qui font avancer Griote Foundation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contributors.map((contributor, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-griote-accent rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                      {contributor.image}
                    </div>
                    <h3 className="text-xl font-semibold text-griote-accent mb-1">
                      {contributor.name}
                    </h3>
                    <p className="text-griote-accent/80 font-medium mb-2">
                      {contributor.role}
                    </p>
                    <span className="inline-block bg-griote-accent/20 text-griote-accent px-3 py-1 rounded-full text-sm">
                      {contributor.expertise}
                    </span>
                  </div>

                  <p className="text-griote-accent/70 text-sm mb-4 text-center">
                    {contributor.contribution}
                  </p>

                  <div className="flex justify-center space-x-3">
                    {contributor.social.github && (
                      <a href={`https://github.com/${contributor.social.github}`} className="text-griote-accent/60 hover:text-griote-accent transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {contributor.social.linkedin && (
                      <a href={`https://linkedin.com/in/${contributor.social.linkedin}`} className="text-griote-accent/60 hover:text-griote-accent transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    <a href={`mailto:${contributor.social.email}`} className="text-griote-accent/60 hover:text-griote-accent transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Devenir Contributeur */}
        <section className="py-16 bg-griote-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-griote-blue mb-6">
                Devenir Contributeur
              </h2>
              <p className="text-lg text-griote-gray-800 mb-8">
                Vous souhaitez contribuer au développement de Griote Foundation ?
                Rejoignez notre communauté d'experts et participez à la valorisation des savoirs africains.
              </p>
              <div className="bg-gradient-to-r from-griote-blue/5 to-griote-accent/5 rounded-2xl p-8">
                <p className="text-griote-blue font-medium mb-4">
                  Nous recherchons des profils dans les domaines suivants :
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="bg-griote-accent/10 text-griote-accent px-4 py-2 rounded-full text-sm">Intelligence Artificielle</span>
                  <span className="bg-griote-accent/10 text-griote-accent px-4 py-2 rounded-full text-sm">Développement Web</span>
                  <span className="bg-griote-accent/10 text-griote-accent px-4 py-2 rounded-full text-sm">Design UX/UI</span>
                  <span className="bg-griote-accent/10 text-griote-accent px-4 py-2 rounded-full text-sm">DevOps</span>
                  <span className="bg-griote-accent/10 text-griote-accent px-4 py-2 rounded-full text-sm">Recherche Académique</span>
                </div>
                <a href="mailto:contribute@griote.foundation" className="inline-block mt-6 bg-griote-accent text-griote-blue px-6 py-3 rounded-lg font-semibold hover:bg-griote-accent/90 transition-colors">
                  Nous Contacter
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contributeurs;