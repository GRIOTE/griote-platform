import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import AnnouncementsSection from '@/components/AnnouncementsSection';
import { Announcement } from '@/components/AnnouncementCard';
import { useAuth } from '@/contexts/AuthContext';

// Extended mock data pour la page complète
const allAnnouncements: Announcement[] = [
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
  },
  {
    id: '7',
    title: 'Symposium sur la Médecine Traditionnelle Africaine',
    description: 'Rencontre internationale pour valoriser et moderniser les pratiques médicales traditionnelles africaines.',
    type: 'CONFERENCE',
    priority: 'MEDIUM',
    organization: 'Organisation Mondiale de la Santé - Région Afrique',
    location: 'Addis-Abeba, Éthiopie',
    deadline: '2024-11-15',
    publishedAt: '2024-10-05',
    externalUrl: 'https://example.com/symposium-medecine',
    media: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop'
    },
    tags: ['Médecine', 'Tradition', 'Santé', 'Recherche']
  },
  {
    id: '8',
    title: 'Hackathon Climate Tech Africa 2024',
    description: 'Développez des solutions technologiques innovantes pour lutter contre le changement climatique en Afrique.',
    type: 'EVENT',
    priority: 'HIGH',
    organization: 'Climate Tech Africa',
    location: 'Nairobi, Kenya',
    deadline: '2024-11-28',
    publishedAt: '2024-10-01',
    internalPath: '/events/hackathon-climate',
    media: {
      type: 'VIDEO',
      url: 'https://example.com/video/hackathon.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop'
    },
    tags: ['Hackathon', 'Climat', 'Technologie', 'Innovation']
  },
  {
    id: '9',
    title: 'Bourse de Recherche en Agriculture Durable',
    description: 'Financement pour des projets de recherche sur l\'agriculture durable et la sécurité alimentaire en Afrique.',
    type: 'SCHOLARSHIP',
    priority: 'MEDIUM',
    organization: 'Institut International d\'Agriculture Tropicale',
    location: 'Ibadan, Nigeria',
    deadline: '2024-12-20',
    publishedAt: '2024-09-28',
    externalUrl: 'https://example.com/bourse-agriculture',
    tags: ['Agriculture', 'Recherche', 'Durabilité', 'Alimentation']
  },
  {
    id: '10',
    title: 'Formation en Entrepreneuriat Social',
    description: 'Programme de formation pour développer des entreprises à impact social positif sur le continent africain.',
    type: 'WORKSHOP',
    priority: 'LOW',
    organization: 'African Social Entrepreneurs Network',
    location: 'Casablanca, Maroc',
    deadline: '2024-12-05',
    publishedAt: '2024-09-25',
    internalPath: '/workshops/social-entrepreneurship',
    media: {
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop'
    },
    tags: ['Entrepreneuriat', 'Social', 'Formation', 'Impact']
  }
];

const Annonces = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => logout();

  return (
    <div className="min-h-screen bg-griote-white">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main>
        {/* Page Header */}
        <section className="py-12 bg-gradient-to-r from-griote-blue to-griote-blue-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Toutes les Annonces
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Découvrez toutes les opportunités, bourses, événements et formations 
                disponibles pour la communauté académique africaine
              </p>
            </div>
          </div>
        </section>

        {/* Announcements with Filters */}
        <AnnouncementsSection 
          announcements={allAnnouncements}
          maxDisplay={50}
          showFilters={true}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Annonces;
