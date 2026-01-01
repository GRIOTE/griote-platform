import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/useAuth';
import { Mail, Linkedin } from 'lucide-react';
import { Tree, TreeNode } from 'react-organizational-chart';

const BureauExecutif = () => {
  const { isAuthenticated, logout } = useAuth();

  const executives = [
    {
      name: "Dr. Amadou Diallo",
      role: "Président",
      image: "/images/amadou.jpg",
      contact: { email: "president@griote.foundation", linkedin: "https://linkedin.com/in/amadoudiallo" }
    },
    {
      name: "Prof. Fatou Ndiaye",
      role: "Vice-Présidente",
      image: "/images/fatou.jpg",
      contact: { email: "vice-president@griote.foundation" }
    },
    {
      name: "M. Ibrahim Sow",
      role: "Secrétaire Général",
      image: "/images/ibrahim.jpg",
      contact: { email: "secretaire@griote.foundation", linkedin: "https://linkedin.com/in/ibrahimsow" }
    },
    {
      name: "Dr. Amina Traoré",
      role: "Trésorière",
      image: "/images/amina.jpg",
      contact: { email: "tresorier@griote.foundation" }
    }
  ];

  const handleLogout = () => logout();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary to-blue-900 py-28 text-center relative">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg"
              alt="Motif culturel africain"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6">Bureau Exécutif</h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Découvrez l'équipe qui pilote Griote Project-Africa avec vision, leadership et innovation.
            </p>
          </div>
        </section>

        {/* Organigramme */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <h2 className="text-4xl font-bold mb-12">Organigramme du Bureau Exécutif</h2>
            <div className="overflow-x-auto">
              <Tree
                label={
                  <div className="bg-primary text-white p-6 rounded-3xl shadow-lg inline-block min-w-[220px]">
                    <img src={executives[0].image} alt={executives[0].name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                    <h3 className="text-xl font-bold">{executives[0].name}</h3>
                    <p className="text-white/80 mb-2">{executives[0].role}</p>
                    <div className="flex flex-col gap-1 text-sm">
                      {executives[0].contact.email && (
                        <a href={`mailto:${executives[0].contact.email}`} className="hover:underline flex items-center justify-center gap-2">
                          <Mail className="w-4 h-4" /> {executives[0].contact.email}
                        </a>
                      )}
                      {executives[0].contact.linkedin && (
                        <a href={executives[0].contact.linkedin} target="_blank" className="hover:underline flex items-center justify-center gap-2">
                          <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                }
              >
                <TreeNode
                  label={
                    <div className="bg-primary text-white p-6 rounded-3xl shadow-lg inline-block min-w-[220px]">
                      <img src={executives[1].image} alt={executives[1].name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                      <h3 className="text-xl font-bold">{executives[1].name}</h3>
                      <p className="text-white/80 mb-2">{executives[1].role}</p>
                      {executives[1].contact.email && (
                        <a href={`mailto:${executives[1].contact.email}`} className="hover:underline text-sm block">{executives[1].contact.email}</a>
                      )}
                    </div>
                  }
                />
                <TreeNode
                  label={
                    <div className="flex gap-6 justify-center">
                      {[2,3].map(i => (
                        <div key={i} className="bg-primary text-white p-6 rounded-3xl shadow-lg inline-block min-w-[220px]">
                          <img src={executives[i].image} alt={executives[i].name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                          <h3 className="text-xl font-bold">{executives[i].name}</h3>
                          <p className="text-white/80 mb-2">{executives[i].role}</p>
                          {executives[i].contact.email && (
                            <a href={`mailto:${executives[i].contact.email}`} className="hover:underline text-sm block">{executives[i].contact.email}</a>
                          )}
                          {executives[i].contact.linkedin && (
                            <a href={executives[i].contact.linkedin} target="_blank" className="hover:underline text-sm block">LinkedIn</a>
                          )}
                        </div>
                      ))}
                    </div>
                  }
                />
              </Tree>
            </div>
          </div>
        </section>

        {/* Contact général du bureau */}
        <section className="py-20 bg-primary text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-4">Nous Contacter</h2>
            <p className="text-white/80 mb-8">
              Pour toute question concernant la gouvernance ou les opérations de la fondation.
            </p>
            <Button asChild>
              <a href="mailto:bureau@griote.foundation" className="px-12 py-5 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90">
                Envoyer un message
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BureauExecutif;
