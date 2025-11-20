import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import AnnouncementCard, { Announcement } from './AnnouncementCard';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  maxDisplay?: number;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
}

const AnnouncementsSection = ({ 
  announcements, 
  maxDisplay = 6, 
  showFilters = false,
  title = "Annonces",
  subtitle = "Découvrez les dernières opportunités"
}: AnnouncementsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Intelligent prioritization algorithm
  const prioritizedAnnouncements = useMemo(() => {
    let filtered = announcements;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (announcement) =>
          announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(announcement => announcement.type === selectedType);
    }

    // Smart prioritization
    return filtered.sort((a, b) => {
      // 1. Sponsored content gets priority
      if (a.isSponsored && !b.isSponsored) return -1;
      if (!a.isSponsored && b.isSponsored) return 1;

      // 2. High priority items
      const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      const priorityDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (priorityDiff !== 0) return -priorityDiff;

      // 3. Urgent deadlines (within 7 days)
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const aIsUrgent = a.deadline && new Date(a.deadline) <= sevenDaysFromNow;
      const bIsUrgent = b.deadline && new Date(b.deadline) <= sevenDaysFromNow;
      
      if (aIsUrgent && !bIsUrgent) return -1;
      if (!aIsUrgent && bIsUrgent) return 1;

      // 4. Recent publications
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }).slice(0, maxDisplay);
  }, [announcements, searchTerm, selectedType, maxDisplay]);

  const announcementTypes = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'SCHOLARSHIP', label: 'Bourses' },
    { value: 'EVENT', label: 'Événements' },
    { value: 'OPPORTUNITY', label: 'Opportunités' },
    { value: 'CONFERENCE', label: 'Conférences' },
    { value: 'WORKSHOP', label: 'Ateliers' }
  ];

  return (
    <section className="py-16 bg-griote-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-griote-gray-800 mb-4">
            {title}
          </h2>
          <p className="text-lg text-griote-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={`mb-8 transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '200ms' }}>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-griote-gray-600" />
                <Input
                  type="text"
                  placeholder="Rechercher une annonce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-griote-gray-100 focus:border-griote-blue"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-griote-gray-600" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-griote-gray-100 rounded-md focus:outline-none focus:border-griote-blue bg-griote-white"
                >
                  {announcementTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {prioritizedAnnouncements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`transition-all duration-500 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <AnnouncementCard
                announcement={announcement}
                onView={(id) => console.log('View announcement:', id)}
              />
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {announcements.length > maxDisplay && (
          <div className={`text-center transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '600ms' }}>
            <Link to="/annonces">
              <Button className="bg-griote-blue text-white hover:bg-griote-blue-dark px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                Voir toutes les annonces
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Empty State */}
        {prioritizedAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-semibold text-griote-gray-800 mb-2">
              Aucune annonce trouvée
            </h3>
            <p className="text-griote-gray-600">
              {searchTerm || selectedType !== 'ALL' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucune annonce disponible pour le moment'
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
