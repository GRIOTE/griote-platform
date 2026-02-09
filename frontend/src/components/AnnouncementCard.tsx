import { useState } from 'react';
import { Calendar, ExternalLink, MapPin, Play, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from './ui/dialog';
import DefaultAnnouncementImage from './DefaultAnnouncementImage';

// Utility function to strip HTML tags from content
function stripHtmlTags(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export interface Announcement {
  announcement_id: number;
  titre: string;
  contenu: string;
  statut: 'pending' | 'published' | 'archived';
  date_creation: string;
  date_publication?: string | null;
  image_apercu_id?: number | null;
  previewImage?: {
    id: number;
    url: string;
    description?: string;
  } | null;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  onView?: (id: string) => void;
  className?: string;
}

const AnnouncementCard = ({ announcement, onView, className = '' }: AnnouncementCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = announcement.titre;
  // Strip HTML tags before truncating for the card preview
  const plainTextContent = stripHtmlTags(announcement.contenu);
  const description = plainTextContent.length > 150
    ? plainTextContent.substring(0, 150) + '...'
    : plainTextContent;
  const publishedAt = announcement.date_publication || announcement.date_creation;

  const handleCardClick = () => {
    setIsModalOpen(true);
    if (onView) {
      onView(announcement.announcement_id.toString());
    }
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Reset image error when modal closes so it retries on next open
      setImageError(false);
    }
  };

  // Fonction pour nettoyer et render le contenu HTML
  const renderContent = (htmlContent: string) => {
    // Si le contenu contient des balises HTML, on le rend comme HTML
    if (htmlContent.includes('<') && htmlContent.includes('>')) {
      return (
        <div 
          className="prose prose-lg max-w-none text-griote-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }
    // Sinon, on l'affiche comme texte brut avec des sauts de ligne
    return (
      <div className="text-griote-gray-700 leading-relaxed whitespace-pre-wrap">
        {htmlContent}
      </div>
    );
  };

  return (
    <>
      <Card
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-griote-white border-griote-gray-100 ${className}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          {/* Media Section */}
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            {announcement.previewImage && !imageError ? (
              <img
                src={announcement.previewImage.url}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <DefaultAnnouncementImage
                type="OPPORTUNITY"
                className="w-full h-full"
              />
            )}
          </div>

          <div className="p-6">
            {/* Title */}
            <h3 className="text-lg font-semibold text-griote-gray-800 mb-2 line-clamp-2 group-hover:text-griote-blue transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-griote-gray-600 mb-4 line-clamp-3">
              {description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-griote-gray-100">
              <span className="text-xs text-griote-gray-600">
                {new Date(publishedAt).toLocaleDateString('fr-FR')}
              </span>

              <Button
                size="sm"
                className="bg-griote-blue text-white hover:bg-griote-blue-dark text-xs px-4 py-1"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal pour afficher les détails de l'annonce */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </DialogClose>
          
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-griote-gray-800">
              {title}
            </DialogTitle>
            <DialogDescription className="flex items-center text-sm text-griote-gray-600 mt-2">
              <Calendar className="w-4 h-4 mr-2" />
              Publié le {new Date(publishedAt).toLocaleDateString('fr-FR')}
            </DialogDescription>
          </DialogHeader>

          {/* Image */}
          <div className="relative h-64 w-full overflow-hidden rounded-lg mt-4">
            {announcement.previewImage && !imageError ? (
              <img
                src={announcement.previewImage.url}
                alt={title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <DefaultAnnouncementImage
                type="OPPORTUNITY"
                className="w-full h-full"
              />
            )}
          </div>

          {/* Contenu */}
          <div className="mt-6">
            {renderContent(announcement.contenu)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnnouncementCard;
