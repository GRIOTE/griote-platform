import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  FileText,
  Linkedin,
  Github,
  Globe,
  Lock,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Camera,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import grioteLogo from '@/assets/griote.svg';
import { useAuth } from '@/auth/useAuth';
import { updateProfile, changePassword, getProfile, setProfilePicture as uploadProfilePicture } from '@/services/user.service'; // ← Ajout de getProfile

interface ProfileState {
  firstName: string;
  lastName: string;
  bio: string;
  dateOfBirth: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
}

interface PasswordState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswordState {
  old: boolean;
  new: boolean;
  confirm: boolean;
}

interface LoadingState {
  profile: boolean;
  password: boolean;
  upload: boolean;
}

const MonCompte: React.FC = () => {
  const { user: authUser, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileState>({
    firstName: '',
    lastName: '',
    bio: '',
    dateOfBirth: '',
    linkedinUrl: '',
    githubUrl: '',
    websiteUrl: '',
  });

  const [passwords, setPasswords] = useState<PasswordState>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    old: false,
    new: false,
    confirm: false,
  });

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const [loading, setLoading] = useState<LoadingState>({
    profile: false,
    password: false,
    upload: false,
  });

  // === AJOUT : Fonction pour recharger les données fraîches depuis le backend ===
  const refreshProfile = async () => {
    try {
      const freshUser = await getProfile();
      localStorage.setItem('user', JSON.stringify(freshUser));
      refreshUser(); // Update the auth context
      setProfilePicture(freshUser.profile_picture || null);
    } catch (error) {
      toast.error('Erreur lors du rafraîchissement du profil');
    }
  };

  useEffect(() => {
    if (authUser) {
      setProfile({
        firstName: authUser.first_name || '',
        lastName: authUser.last_name || '',
        bio: authUser.bio || '',
        dateOfBirth: authUser.date_of_birth || '',
        linkedinUrl: authUser.linkedin_url || '',
        githubUrl: authUser.github_url || '',
        websiteUrl: authUser.website_url || '',
      });
      setProfilePicture(authUser.profile_picture || null);
    }
  }, [authUser]);


  const handleProfileChange = (key: keyof ProfileState, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordsChange = (key: keyof PasswordState, value: string) => {
    setPasswords((prev) => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (key: keyof ShowPasswordState) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ==================== UPLOAD PHOTO DE PROFIL ====================

  const handleSelectPicture = () => {
    fileInputRef.current?.click();
  };

  const handleUploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Afficher un indicateur de chargement
    setProfilePicture(null);
    const formData = new FormData();
    formData.append('file', file);

    setLoading((prev) => ({ ...prev, upload: true }));

    try {
      await uploadProfilePicture(formData);
      await refreshProfile();
      toast.success('Photo de profil mise à jour avec succès');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de l’upload de la photo'
      );
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // ==================== MISE À JOUR PROFIL ====================

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, profile: true }));

    // Only send fields that have values (not empty strings)
    const dataToSend: Record<string, any> = {};
    
    if (profile.firstName.trim()) dataToSend.first_name = profile.firstName;
    if (profile.lastName.trim()) dataToSend.last_name = profile.lastName;
    if (profile.bio.trim()) dataToSend.bio = profile.bio;
    if (profile.dateOfBirth.trim()) dataToSend.date_of_birth = profile.dateOfBirth;
    if (profile.linkedinUrl.trim()) dataToSend.linkedin_url = profile.linkedinUrl;
    if (profile.githubUrl.trim()) dataToSend.github_url = profile.githubUrl;
    if (profile.websiteUrl.trim()) dataToSend.website_url = profile.websiteUrl;
    
    console.log('Sending data:', dataToSend);

    try {
      await updateProfile(dataToSend);

      // === AJOUT : On recharge les données fraîches après mise à jour ===
      await refreshProfile();

      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil'
      );
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  // ==================== CHANGEMENT MOT DE PASSE ====================

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));

    try {
      await changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Mot de passe changé avec succès');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors du changement de mot de passe'
      );
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
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
        {/* Profile Card */}
        <Card className="mb-6 bg-gradient-to-r from-griote-blue to-griote-blue-dark text-griote-white">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-griote-accent rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-griote-blue-dark" />
              </div>
              <div>
                <CardTitle className="text-2xl text-griote-white">
                  {authUser?.first_name} {authUser?.last_name}
                </CardTitle>
                <CardDescription className="text-griote-white/80">
                  {authUser?.email}
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-griote-accent text-griote-blue-dark hover:bg-yellow-400">
              {authUser?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
            </Badge>
          </CardHeader>
        </Card>

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
            <form onSubmit={handleUpdateProfile}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-griote-blue-dark">Informations Personnelles</CardTitle>
                  <CardDescription className="text-griote-gray-600">
                    Mettez à jour vos informations personnelles et votre bio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo de profil */}
                  <div className="flex items-center space-x-6 p-4 bg-griote-gray-50 rounded-lg">
                    <div className="relative">
                      <div className="w-20 h-20 bg-griote-accent rounded-full flex items-center justify-center overflow-hidden">
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <User className="h-10 w-10 text-griote-blue-dark" />
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleSelectPicture}
                        disabled={loading.upload}
                        className="absolute -bottom-2 -right-2 bg-griote-accent text-griote-blue-dark p-1 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50"
                      >
                        {loading.upload ? (
                          <Upload className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadPicture}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleProfileChange('firstName', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleProfileChange('lastName', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">
                      <Calendar className="inline h-4 w-4 mr-2" /> Date de naissance
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleProfileChange('dateOfBirth', e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">
                      <FileText className="inline h-4 w-4 mr-2" /> Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleProfileChange('bio', e.target.value)
                      }
                      rows={4}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="linkedin">
                        <Linkedin className="inline h-4 w-4 mr-2" /> LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={profile.linkedinUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleProfileChange('linkedinUrl', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">
                        <Github className="inline h-4 w-4 mr-2" /> GitHub
                      </Label>
                      <Input
                        id="github"
                        type="url"
                        value={profile.githubUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleProfileChange('githubUrl', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">
                        <Globe className="inline h-4 w-4 mr-2" /> Site Web
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={profile.websiteUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleProfileChange('websiteUrl', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-griote-accent text-griote-blue-dark hover:bg-yellow-400"
                    disabled={loading.profile}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {loading.profile ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          {/* Mes dépôts Tab */}
          <TabsContent value="depots">
            <Card>
              <CardHeader>
                <CardTitle className="text-griote-blue-dark">Mes dépôts</CardTitle>
                <CardDescription className="text-griote-gray-600">
                  Consultez vos dépôts uploadés
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-griote-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-griote-gray-900 mb-2">Aucun dépôt trouvé</h3>
                <p className="text-griote-gray-600 mb-4">
                  Vous n'avez pas encore uploadé de dépôts sur la plateforme.
                </p>
                <Button className="bg-griote-blue text-white hover:bg-griote-blue-dark">
                  <Upload className="mr-2 h-4 w-4" /> Uploader un dépôt
                </Button>
              </CardContent>
            </Card>
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
                  {(['old', 'new', 'confirm'] as const).map((type) => (
                    <div key={type}>
                      <Label htmlFor={type}>
                        {type === 'old'
                          ? 'Mot de passe actuel'
                          : type === 'new'
                          ? 'Nouveau mot de passe'
                          : 'Confirmer le mot de passe'}
                      </Label>
                      <div className="relative">
                        <Input
                          id={type}
                          type={showPassword[type] ? 'text' : 'password'}
                          value={
                            passwords[
                              type === 'old'
                                ? 'oldPassword'
                                : type === 'new'
                                ? 'newPassword'
                                : 'confirmPassword'
                            ]
                          }
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handlePasswordsChange(
                              type === 'old'
                                ? 'oldPassword'
                                : type === 'new'
                                ? 'newPassword'
                                : 'confirmPassword',
                              e.target.value
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(type)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-griote-gray-600 hover:text-griote-blue"
                        >
                          {showPassword[type] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="submit"
                    className="w-full bg-griote-accent text-griote-blue-dark hover:bg-yellow-400"
                    disabled={loading.password}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    {loading.password ? 'Changement en cours...' : 'Changer le mot de passe'}
                  </Button>
                </form>

                <Separator className="my-6 bg-griote-gray-200" />

                <Button type="button" variant="destructive" onClick={handleLogout} className="w-full">
                  Se déconnecter
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MonCompte;