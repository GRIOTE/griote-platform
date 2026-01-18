import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { UsersListResponse } from "../../../services/admin.service"
import { Trash2, Shield, ShieldCheck } from "lucide-react"

interface Props {
  data: UsersListResponse | undefined
  isLoading: boolean
  page: number
  totalPages: number
  roleFilter: 'USER' | 'ADMIN' | 'all'
  emailFilter: string
  nameFilter: string
  onPageChange: (page: number) => void
  onRoleFilterChange: (role: 'USER' | 'ADMIN' | 'all') => void
  onEmailFilterChange: (email: string) => void
  onNameFilterChange: (name: string) => void
  onDelete: (userId: string) => void
  onRoleChange: (userId: string, role: 'USER' | 'ADMIN') => void
}

// Admin-specific user type (extends base User with admin fields)
interface AdminUser {
  user_id: string
  first_name: string
  last_name: string
  email: string
  role: 'USER' | 'ADMIN'
  email_verified: boolean
  created_at: string
  [key: string]: any
}

export default function UsersTable({
  data,
  isLoading,
  page,
  totalPages,
  roleFilter,
  emailFilter,
  nameFilter,
  onPageChange,
  onRoleFilterChange,
  onEmailFilterChange,
  onNameFilterChange,
  onDelete,
  onRoleChange,
}: Props) {
  // Cast users to AdminUser type for admin-specific fields
  const users = data?.users as unknown as AdminUser[] | undefined

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex gap-4">
        <Input
          placeholder="Rechercher par email..."
          value={emailFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailFilterChange(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Rechercher par nom..."
          value={nameFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNameFilterChange(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={roleFilter}
          onValueChange={(v: string) => onRoleFilterChange(v as 'USER' | 'ADMIN' | 'all')}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="USER">Utilisateur</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Vérifié</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role === 'ADMIN' ? 'Admin' : 'Utilisateur'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.email_verified ? (
                      <Badge className="bg-green-100 text-green-800">Oui</Badge>
                    ) : (
                      <Badge variant="outline">Non</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.role === 'USER' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRoleChange(user.user_id, 'ADMIN')}
                          title="Promouvoir admin"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRoleChange(user.user_id, 'USER')}
                          title="Rétrograder utilisateur"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                            onDelete(user.user_id)
                          }
                        }}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
