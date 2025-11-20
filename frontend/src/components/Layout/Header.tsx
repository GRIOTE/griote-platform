import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, BookOpen, Users, Megaphone, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import GrioteLogo from '@/assets/griote.svg';

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Header = ({ isAuthenticated = false, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navigationItems = isAuthenticated
    ? [
        { label: 'Mes Dépôts', path: '/mes-depots', icon: BookOpen },
        { label: 'Annonces', path: '/annonces', icon: Megaphone },
        { label: 'Découvrir', path: '/recherche', icon: Search },
        { label: 'Bourses', path: '/bourses', icon: Users },
        { label: 'Mon Compte', path: '/mon-compte', icon: User },
      ]
    : [
        { label: 'Découvrir', path: '/recherche', icon: Search },
        { label: 'Annonces', path: '/annonces', icon: Megaphone },
        { label: 'Bourses', path: '/bourses', icon: Users },
        { label: 'À propos', path: '/a-propos', icon: Users },
      ];

  return (
    <header className="bg-griote-white border-b border-griote-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <img src={GrioteLogo} alt="Griote Logo" className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-griote-blue leading-none">Griote</span>
              <span className="text-[10px] font-medium text-griote-gray-600 leading-tight">foundation</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-griote-gray-100 rounded-md focus:outline-none focus:border-griote-blue text-griote-gray-800 bg-griote-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-griote-blue" />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-griote-blue/10 text-griote-blue font-semibold'
                      : 'text-griote-gray-800 hover:bg-griote-gray-100 hover:text-griote-blue'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}

            {!isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/connexion">
                  <button className="px-4 py-2 border-2 border-griote-blue text-griote-blue rounded-md font-semibold hover:bg-griote-blue hover:text-griote-white transition-colors duration-200">
                    Se connecter
                  </button>
                </Link>
                <Link to="/inscription">
                  <button className="px-4 py-2 bg-griote-blue text-griote-white rounded-md font-semibold hover:bg-griote-accent hover:text-griote-blue transition-colors duration-200">
                    S'inscrire
                  </button>
                </Link>
              </div>
            ) : (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-griote-blue text-griote-blue rounded-md font-semibold hover:bg-griote-blue hover:text-griote-white transition-colors duration-200 ml-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-griote-blue p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-griote-gray-100 py-4 space-y-2 animate-slide-down">
            <nav className="flex flex-col">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'bg-griote-blue/10 text-griote-blue font-semibold'
                        : 'text-griote-gray-800 hover:bg-griote-gray-100 hover:text-griote-blue'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {!isAuthenticated ? (
                <div className="pt-4 border-t border-griote-gray-100 space-y-2">
                  <Link
                    to="/connexion"
                    className="block w-full text-center py-2 border-2 border-griote-blue text-griote-blue rounded-md hover:bg-griote-blue hover:text-griote-white transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/inscription"
                    className="block w-full text-center py-2 bg-griote-blue text-griote-white rounded-md hover:bg-griote-accent hover:text-griote-blue transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              ) : (
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 mt-2 border-t border-griote-gray-100 text-griote-blue hover:bg-griote-gray-100 rounded-md transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Se déconnecter</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
