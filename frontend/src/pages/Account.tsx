import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, FileText, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import grioteLogo from '@/assets/griote.svg';
import { useAuth } from '@/auth/useAuth';
import { getProfile } from '@/services/user.service';
import { ProfileHeader, AccountForm, SecurityTab, MyDepotsTab } from '@/components/account';

const Account: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const freshUser = await getProfile();
      localStorage.setItem('user', JSON.stringify(freshUser));
      refreshUser();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-griote-gray-50">
      {/* Header */}
      <header className="bg-griote-blue border-b border-griote-blue-dark/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 griote-hover">
            <div className="w-10 h-10 bg-griote-white rounded-lg flex items-center justify-center p-2">
              <img src={grioteLogo} alt="Logo Griote" className="w-full h-full" />
            </div>
            <span className="text-xl font-bold text-griote-white">Griote Project-Africa</span>
          </Link>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-griote-white hover:bg-griote-blue-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Tabs */}
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-griote-white">
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-griote-accent data-[state=active]:text-griote-blue-dark"
            >
              <User className="mr-2 h-4 w-4" /> Compte
            </TabsTrigger>
            <TabsTrigger
              value="depots"
              className="data-[state=active]:bg-griote-accent data-[state=active]:text-griote-blue-dark"
            >
              <FileText className="mr-2 h-4 w-4" /> Mes dépôts
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-griote-accent data-[state=active]:text-griote-blue-dark"
            >
              <Lock className="mr-2 h-4 w-4" /> Sécurité
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <AccountForm user={user} onProfileUpdate={handleProfileUpdate} />
          </TabsContent>

          {/* My Depots Tab */}
          <TabsContent value="depots">
            <MyDepotsTab />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <SecurityTab onLogout={handleLogout} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Account;
