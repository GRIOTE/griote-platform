import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnnouncementCard, { type Announcement } from './AnnouncementCard';
import { getPublishedAnnouncements } from '@/services/announcement.service';

interface AnnouncementsSectionProps {
  announcements?: Announcement[];
  maxDisplay?: number;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
  onView?: (id: string) => void;
}

const AnnouncementsSection = ({
  announcements: propAnnouncements,
  maxDisplay = 6,
  showFilters = false,
  title = "Annonces",
  subtitle = "Découvrez les dernières opportunités",
  onView,
}: AnnouncementsSectionProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(propAnnouncements || []);
  const [loading, setLoading] = useState(!propAnnouncements);

  useEffect(() => {
    if (!propAnnouncements) {
      fetchAnnouncements();
    }
  }, [propAnnouncements]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getPublishedAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedAnnouncements = announcements.slice(0, maxDisplay);

  if (loading) {
    return (
      <section className="py-16 bg-griote-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-griote-blue" />
            <p className="text-griote-gray-600">Chargement des annonces...</p>
          </div>
        </div>
      </section>
    );
  }


  if (displayedAnnouncements.length === 0) {
    return (
      <section className="py-16 bg-griote-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-griote-gray-800 mb-4">{title}</h2>
            <p className="text-griote-gray-600 mb-8">{subtitle}</p>
            <p className="text-griote-gray-500">Aucune annonce n'a été trouvée.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-griote-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedAnnouncements.map((announcement, index) => (
            <div
              key={announcement.announcement_id}
              className="transition-all duration-500 ease-out transform opacity-100 translate-y-0"
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <AnnouncementCard
                announcement={announcement}
                onView={onView}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        {announcements.length > maxDisplay && (
          <div className="text-center">
            <Link to="/annonces">
              <Button className="bg-griote-blue hover:bg-griote-blue-dark text-white px-8 py-3">
                Voir toutes les annonces
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
