import React from 'react';
import { Megaphone, Calendar, Award, Users, BookOpen } from 'lucide-react';

interface DefaultAnnouncementImageProps {
  type?: 'SCHOLARSHIP' | 'EVENT' | 'OPPORTUNITY' | 'CONFERENCE' | 'WORKSHOP';
  className?: string;
}

const DefaultAnnouncementImage: React.FC<DefaultAnnouncementImageProps> = ({ 
  type = 'OPPORTUNITY', 
  className = '' 
}) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'SCHOLARSHIP':
        return { Icon: Award, bgColor: 'bg-gradient-to-br from-griote-accent to-yellow-400', iconColor: 'text-griote-blue' };
      case 'EVENT':
        return { Icon: Calendar, bgColor: 'bg-gradient-to-br from-griote-blue to-blue-500', iconColor: 'text-white' };
      case 'CONFERENCE':
        return { Icon: Users, bgColor: 'bg-gradient-to-br from-griote-gray-600 to-gray-500', iconColor: 'text-white' };
      case 'WORKSHOP':
        return { Icon: BookOpen, bgColor: 'bg-gradient-to-br from-griote-success to-green-500', iconColor: 'text-white' };
      default:
        return { Icon: Megaphone, bgColor: 'bg-gradient-to-br from-griote-accent to-yellow-400', iconColor: 'text-griote-blue' };
    }
  };

  const { Icon, bgColor, iconColor } = getIconAndColor();

  return (
    <div className={`${bgColor} ${className} flex items-center justify-center relative overflow-hidden`}>
      {/* Pattern de fond subtil */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45"></div>
      </div>
      
      {/* Icône principale */}
      <Icon className={`w-12 h-12 ${iconColor} relative z-10`} />
      
      {/* Éléments décoratifs */}
      <div className="absolute top-2 right-2 w-3 h-3 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-3 left-3 w-2 h-2 bg-white/30 rounded-full"></div>
      <div className="absolute top-1/2 left-2 w-1 h-1 bg-white/40 rounded-full"></div>
    </div>
  );
};

export default DefaultAnnouncementImage;
