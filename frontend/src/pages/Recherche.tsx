
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ProjectCard from '@/components/ProjectCard';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Mock data étendue pour la recherche
const allProjects = [
  {
    id: 1,
    title: "Intelligence Artificielle et Agriculture Durable au Sénégal",
    author: "Aminata Diallo",
    date: "15 nov. 2024",
    tags: ["IA", "Agriculture", "Durabilité"],
    isPublic: true,
    thematique: "IA",
    niveau: "M2",
    type: "PDF",
    description: "Étude sur l'application de l'IA pour optimiser les rendements agricoles tout en préservant l'environnement."
  },
  {
    id: 2,
    title: "Systèmes de Santé Communautaire en Afrique de l'Ouest",
    author: "Dr. Kwame Asante",
    date: "12 nov. 2024",
    tags: ["Santé", "Communauté", "Politique"],
    isPublic: true,
    thematique: "Santé",
    niveau: "Doctorat",
    type: "PDF",
    description: "Analyse comparative des systèmes de santé communautaire dans cinq pays d'Afrique de l'Ouest."
  },
  {
    id: 3,
    title: "Éducation Numérique et Langues Africaines",
    author: "Fatima El-Rashid",
    date: "10 nov. 2024",
    tags: ["Éducation", "Numérique", "Langues"],
    isPublic: true,
    thematique: "Éducation",
    niveau: "M2",
    type: "ZIP",
    description: "Développement d'outils éducatifs numériques intégrant les langues africaines locales."
  },
  {
    id: 4,
    title: "Énergies Renouvelables et Développement Rural",
    author: "Jean-Claude Mbeki",
    date: "8 nov. 2024",
    tags: ["Énergie", "Rural", "Innovation"],
    isPublic: true,
    thematique: "Agriculture",
    niveau: "Licence",
    type: "PDF",
    description: "Implémentation de solutions d'énergie solaire dans les communautés rurales africaines."
  },
  {
    id: 5,
    title: "Blockchain et Inclusion Financière",
    author: "Aisha Mohamed",
    date: "5 nov. 2024",
    tags: ["Blockchain", "Finance", "Inclusion"],
    isPublic: true,
    thematique: "IA",
    niveau: "Autodidacte",
    type: "PDF",
    description: "Comment la technologie blockchain peut révolutionner l'inclusion financière en Afrique."
  },
  {
    id: 6,
    title: "Médecine Traditionnelle et Phytothérapie",
    author: "Dr. Amina Touré",
    date: "1 nov. 2024",
    tags: ["Médecine", "Traditionnelle", "Plantes"],
    isPublic: true,
    thematique: "Santé",
    niveau: "M2",
    type: "PDF",
    description: "Étude des propriétés thérapeutiques des plantes médicinales ouest-africaines."
  }
];

const thematiqueOptions = [
  { value: "", label: "Toutes les thématiques" },
  { value: "IA", label: "Intelligence Artificielle" },
  { value: "Santé", label: "Santé" },
  { value: "Éducation", label: "Éducation" },
  { value: "Agriculture", label: "Agriculture" }
];

const niveauOptions = [
  { value: "", label: "Tous les niveaux" },
  { value: "Licence", label: "Licence" },
  { value: "M2", label: "Master 2" },
  { value: "Doctorat", label: "Doctorat" },
  { value: "Autodidacte", label: "Autodidacte" }
];

const typeOptions = [
  { value: "", label: "Tous les types" },
  { value: "PDF", label: "PDF" },
  { value: "ZIP", label: "ZIP" }
];

