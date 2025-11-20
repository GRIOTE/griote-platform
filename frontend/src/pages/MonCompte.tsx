import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, FileText, Linkedin, Github, Globe, Lock, ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import grioteLogo from '@/assets/griote.svg';

const MonCompte = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate('/connexion');
      return;
    }

    // Load user data
    setFirstName(authUser.first_name || '');
    setLastName(authUser.last_name || '');
    setBio(authUser.bio || '');
    setDateOfBirth(authUser.date_of_birth || '');
    setLinkedinUrl(authUser.linkedin_url || '');
    setGithubUrl(authUser.github_url || '');
    setWebsiteUrl(authUser.website_url || '');
  }, [authUser, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userService.updateProfile({
        firstName,
        lastName,
        bio,
        date_of_birth: dateOfBirth,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        website_url: websiteUrl,
      });

      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoadingPassword(true);

    try {
      await userService.changePassword(oldPassword, newPassword);
      toast.success('Mot de passe modifié avec succès');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-griote-gray-50">
      {/* Header */}
      <header className="bg-griote-blue border-b border-griote-blue-dark/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 griote-hover">
              <div className="w-10 h-10 bg-griote-white rounded-lg flex items-center justify-center p-2">
                <img src={grioteLogo} alt="Logo Griote" className="w-full h-full" />
              </div>
              <span className="text-xl font-bold text-griote-white">
                Fondation Griote
              </span>
            </Link>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-griote-white hover:bg-griote-blue-dark"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* User Info Card */}
          <Card className="mb-6 bg-gradient-to-r from-griote-blue to-griote-blue-dark text-griote-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-griote-accent rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-griote-blue-dark" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-griote-white">
                      {authUser.first_name} {authUser.last_name}
                    </CardTitle>
                    <CardDescription className="text-griote-white/80">
                      {authUser.email}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-griote-accent text-griote-blue-dark hover:bg-yellow-400">
                  {authUser.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-griote-white">
              <TabsTrigger value="profile" className="data-[state=active]:bg-griote-accent data-[state=active]:text-griote-blue-dark">
                <User className="mr-2 h-4 w-4" />
                Mon Profil
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-griote-accent data-[state=active]:text-griote-blue-dark">
                <Lock className="mr-2 h-4 w-4" />
                Sécurité
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <form onSubmit={handleUpdateProfile}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-griote-blue-dark">Informations Personnelles</CardTitle>
                    <CardDescription className="text-griote-gray-600">
                      Mettez à jour vos informations personnelles et votre bio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-griote-gray-800">
                          Prénom
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Votre prénom"
                          className="border-griote-gray-300 focus:border-griote-blue"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-griote-gray-800">
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Votre nom"
                          className="border-griote-gray-300 focus:border-griote-blue"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-griote-gray-800">
                        <Calendar className="inline h-4 w-4 mr-2" />
                        Date de naissance
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="border-griote-gray-300 focus:border-griote-blue"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-griote-gray-800">
                        <FileText className="inline h-4 w-4 mr-2" />
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Parlez-nous un peu de vous..."
                        rows={4}
                        className="border-griote-gray-300 focus:border-griote-blue resize-none"
                      />
                    </div>

                    <Separator className="bg-griote-gray-200" />

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-griote-blue-dark">
                        Liens Professionnels
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-griote-gray-800">
                          <Linkedin className="inline h-4 w-4 mr-2" />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://www.linkedin.com/in/..."
                          className="border-griote-gray-300 focus:border-griote-blue"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github" className="text-griote-gray-800">
                          <Github className="inline h-4 w-4 mr-2" />
                          GitHub
                        </Label>
                        <Input
                          id="github"
                          type="url"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/..."
                          className="border-griote-gray-300 focus:border-griote-blue"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-griote-gray-800">
                          <Globe className="inline h-4 w-4 mr-2" />
                          Site Web
                        </Label>
                        <Input
                          id="website"
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://..."
                          className="border-griote-gray-300 focus:border-griote-blue"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-griote-accent text-griote-blue-dark hover:bg-yellow-400"
                      disabled={isLoading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="text-griote-blue-dark">Changer le Mot de Passe</CardTitle>
                  <CardDescription className="text-griote-gray-600">
                    Assurez-vous que votre mot de passe contient au moins 8 caractères
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword" className="text-griote-gray-800">
                        Mot de passe actuel
                      </Label>
                      <div className="relative">
                        <Input
                          id="oldPassword"
                          type={showOldPassword ? 'text' : 'password'}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Entrez votre mot de passe actuel"
                          className="border-griote-gray-300 focus:border-griote-blue pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-griote-gray-600 hover:text-griote-blue"
                        >
                          {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-griote-gray-800">
                        Nouveau mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Entrez votre nouveau mot de passe"
                          className="border-griote-gray-300 focus:border-griote-blue pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-griote-gray-600 hover:text-griote-blue"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-griote-gray-800">
                        Confirmer le nouveau mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmez votre nouveau mot de passe"
                          className="border-griote-gray-300 focus:border-griote-blue pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-griote-gray-600 hover:text-griote-blue"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-griote-accent text-griote-blue-dark hover:bg-yellow-400"
                      disabled={isLoadingPassword}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {isLoadingPassword ? 'Changement en cours...' : 'Changer le mot de passe'}
                    </Button>
                  </form>

                  <Separator className="my-6 bg-griote-gray-200" />

                  <div>
                    <h3 className="text-lg font-semibold text-griote-blue-dark mb-2">
                      Déconnexion
                    </h3>
                    <p className="text-sm text-griote-gray-600 mb-4">
                      Vous pouvez vous déconnecter de votre compte à tout moment
                    </p>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Se déconnecter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MonCompte;
