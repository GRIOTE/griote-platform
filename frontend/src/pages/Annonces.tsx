
import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import AnnouncementsSection from '@/components/AnnouncementsSection';

const Annonces = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-blue-900 py-28 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://img.freepik.com/free-vector/ethnic-seamless-pattern-background-black-white-aztec-design-vector_53876-154221.jpg"
              alt="Motif culturel africain"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-accent mb-8">
              Toutes les Annonces
            </h1>
            <p className="text-xl font-black lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Découvrez toutes les opportunités, bourses, événements et formations
              disponibles pour la communauté académique africaine.
            </p>
          </div>
        </section>

        {/* Announcements with Filters */}
        <AnnouncementsSection
          maxDisplay={50}
          showFilters={true}
          title="Toutes les Annonces"
          subtitle="Découvrez toutes les opportunités disponibles"
        />
      </main>

      <Footer />
    </div>
  );
};

export default Annonces;
