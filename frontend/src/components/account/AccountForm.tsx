import React, { useState, useRef } from 'react';
import { Calendar, FileText, Linkedin, Github, Globe, Save, Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { updateProfile, getProfile, setProfilePicture as uploadProfilePicture } from '@/services/user.service';
import type { User } from '@/services/auth.service';

interface AccountFormProps {
  user: User | null;
  onProfileUpdate: () => void;
}

interface ProfileState {
  firstName: string;
  lastName: string;
  bio: string;
  dateOfBirth: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
}

export function AccountForm({ user, onProfileUpdate }: AccountFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileState>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    bio: user?.bio || '',
    dateOfBirth: user?.date_of_birth || '',
    linkedinUrl: user?.linkedin_url || '',
    githubUrl: user?.github_url || '',
    websiteUrl: user?.website_url || '',
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profile_picture || null);
  const [loading, setLoading] = useState({
    profile: false,
    upload: false,
  });

  const handleProfileChange = (key: keyof ProfileState, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectPicture = () => {
    fileInputRef.current?.click();
  };

  const handleUploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePicture(null);
    const formData = new FormData();
    formData.append('file', file);

    setLoading((prev) => ({ ...prev, upload: true }));

    try {
      await uploadProfilePicture(formData);
      const freshUser = await getProfile();
      setProfilePicture(freshUser.profile_picture || null);
      onProfileUpdate();
      toast.success('Photo de profil mise à jour avec succès');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de l\'upload de la photo'
      );
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, profile: true }));

    const dataToSend: Record<string, any> = {};
    
    if (profile.firstName.trim()) dataToSend.first_name = profile.firstName;
    if (profile.lastName.trim()) dataToSend.last_name = profile.lastName;
    if (profile.bio.trim()) dataToSend.bio = profile.bio;
    if (profile.dateOfBirth.trim()) dataToSend.date_of_birth = profile.dateOfBirth;
    if (profile.linkedinUrl.trim()) dataToSend.linkedin_url = profile.linkedinUrl;
    if (profile.githubUrl.trim()) dataToSend.github_url = profile.githubUrl;
    if (profile.websiteUrl.trim()) dataToSend.website_url = profile.websiteUrl;

    try {
      await updateProfile(dataToSend);
      onProfileUpdate();
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil'
      );
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  return (
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
                  <FileText className="h-10 w-10 text-griote-blue-dark" />
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
  );
}
