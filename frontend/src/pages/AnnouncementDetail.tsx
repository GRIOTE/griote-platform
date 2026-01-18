import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { getAnnouncementById, Announcement, AnnouncementImage } from '@/services/announcement.service';

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;

      try {
        const data = await getAnnouncementById(parseInt(id, 10));
        setAnnouncement(data);
      } catch (err) {
        console.error(err);
        setError('Annonce non trouvée');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-griote-white">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          Chargement...
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-griote-white">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-griote-gray-800 mb-4">
            {error || 'Annonce non trouvée'}
          </h1>
          <Link to="/">
            <Button className="bg-griote-blue text-white">
              Retour à l'accueil
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-griote-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-griote-blue hover:bg-griote-blue-light">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>

        {/* Main Image */}
        {announcement.previewImage && (
          <div className="mb-8">
            <img
              src={announcement.previewImage.url}
              alt={announcement.titre}
              className="w-full max-h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-griote-gray-800 mb-4">
          {announcement.titre}
        </h1>

        {/* Meta Information */}
        <div className="flex items-center space-x-6 mb-8 text-sm text-griote-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(announcement.date_publication || announcement.date_creation).toLocaleDateString('fr-FR')}
          </div>
          {announcement.statut && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Statut: {announcement.statut}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: announcement.contenu }}
            className="text-griote-gray-700 leading-relaxed"
          />
        </div>

        {/* Additional Images */}
        {announcement.images && announcement.images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-griote-gray-800 mb-6">
              Images supplémentaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcement.images.map((image: AnnouncementImage) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={image.description || ''}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AnnouncementDetail;
