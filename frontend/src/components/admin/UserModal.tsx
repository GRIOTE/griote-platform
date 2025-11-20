import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminService } from '@/services/admin.service';
import { User } from '@/services/auth.service';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    is_email_verified: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_email_verified: user.is_email_verified,
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        role: 'STUDENT',
        is_email_verified: false,
      });
    }
    setError('');
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (user) {
        // Update existing user
        await adminService.updateUser(user.user_id, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          role: formData.role as 'USER' | 'ADMIN',
          is_email_verified: formData.is_email_verified,
        });
      } else {
        // Create new admin
        await adminService.createAdmin({
          email: formData.email,
          password: 'TempPassword123!', // Temporary password
          first_name: formData.first_name,
          last_name: formData.last_name,
        });
      }

      onUserUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </DialogTitle>
          <DialogDescription>
            {user 
              ? 'Modifiez les informations de l\'utilisateur ci-dessous.'
              : 'Créez un nouvel utilisateur avec un mot de passe temporaire.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Étudiant</SelectItem>
                <SelectItem value="TEACHER">Enseignant</SelectItem>
                <SelectItem value="INDEPENDENT">Indépendant</SelectItem>
                <SelectItem value="ADMIN">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_email_verified"
              checked={formData.is_email_verified}
              onChange={(e) => handleInputChange('is_email_verified', e.target.checked)}
              className="w-4 h-4 text-griote-accent border-griote-blue/20 rounded focus:ring-griote-accent"
            />
            <Label htmlFor="is_email_verified" className="text-sm">
              Email vérifié
            </Label>
          </div>

          {!user && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Un mot de passe temporaire sera généré. L'utilisateur devra le changer lors de sa première connexion.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="griote-button">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-griote-blue border-t-transparent rounded-full animate-spin"></div>
                  <span>Enregistrement...</span>
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {user ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
