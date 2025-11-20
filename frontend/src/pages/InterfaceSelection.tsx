import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import grioteLogo from '@/assets/griote.svg';

const InterfaceSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAdminInterface = () => {
    navigate('/admin/dashboard');
  };

  const handleClientInterface = () => {
    navigate('/');
  };

  if (!user || user.role !== 'ADMIN') {
    navigate('/connexion');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-griote-blue to-griote-blue-dark flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-griote-white rounded-lg flex items-center justify-center p-2">
              <img src={grioteLogo} alt="Logo Griote" className="w-full h-full" />
            </div>
            <span className="text-2xl font-bold text-griote-white">
              Fondation Griote
            </span>
          </div>
          <h1 className="text-3xl font-bold text-griote-white mb-2">
            Bienvenue, {user.first_name} {user.last_name}
          </h1>
          <p className="text-griote-white/80 text-lg">
            Choisissez l'interface que vous souhaitez utiliser
          </p>
        </div>

        {/* Interface Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Interface Card */}
          <Card className="bg-griote-white border-griote-accent/20 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-griote-accent to-griote-blue rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-8 h-8 text-griote-white" />
              </div>
              <CardTitle className="text-2xl text-griote-blue">
                Interface d'Administration
              </CardTitle>
              <CardDescription className="text-griote-gray-800">
                Gérez la plateforme, les utilisateurs et le contenu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-griote-gray-800">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-griote-accent rounded-full"></div>
                  <span>Gestion des utilisateurs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-griote-accent rounded-full"></div>
                  <span>Administration du contenu</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-griote-accent rounded-full"></div>
                  <span>Statistiques et rapports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-griote-accent rounded-full"></div>
                  <span>Configuration système</span>
                </li>
              </ul>
              <Button 
                onClick={handleAdminInterface}
                className="w-full griote-button group-hover:bg-griote-blue-dark transition-colors duration-300"
              >
                Accéder à l'administration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Client Interface Card */}
          <Card className="bg-griote-white border-griote-accent/20 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-griote-blue to-griote-blue-dark rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-griote-white" />
              </div>
              <CardTitle className="text-2xl text-griote-blue">
                Espace Client
              </CardTitle>
              <CardDescription className="text-griote-gray-800">
                Utilisez la plateforme comme un utilisateur standard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-griote-gray-800">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-griote-blue rounded-full"></div>
                  <span>Parcourir les annonces</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-griote-blue rounded-full"></div>
                  <span>Publier du contenu</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-griote-blue rounded-full"></div>
                  <span>Interagir avec la communauté</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-griote-blue rounded-full"></div>
                  <span>Gérer votre profil</span>
                </li>
              </ul>
              <Button 
                onClick={handleClientInterface}
                className="w-full bg-griote-blue hover:bg-griote-blue-dark text-griote-white transition-colors duration-300"
              >
                Accéder à l'espace client
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-griote-white/60 text-sm">
            Vous pourrez toujours changer d'interface depuis votre profil
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterfaceSelection;
