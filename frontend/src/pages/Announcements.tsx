import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import AnnouncementCard, { Announcement } from '@/components/AnnouncementCard';
import { getPublishedAnnouncements } from '@/services/announcement.service';
import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Megaphone, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);

        const data = await getPublishedAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Erreur lors du chargement des annonces');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleLogout = () => logout();

  const handleAnnouncementClick = (id: string) => {
    window.location.href = `/annonces/${id}`;
  };

  return (
    <div className="min-h-screen bg-griote-white">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-griote-blue mb-4">
              Annonces
            </h1>
            <p className="text-xl text-griote-gray-800/80">
              Découvrez les dernières annonces et opportunités de notre communauté
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-griote-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-griote-gray-600">Chargement des annonces...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert className="max-w-2xl mx-auto mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Announcements Grid */}
          {!isLoading && !error && (
            <>
              {announcements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {announcements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.announcement_id}
                      announcement={announcement}
                      onView={handleAnnouncementClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-32 h-32 bg-griote-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Megaphone className="w-16 h-16 text-griote-accent/50" />
                  </div>
                  <h3 className="text-2xl font-semibold text-griote-gray-800 mb-4">
                    Aucune annonce disponible
                  </h3>
                  <p className="text-griote-gray-600 mb-6 max-w-md mx-auto">
                    Il n'y a pas d'annonces publiées pour le moment. Revenez plus tard pour découvrir les nouvelles opportunités.
                  </p>
                  <Button asChild className="bg-griote-blue text-white hover:bg-griote-blue-dark">
                    <Link to="/recherche">
                      Explorer les projets
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Announcements;
