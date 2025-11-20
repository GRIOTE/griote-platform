import { Calendar, User, BookOpen, Lock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  title: string;
  author: string;
  userType: 'STUDENT' | 'TEACHER' | 'INDEPENDENT';
  category: string;
  date: string;
  tags: string[];
  isPublic: boolean;
  description?: string;
  onView?: () => void;
  onDownload?: () => void;
  showActions?: boolean;
}

const ProjectCard = ({
  title,
  author,
  userType,
  category,
  date,
  tags,
  isPublic,
  description,
  onView,
  onDownload,
  showActions = true,
}: ProjectCardProps) => {
  return (
    <div className="p-6 rounded-2xl bg-griote-white transition-all duration-300 transform hover:bg-griote-gray-50 cursor-pointer shadow-md hover:shadow-xl relative overflow-hidden border border-griote-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold mb-1 line-clamp-2 text-griote-gray-800">{title}</h3>
          <div className="flex items-center space-x-2 text-griote-gray-600 mb-1">
            <User className="w-4 h-4 text-griote-accent" />
            <span>{author} ({userType})</span>
          </div>
          <Badge className="text-xs bg-griote-accent text-white px-2 py-1 rounded font-medium">
            {category}
          </Badge>
        </div>
        <div className="ml-4">
          {isPublic ? (
            <BookOpen className="w-6 h-6 text-griote-success" />
          ) : (
            <Lock className="w-6 h-6 text-griote-gray-600" />
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-griote-gray-600 mb-4 line-clamp-3">{description}</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 3).map((tag, index) => (
          <Badge
            key={index}
            className="bg-griote-blue-light text-griote-blue px-2 py-1 rounded flex items-center text-xs hover:bg-griote-accent hover:text-white transition-colors duration-200"
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </Badge>
        ))}
        {tags.length > 3 && (
          <Badge className="text-griote-gray-600 text-xs bg-griote-gray-100 px-2 py-1 rounded">
            +{tags.length - 3}
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-griote-gray-100">
        <div className="flex items-center space-x-2 text-griote-gray-600">
          <Calendar className="w-4 h-4 text-griote-accent" />
          <span>{date}</span>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            {onView && (
              <Button
                onClick={onView}
                size="sm"
                variant="outline"
                className="px-3 py-1 text-xs border-griote-blue text-griote-blue hover:bg-griote-blue hover:text-white rounded-lg"
              >
                Voir plus
              </Button>
            )}
            {isPublic && onDownload && (
              <Button
                onClick={onDownload}
                size="sm"
                className="px-3 py-1 text-xs bg-griote-accent text-white hover:bg-orange-600 rounded-lg"
              >
                Télécharger
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;