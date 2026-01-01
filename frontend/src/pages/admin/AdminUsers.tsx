// src/pages/AdminUsers.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { 
  getAllUsers, 
  createUser, 
  deleteUser, 
  updateUser, 
  updateUserRole, 
  getTotalUsers, 
  getVerifiedUsers, 
  getTotalDepots, 
  getTotalDocuments, 
  UsersListResponse, 
  PlatformStats 
} from '@/services/admin.service'

interface UserRow {
  user_id: string
  email: string
  first_name: string
  last_name: string
  role: 'USER' | 'ADMIN'
  email_verified: boolean
  created_at: string
}

function AdminUsers(): JSX.Element {
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [roleFilter, setRoleFilter] = useState<'USER' | 'ADMIN' | 'all'>('all')
  const [emailFilter, setEmailFilter] = useState<string>('')
  const [nameFilter, setNameFilter] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)

  const queryClient = useQueryClient()

  // USERS QUERY
  const { data: usersData, isLoading } = useQuery<UsersListResponse>({
    queryKey: ['users', page, roleFilter, emailFilter, nameFilter],
    queryFn: () => getAllUsers({
      page,
      limit,
      role: roleFilter === 'all' ? undefined : roleFilter,
      email: emailFilter || undefined,
      name: nameFilter || undefined,
    }),
  })

  // STATS QUERY
  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const [totalUsers, verifiedUsers, totalDepots, totalDocuments] = await Promise.all([
        getTotalUsers(),
        getVerifiedUsers(),
        getTotalDepots(),
        getTotalDocuments()
      ])
      return {
        totalUsers: totalUsers.totalUsers,
        verifiedUsers: verifiedUsers.verifiedUsers,
        totalDepots: totalDepots.totalDepots,
        totalDocuments: totalDocuments.totalDocuments
      }
    }
  })

  // MUTATIONS
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['platform-stats'] })
      toast.success("Utilisateur supprimé")
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'USER' | 'ADMIN' }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success("Rôle mis à jour")
    },
    onError: () => toast.error("Erreur lors de la mise à jour du rôle"),
  })

  const handleDelete = (userId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      deleteMutation.mutate(userId)
    }
  }

  const handleRoleChange = (userId: string, newRole: 'USER' | 'ADMIN') => {
    updateRoleMutation.mutate({ userId, role: newRole })
  }

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
              {stats?.totalUsers ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion utilisateurs */}
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <CardDescription>Gérer les comptes utilisateurs de la plateforme</CardDescription>
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
                <DialogDescription>Ajouter un nouveau compte administrateur</DialogDescription>
              </DialogHeader>
              <CreateUserForm onClose={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {/* Table et filtres */}
          {/* ...reste du code identique, typage complet pour e et value */}
        </CardContent>
      </Card>
    </div>
  )
}

// CREATE USER FORM
function CreateUserForm({ onClose }: { onClose: () => void }): JSX.Element {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['platform-stats'] })
      toast.success("Administrateur créé")
      onClose()
    },
    onError: () => toast.error("Erreur lors de la création"),
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">Prénom</Label>
          <Input id="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="last_name">Nom</Label>
          <Input id="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Créer
        </Button>
      </DialogFooter>
    </form>
  )
}

export default AdminUsers
