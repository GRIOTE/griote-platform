import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { changePassword, deleteAccount } from '@/services/user.service';

interface SecurityTabProps {
  onLogout: () => void;
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

export function SecurityTab({ onLogout }: SecurityTabProps) {
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

  const [loading, setLoading] = useState({
    password: false,
    delete: false,
  });

  const handlePasswordsChange = (key: keyof PasswordState, value: string) => {
    setPasswords((prev) => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (key: keyof ShowPasswordState) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'SUPPRIMER') {
      toast.error('Vous devez taper \"SUPPRIMER\" pour confirmer');
      setDeleteConfirmation('');
      return;
    }

    setShowDeleteDialog(false);
    setDeleteConfirmation('');
    setLoading((prev) => ({ ...prev, delete: true }));

    try {
      await deleteAccount();
      toast.success('Votre compte a été supprimé avec succès');
      onLogout();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de la suppression du compte'
      );
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  return (
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

        {/* Zone de danger - Suppression de compte */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">Zone de danger</h3>
          <p className="text-sm text-red-600 mb-4">
            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
          </p>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={loading.delete}
              >
                <Trash className="mr-2 h-4 w-4" />
                {loading.delete ? 'Suppression en cours...' : 'Supprimer mon compte'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600">
                  Êtes-vous absolument sûr ?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-left">
                  Cette action est <span className="font-semibold text-red-600">irréversible</span>.
                  Toutes vos données seront définitivement supprimées et vous ne pourrez pas les récupérer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Label htmlFor="delete-confirm" className="text-left block mb-2">
                  Tapez <span className="font-semibold">SUPPRIMER</span> pour confirmer :
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="uppercase text-center font-semibold"
                  autoComplete="off"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={deleteConfirmation !== 'SUPPRIMER'}
                >
                  Supprimer définitivement
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator className="my-6 bg-griote-gray-200" />

        <Button type="button" variant="outline" onClick={onLogout} className="w-full">
          Se déconnecter
        </Button>
      </CardContent>
    </Card>
  );
}
