import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Users, Code, BookOpen, Heart, Github, Linkedin, Mail } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '../components/ui/button';

const Contributeurs = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => logout();

  const contributors = [
    {
      name: "Dr. Kofi Mensah",
      role: "Chercheur en IA",
      contribution: "Développement de Griote AI et algorithmes de recommandation",
      image: "/images/kofi.jpg",
      expertise: "Intelligence Artificielle",
      social: { github: "kofi-ai", linkedin: "kofi-mensah", email: "kofi@griote.foundation" }
    },
    {
      name: "Ing. Nia Sow",
      role: "Développeuse Full-Stack",
      contribution: "Architecture de la plateforme et développement frontend/backend",
      image: "/images/nia.jpg",
      expertise: "Développement Web",
      social: { github: "nia-dev", linkedin: "nia-sow", email: "nia@griote.foundation" }
    },
    {
      name: "Prof. Jean-Baptiste Nkurunziza",
      role: "Expert en Éducation",
      contribution: "Conception pédagogique et validation des contenus académiques",
      image: "/images/jb.jpg",
      expertise: "Pédagogie",
      social: { linkedin: "jb-nkurunziza", email: "jb@griote.foundation" }
    },
    {
      name: "Dr. Zainab Okafor",
      role: "Designer UX/UI",
      contribution: "Design de l'interface utilisateur et expérience utilisateur",
      image: "/images/zainab.jpg",
      expertise: "Design UX/UI",
      social: { linkedin: "zainab-okafor", email: "zainab@griote.foundation" }
    },
    {
      name: "M. Ahmed Hassan",
      role: "Spécialiste DevOps",
      contribution: "Infrastructure cloud et déploiement automatisé",
      image: "/images/ahmed.jpg",
      expertise: "DevOps & Cloud",
      social: { github: "ahmed-devops", linkedin: "ahmed-hassan", email: "ahmed@griote.foundation" }
    },
    {
      name: "Dr. Mariam Diallo",
      role: "Ethnologue",
      contribution: "Recherche sur les traditions orales africaines et validation culturelle",
      image: "/images/mariam.jpg",
      expertise: "Ethnologie",
      social: { linkedin: "mariam-diallo", email: "mariam@griote.foundation" }
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-blue-900 py-28 text-center relative">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg"
              alt="Motif culturel africain"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6">Nos Contributeurs</h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Découvrez la communauté d’experts qui enrichit Griote Project-Africa avec savoir, technologie et passion.
            </p>
          </div>
        </section>

        {/* Rôle des contributeurs */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-7xl text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Le Rôle des Contributeurs</h2>
            <p className="text-lg text-foreground/70 max-w-4xl mx-auto mb-12">
              La valeur ajoutée de nos contributeurs repose sur l’innovation technique, l’expertise académique et la construction d’une communauté dynamique.
            </p>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <Code className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Innovation Technique</h3>
                <p className="text-foreground/80 text-center">Développement technologique et amélioration continue de la plateforme.</p>
              </div>
              <div className="flex flex-col items-center">
                <BookOpen className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expertise Académique</h3>
                <p className="text-foreground/80 text-center">Validation des contenus et enrichissement du savoir académique africain.</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Communauté</h3>
                <p className="text-foreground/80 text-center">Construction d'une communauté solidaire d'académiciens africains.</p>
              </div>
            </div>
          </div>

          {/* Liste des contributeurs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {contributors.map((c, i) => (
              <Card key={i} className="p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all">
                <img src={c.image} alt={c.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover" />
                <h3 className="text-2xl font-bold mb-2 text-center">{c.name}</h3>
                <p className="text-primary font-semibold text-center mb-2">{c.role}</p>
                <p className="text-foreground/80 text-center mb-4">{c.expertise}</p>
                <p className="text-foreground/70 text-center mb-4">{c.contribution}</p>
                <div className="flex justify-center space-x-4">
                  {c.social.github && <a href={`https://github.com/${c.social.github}`} className="text-primary hover:underline">GitHub</a>}
                  {c.social.linkedin && <a href={`https://linkedin.com/in/${c.social.linkedin}`} className="text-primary hover:underline">LinkedIn</a>}
                  <a href={`mailto:${c.social.email}`} className="text-primary hover:underline">Email</a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gradient-to-br from-primary to-blue-900 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Devenir Contributeur</h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez notre communauté d’experts et participez à la valorisation des savoirs africains.
            </p>
            <Button asChild>
              <a href="mailto:contribute@griote.foundation" className="px-12 py-5 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90">
                Nous Contacter
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contributeurs;
