import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HeroSection from '@/components/HeroSection';
import WhyGrioteSection from '@/components/WhyGrioteSection';
import GrioteAISection from '@/components/GrioteAISection';
import AnnouncementsSection from '@/components/AnnouncementsSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecentDepositsSection from '@/components/RecentDepositSection';
import CallToActionSection from '@/components/CallToActionSection';
import { Announcement } from '@/components/AnnouncementCard';
import { useAuth } from '@/contexts/AuthContext';

// Interface pour les dépôts récents
interface Depot {
  id: string;
  title: string;
  author: string;
  userType: 'STUDENT' | 'TEACHER' | 'INDEPENDENT';
  category: string;
  date: string;
  tags: string[];
  isPublic: boolean;
  description: string;
}

// Mock data pour les dépôts récents
const recentDepots: Depot[] = [
  {
    id: '1',
    title: 'Intelligence Artificielle et Agriculture Durable',
    author: 'Aminata Diallo',
    userType: 'STUDENT',
    category: 'RESEARCH_PROJECT',
    date: '15 nov. 2024',
    tags: ['IA', 'Agriculture', 'Durabilité'],
    isPublic: true,
    description: "Optimisation des rendements agricoles avec l'IA tout en préservant l'environnement.",
  },
  {
    id: '2',
    title: 'Systèmes de Santé Communautaire',
    author: 'Dr. Kwame Asante',
    userType: 'TEACHER',
    category: 'PEER_REVIEWED_ARTICLE',
    date: '12 nov. 2024',
    tags: ['Santé', 'Communauté', 'Politique'],
    isPublic: true,
    description: 'Comparatif des systèmes de santé communautaire en Afrique de l’Ouest.',
  },
  {
    id: '3',
    title: 'Éducation Numérique et Langues Africaines',
    author: 'Fatima El-Rashid',
    userType: 'INDEPENDENT',
    category: 'COURSE_WORK',
    date: '10 nov. 2024',
    tags: ['Éducation', 'Numérique', 'Langues'],
    isPublic: true,
    description: 'Création d’outils éducatifs numériques intégrant les langues locales.',
  },
];

// Mock data pour les annonces
const sampleAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Bourse d\'Excellence Africaine 2024 - Master et Doctorat',
    description: 'Programme de bourses complet couvrant les frais de scolarité, hébergement et allocation mensuelle pour les étudiants africains exceptionnels.',
    type: 'SCHOLARSHIP',
    priority: 'HIGH',
    organization: 'Fondation Africaine pour l\'Excellence',
    location: 'Plusieurs pays africains',
    deadline: '2024-12-15',
    publishedAt: '2024-11-01',
    externalUrl: 'https://example.com/bourse-excellence',
    media: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=200&fit=crop'
    },
    tags: ['Bourse', 'Master', 'Doctorat', 'Excellence'],
    isSponsored: true
  },
  {
    id: '2',
    title: 'Conférence Internationale sur l\'IA en Afrique',
    description: 'Rejoignez les leaders de l\'intelligence artificielle pour discuter de l\'avenir de l\'IA sur le continent africain.',
    type: 'CONFERENCE',
    priority: 'HIGH',
    organization: 'AI Africa Summit',
    location: 'Lagos, Nigeria',
    deadline: '2024-11-30',
    publishedAt: '2024-10-28',
    internalPath: '/events/ai-conference-2024',
    media: {
      type: 'VIDEO',
      url: 'https://example.com/video/ai-conference.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop'
    },
    tags: ['IA', 'Technologie', 'Conférence', 'Innovation']
  },
  {
    id: '3',
    title: 'Opportunité de Stage - Recherche en Énergies Renouvelables',
    description: 'Stage de 6 mois dans un laboratoire de recherche de pointe sur les énergies solaires et éoliennes.',
    type: 'OPPORTUNITY',
    priority: 'MEDIUM',
    organization: 'Institut de Recherche Énergétique',
    location: 'Dakar, Sénégal',
    deadline: '2024-12-01',
    publishedAt: '2024-10-25',
    externalUrl: 'https://example.com/stage-energie',
    tags: ['Stage', 'Recherche', 'Énergie', 'Environnement']
  },
  {
    id: '4',
    title: 'Atelier de Formation - Méthodologie de Recherche',
    description: 'Formation intensive de 3 jours sur les méthodologies de recherche modernes et les outils d\'analyse.',
    type: 'WORKSHOP',
    priority: 'MEDIUM',
    organization: 'Université Panafricaine',
    location: 'Accra, Ghana',
    deadline: '2024-11-20',
    publishedAt: '2024-10-20',
    internalPath: '/workshops/research-methodology',
    media: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop'
    },
    tags: ['Formation', 'Recherche', 'Méthodologie', 'Académique']
  },
  {
    id: '5',
    title: 'Concours d\'Innovation Technologique Africaine',
    description: 'Participez au plus grand concours d\'innovation du continent avec des prix allant jusqu\'à 50 000€.',
    type: 'EVENT',
    priority: 'HIGH',
    organization: 'Tech Innovation Africa',
    location: 'Le Cap, Afrique du Sud',
    deadline: '2024-11-25',
    publishedAt: '2024-10-15',
    externalUrl: 'https://example.com/concours-innovation',
    tags: ['Innovation', 'Technologie', 'Concours', 'Entrepreneuriat'],
    isSponsored: true
  },
  {
    id: '6',
    title: 'Programme d\'Échange Académique Inter-Africain',
    description: 'Opportunité d\'échange d\'un semestre dans une université partenaire africaine avec bourse complète.',
    type: 'SCHOLARSHIP',
    priority: 'MEDIUM',
    organization: 'Réseau Universitaire Africain',
    location: 'Diverses universités africaines',
    deadline: '2024-12-10',
    publishedAt: '2024-10-10',
    internalPath: '/programs/exchange',
    tags: ['Échange', 'Université', 'Mobilité', 'Partenariat']
  }
];

const Index = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => logout();
  const handleDepotView = (depotId: string) => console.log('Voir dépôt:', depotId);
  const handleDepotDownload = (depotId: string) => console.log('Télécharger dépôt:', depotId);

  return (
    <div className="min-h-screen bg-griote-white">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main>
        {/* Section Hero */}
        <HeroSection isAuthenticated={isAuthenticated} />

        {/* Section Annonces Récentes */}
        <AnnouncementsSection 
          announcements={sampleAnnouncements.slice(0, 3)}
          maxDisplay={3}
          showFilters={false}
          title="Annonces Récentes"
          subtitle="Découvrez les dernières opportunités pour la communauté académique africaine"
        />

        {/* Section Dépôts Récents */}
        <RecentDepositsSection
          recentDepots={recentDepots}
          handleDepotView={handleDepotView}
          handleDepotDownload={handleDepotDownload}
        />

        {/* Section Pourquoi Griote */}
        <WhyGrioteSection />

        {/* Section Griote AI */}
        <GrioteAISection />

        {/* Section Call-to-Action */}
        <CallToActionSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;