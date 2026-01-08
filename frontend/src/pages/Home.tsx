import { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import HeroSection from '../components/home/HeroSection';
import EcosystemSection from '../components/home/EcosystemSection';
import CallToActionSection from '../components/home/CallToActionSection';
import { useAuth } from '../auth/useAuth';
import FaqSection from '../components/home/FaqSection';
import AnnouncementsSection from '../components/AnnouncementsSection';
import { Announcement } from '../components/AnnouncementCard';
import { getPublishedAnnouncements } from '../services/announcement.service';

const Home = () => {
  const { isAuthenticated, logout } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const handleLogout = () => logout();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getPublishedAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-griote-white">
      <Header />

      <main>
        <HeroSection />
        <EcosystemSection />
        <AnnouncementsSection
          announcements={announcements}
          maxDisplay={6}
          showFilters={false}
          title="Annonces Récentes"
          subtitle="Restez informé des dernières opportunités et actualités"
          onView={(id: string) => window.location.href = `/annonces/${id}`}
        />
        <CallToActionSection />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
