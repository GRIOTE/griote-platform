import { User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/services/auth.service';

interface ProfileHeaderProps {
  user: User | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-griote-blue to-griote-blue-dark text-griote-white">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-griote-accent rounded-full flex items-center justify-center overflow-hidden">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="h-8 w-8 text-griote-blue-dark" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl text-griote-white">
              {user?.first_name} {user?.last_name}
            </CardTitle>
            <CardDescription className="text-griote-white/80">
              {user?.email}
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-griote-accent text-griote-blue-dark hover:bg-yellow-400">
          {user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
        </Badge>
      </CardHeader>
    </Card>
  );
}