const Recherche = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [thematique, setThematique] = useState('');
  const [niveau, setNiveau] = useState('');
  const [type, setType] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  // Filtrage des projets
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesThematique = !thematique || project.thematique === thematique;
    const matchesNiveau = !niveau || project.niveau === niveau;
    const matchesType = !type || project.type === type;

    return matchesSearch && matchesThematique && matchesNiveau && matchesType;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setThematique('');
    setNiveau('');
    setType('');
    setSearchParams({});
  };

  const handleLogout = () => {
    logout();
  };

  const handleProjectView = (projectId: number) => {
    console.log('Voir projet:', projectId);
  };

  const handleProjectDownload = (projectId: number) => {
    console.log('Télécharger projet:', projectId);
  };

  return (
    <div className="min-h-screen bg-griote-white">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Header de la page */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-griote-blue mb-4">
              Recherche de Projets
            </h1>
            <p className="text-xl text-griote-gray-800/80">
              Découvrez les travaux académiques de notre communauté panafricaine
            </p>
          </div>

          {/* Barre de recherche centrale */}
          <div className="max-w-3xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Rechercher par titre, description ou tags..."
                value={searchQuery}
                onChange={(e: React.FormEvent<HTMLFormElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-griote-white border-2 border-griote-accent rounded-lg text-lg focus:outline-none focus:border-griote-accent text-griote-gray-800"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-griote-accent" />
            </form>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar des filtres */}
            <div className="lg:w-80">
              <div className="griote-card p-6 sticky top-24">
                <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full mb-6 lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      {isFiltersOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
                    </Button>
                  </CollapsibleTrigger>

                  <div className="hidden lg:block">
                    <h3 className="griote-subtitle font-semibold mb-6 flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-griote-accent" />
                      Filtres
                    </h3>
                  </div>

                  <CollapsibleContent className="space-y-6">
                    {/* Thématique */}
                    <div>
                      <label className="griote-body font-semibold mb-2 block">Thématique</label>
                      <Select value={thematique} onValueChange={setThematique}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-griote-white border border-griote-accent/20">
                          {thematiqueOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Niveau */}
                    <div>
                      <label className="griote-body font-semibold mb-2 block">Niveau d'études</label>
                      <Select value={niveau} onValueChange={setNiveau}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-griote-white border border-griote-accent/20">
                          {niveauOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Type de fichier */}
                    <div>
                      <label className="griote-body font-semibold mb-2 block">Type de fichier</label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-griote-white border border-griote-accent/20">
                          {typeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Bouton effacer les filtres */}
                    {(searchQuery || thematique || niveau || type) && (
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="w-full griote-button-outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Effacer les filtres
                      </Button>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* Résultats */}
            <div className="flex-1">
              {/* Filtres actifs */}
              {(searchQuery || thematique || niveau || type) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-griote-accent/20 text-griote-blue">
                      Recherche: "{searchQuery}"
                    </Badge>
                  )}
                  {thematique && (
                    <Badge variant="secondary" className="bg-griote-accent/20 text-griote-blue">
                      {thematiqueOptions.find(opt => opt.value === thematique)?.label}
                    </Badge>
                  )}
                  {niveau && (
                    <Badge variant="secondary" className="bg-griote-accent/20 text-griote-blue">
                      {niveauOptions.find(opt => opt.value === niveau)?.label}
                    </Badge>
                  )}
                  {type && (
                    <Badge variant="secondary" className="bg-griote-accent/20 text-griote-blue">
                      Type: {type}
                    </Badge>
                  )}
                </div>
              )}

              {/* Nombre de résultats */}
              <div className="mb-6">
                <p className="griote-body text-griote-gray-800/70">
                  {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Grille de projets */}
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      title={project.title}
                      author={project.author}
                      date={project.date}
                      tags={project.tags}
                      isPublic={project.isPublic}
                      description={project.description}
                      onView={() => handleProjectView(project.id)}
                      onDownload={() => handleProjectDownload(project.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-32 h-32 bg-griote-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-16 h-16 text-griote-accent/50" />
                  </div>
                  <h3 className="griote-subtitle text-griote-gray-800 mb-4">
                    Aucun projet trouvé
                  </h3>
                  <p className="griote-body text-griote-gray-800/70 mb-6">
                    Essayez de modifier vos critères de recherche ou d'explorer d'autres thématiques.
                  </p>
                  <Button onClick={clearFilters} className="griote-button">
                    Effacer les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Recherche;
