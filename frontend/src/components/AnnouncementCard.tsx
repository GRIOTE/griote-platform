import { useState } from 'react';
import { Calendar, ExternalLink, MapPin, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DefaultAnnouncementImage from './DefaultAnnouncementImage';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  type: 'SCHOLARSHIP' | 'EVENT' | 'OPPORTUNITY' | 'CONFERENCE' | 'WORKSHOP';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  organization: string;
  location?: string;
  deadline?: string;
  publishedAt: string;
  externalUrl?: string;
  internalPath?: string;
  media?: {
    type: 'IMAGE' | 'VIDEO';
    url: string;
    thumbnail?: string;
  };
  tags: string[];
  isSponsored?: boolean;
  participantCount?: number;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  onView?: (id: string) => void;
  className?: string;
}

const AnnouncementCard = ({ announcement, onView, className = '' }: AnnouncementCardProps) => {
  const [imageError, setImageError] = useState(false);


  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SCHOLARSHIP': return 'Bourse';
      case 'EVENT': return 'Événement';
      case 'OPPORTUNITY': return 'Opportunité';
      case 'CONFERENCE': return 'Conférence';
      case 'WORKSHOP': return 'Atelier';
      default: return 'Annonce';
    }
  };

  const handleCardClick = () => {
    if (announcement.externalUrl) {
      window.open(announcement.externalUrl, '_blank');
    } else if (announcement.internalPath) {
      window.location.href = announcement.internalPath;
    } else if (onView) {
      onView(announcement.id);
    }
  };


  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-griote-white border-griote-gray-100 ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Media Section */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {announcement.media && !imageError ? (
            announcement.media.type === 'IMAGE' ? (
              <img
                src={announcement.media.url}
                alt={announcement.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="relative">
                <img
                  src={announcement.media.thumbnail || '/api/placeholder/400/200'}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
            )
          ) : (
            <DefaultAnnouncementImage 
              type={announcement.type}
              className="w-full h-full"
            />
          )}
          
          {/* Sponsored Badge */}
          {announcement.isSponsored && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-griote-accent text-griote-blue border-0">
                Sponsorisé
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Badge className="bg-griote-accent text-griote-blue text-xs px-2 py-1">
                {getTypeLabel(announcement.type)}
              </Badge>
            </div>
            {announcement.externalUrl && (
              <ExternalLink className="w-4 h-4 text-griote-gray-600" />
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-griote-gray-800 mb-2 line-clamp-2 group-hover:text-griote-blue transition-colors">
            {announcement.title}
          </h3>

          {/* Organization */}
          <p className="text-sm text-griote-blue font-medium mb-2">
            {announcement.organization}
          </p>

          {/* Description */}
          <p className="text-sm text-griote-gray-600 mb-4 line-clamp-3">
            {announcement.description}
          </p>

          {/* Meta Information */}
          <div className="space-y-2 mb-4">
            {announcement.location && (
              <div className="flex items-center text-xs text-griote-gray-600">
                <MapPin className="w-3 h-3 mr-1" />
                {announcement.location}
              </div>
            )}
            
            {announcement.deadline && (
              <div className="flex items-center text-xs text-griote-gray-600">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Échéance: {new Date(announcement.deadline).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {announcement.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                className="text-xs bg-griote-gray-100 text-griote-gray-600 hover:bg-griote-blue-light hover:text-griote-blue transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {announcement.tags.length > 3 && (
              <Badge className="text-xs bg-griote-gray-100 text-griote-gray-600">
                +{announcement.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-griote-gray-100">
            <span className="text-xs text-griote-gray-600">
              {new Date(announcement.publishedAt).toLocaleDateString('fr-FR')}
            </span>
            
            <Button
              size="sm"
              className="bg-griote-blue text-white hover:bg-griote-blue-dark text-xs px-4 py-1"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              {announcement.externalUrl ? 'Voir l\'offre' : 'En savoir plus'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
