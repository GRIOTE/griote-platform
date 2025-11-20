import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard'; // Assurez-vous que ce chemin est correct

interface RecentDepositsSectionProps {
  recentDepots: {
    id: string;
    title: string;
    author: string;
    userType: 'STUDENT' | 'TEACHER' | 'INDEPENDENT';
    category: string;
    date: string;
    tags: string[];
    isPublic: boolean;
    description?: string;
  }[];
  handleDepotView: (id: string) => void;
  handleDepotDownload: (id: string) => void;
}

const RecentDepositsSection = ({ recentDepots, handleDepotView, handleDepotDownload }: RecentDepositsSectionProps) => {
  return (
    <section className="py-16 bg-griote-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-griote-gray-800 mb-4">
            Dépôts Récents
          </h2>
          <p className="text-lg sm:text-xl text-griote-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez les derniers travaux partagés par notre communauté académique panafricaine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {recentDepots.map((depot, index) => (
            <div
              key={depot.id}
              className={`transition-all duration-500 ease-out transform ${
                index % 2 === 0 ? 'animate-slide-up' : 'animate-slide-down'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProjectCard
                title={depot.title}
                author={depot.author}
                userType={depot.userType}
                category={depot.category}
                date={depot.date}
                tags={depot.tags}
                isPublic={depot.isPublic}
                description={depot.description}
                onView={() => handleDepotView(depot.id)}
                onDownload={() => handleDepotDownload(depot.id)}
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/recherche">
            <Button className="bg-griote-blue text-white hover:bg-griote-blue-dark text-lg px-8 py-4 rounded-lg font-semibold transition-colors duration-300">
              Voir tous les dépôts
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentDepositsSection;