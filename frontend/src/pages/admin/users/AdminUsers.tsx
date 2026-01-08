import { useState } from "react"
import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUserRole,
  getTotalUsers,
  getVerifiedUsers,
  getTotalDepots,
  getTotalDocuments,
} from "../../../services/admin.service"

import type { UserFormData, PlatformStats, UsersListResponse } from "./types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../../components/ui/dialog"

import { Plus, Users } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import UsersTable from "./UsersTable"
import UserForm from "./UserForm"

export default function AdminUsers() {
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [roleFilter, setRoleFilter] = useState<'USER' | 'ADMIN' | 'all'>('all')
  const [emailFilter, setEmailFilter] = useState<string>('')
  const [nameFilter, setNameFilter] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  // ---------- QUERY ----------
  const { data: usersData, isLoading } = useQuery<UsersListResponse>({
    queryKey: ['users', page, roleFilter, emailFilter, nameFilter],
    queryFn: () =>
      getAllUsers({
        page,
        limit,
        role: roleFilter === 'all' ? undefined : roleFilter,
        email: emailFilter || undefined,
        name: nameFilter || undefined,
      }),
  })

  // ---------- STATS QUERY ----------
  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const [totalUsers, verifiedUsers, totalDepots, totalDocuments] =
        await Promise.all([
          getTotalUsers(),
          getVerifiedUsers(),
          getTotalDepots(),
          getTotalDocuments(),
        ])
      return {
        totalUsers: totalUsers.totalUsers,
        verifiedUsers: verifiedUsers.verifiedUsers,
        totalDepots: totalDepots.totalDepots,
        totalDocuments: totalDocuments.totalDocuments,
      }
    },
  })

  // ---------- MUTATIONS ----------
  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['platform-stats'] })
      toast.success('Administrateur créé')
      setIsCreateDialogOpen(false)
    },
    onError: () => toast.error('Erreur lors de la création'),
  })

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['platform-stats'] })
      toast.success('Utilisateur supprimé')
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'USER' | 'ADMIN' }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Rôle mis à jour')
    },
    onError: () => toast.error('Erreur lors de la mise à jour du rôle'),
  })

  // ---------- HANDLERS ----------
  const handleDelete = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteMutation.mutate(userId)
    }
  }

  const handleRoleChange = (userId: string, role: 'USER' | 'ADMIN') => {
    updateRoleMutation.mutate({ userId, role })
  }

  // ---------- UI ----------
  return (
    <div className="space-y-6">
      {/* Statistiques utilisateurs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle>Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle>Utilisateurs Vérifiés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.verifiedUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle>Taux Vérification</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalUsers
                ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion utilisateurs */}
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <CardDescription>
              Gérer les comptes utilisateurs de la plateforme
            </CardDescription>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouvel administrateur</DialogTitle>
                <DialogDescription>
                  Ajouter un nouveau compte administrateur
                </DialogDescription>
              </DialogHeader>
              <UserForm
                loading={createMutation.isPending}
                onSubmit={createMutation.mutate}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <UsersTable
            data={usersData}
            isLoading={isLoading}
            page={page}
            totalPages={usersData?.totalPages || 1}
            roleFilter={roleFilter}
            emailFilter={emailFilter}
            nameFilter={nameFilter}
            onPageChange={setPage}
            onRoleFilterChange={setRoleFilter}
            onEmailFilterChange={setEmailFilter}
            onNameFilterChange={setNameFilter}
            onDelete={handleDelete}
            onRoleChange={handleRoleChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
