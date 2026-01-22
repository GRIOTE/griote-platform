import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../auth/useAuth';
import DanielImg from '../assets/staff/Daniel.jpeg';
import { ExecutiveCard, Divider } from '../components/ExecutiveCard';
import IdrissImg from '../assets/staff/Idriss.jpeg';
import BrandonImg from '../assets/staff/Brandon.jpeg';

const BureauExecutif = () => {
  const { isAuthenticated, logout } = useAuth();

  const executives = [
    {
      name: "M. Daniel Ekwel",
      role: "Présidente National",
      image: DanielImg,
      contact: {
        email: "danielekwel4@gmail.com",
        linkedin: "https://www.linkedin.com/in/daniel-ekwel"
      }
    },
    {
      name: "Mr. Nango idriss",
      role: "Vice-Président 1",
      image: IdrissImg,
      contact: { 
        email: "vice-president@griote.foundation",
        linkedin: "https://www.linkedin.com/in/idriss-nango-706abb253"
       }
      
    },
    {
      name: "Mr. Kamga Brandon",
      role: "Vice-Président 2",
      image: BrandonImg,
      contact: { 
        email: "brandonkamga237@gmail.com",
        linkedin : "https://www.linkedin.com/in/brandon-duclerc-tamwa-kamga/"
       }
    },
    {
      name: "M. Ibrahim Sow",
      role: "Secrétaire Général",
      image: "/images/ibrahim.jpg",
      contact: {
        email: "secretaire@griote.foundation",
        linkedin: "https://linkedin.com/in/ibrahimsow"
      }
    }
  ];

  const contributors = Array.from({ length: 6 }, (_, i) => ({
    name: `Contributeur ${i + 1}`,
    role: "Contributeur",
    image: "/images/african-person.jpg",
    contact: {}
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-primary/80 to-accent/70 py-28 text-left overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg"
            alt="Motif culturel africain"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Bureau Exécutif
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Découvrez l'équipe qui pilote Griote Project-Africa avec vision, leadership et innovation.
          </p>
        </div>

      </section>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-20">

        {/* PRESIDENT */}
        <Section title="">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExecutiveCard executive={executives[0]} />
          </div>
        </Section>

        {/* DIRECTION */}
        <Section title="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {executives.slice(1, 3).map(exec => (
              <ExecutiveCard key={exec.name} executive={exec} />
            ))}
          </div>
        </Section>

        {/* ADMINISTRATION */}
        <Section title="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {executives.slice(3).map(exec => (
              <ExecutiveCard key={exec.name} executive={exec} />
            ))}
          </div>
        </Section>

        {/* CONTRIBUTEURS */}
        <Section
          title="Autres contributeurs au projet"
          subtitle="Des profils engagés qui participent activement au rayonnement et à l’impact du projet."
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {contributors.map(c => (
              <ExecutiveCard key={c.name} executive={c} />
            ))}
          </div>
        </Section>

      </main>

      <Footer />
    </div>
  );
};

export default BureauExecutif;

/* =========================
   COMPONENTS (INLINE)
========================= */

const Section = ({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section>
    <div className="mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground mt-1 max-w-3xl">
          {subtitle}
        </p>
      )}
      <div className="mt-4 border-t border-gray-300" />
    </div>
    {children}
  </section>
);

