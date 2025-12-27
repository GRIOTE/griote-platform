import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import EcosystemSection  from '@/components/home/EcosystemSection';
import WhyGrioteSection from '@/components/WhyGrioteSection';
import CallToActionSection from '@/components/CallToActionSection';
import JoinMouvementSection from '@/components/home/JoinMouvementSection';
import { useAuth } from '@/auth/useAuth';


const Home = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => logout();

  return (
    <div className="min-h-screen bg-griote-white">
      {/* HEADER */}
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Why Griote Section */}
        <WhyGrioteSection />

        {/* Ecosystem Section */}
        <EcosystemSection />

        {/* Call to Action Section */}
        <CallToActionSection />

        {/*  Join Mouvement Section */}
        <JoinMouvementSection />

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;
