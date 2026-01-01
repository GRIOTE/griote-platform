import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Megaphone, Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface Announcement {
  id: number
  titre: string
  contenu: string
  statut: 'pending' | 'publié' | 'archivé'
  date_creation: string
  date_publication?: string
}

function AdminAnnouncements() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'publié' | 'archivé'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const queryClient = useQueryClient()

  // Mock data for now - replace with actual API calls
  const { data: announcementsData, isLoading } = useQuery({
    queryKey: ['announcements', page, statusFilter, searchTerm],
    queryFn: () => Promise.resolve({
      announcements: [
        {
          id: 1,
          titre: 'Annonce test 1',
          contenu: 'Contenu de test',
          statut: 'pending' as const,
          date_creation: '2024-01-01',
          date_publication: null
        }
      ],
      totalAnnouncements: 1,
      totalPages: 1,
      currentPage: 1
    })
  })

  const publishMutation = useMutation({
    mutationFn: (id: number) => Promise.resolve({}), // Replace with actual API call
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast.success("Annonce publiée")
    },
    onError: () => {
      toast.error("Erreur lors de la publication")
    }
  })

  const archiveMutation = useMutation({
    mutationFn: (id: number) => Promise.resolve({}), // Replace with actual API call
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast.success("Annonce archivée")
    },
    onError: () => {
      toast.error("Erreur lors de l'archivage")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => Promise.resolve({}), // Replace with actual API call
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast.success("Annonce supprimée")
    },
    onError: () => {
      toast.error("Erreur lors de la suppression")
    }
  })

  const handlePublish = (id: number) => {
    publishMutation.mutate(id)
  }

  const handleArchive = (id: number) => {
    archiveMutation.mutate(id)
  }

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      deleteMutation.mutate(id)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>
      case 'publié':
        return <Badge className="bg-green-100 text-green-800">Publié</Badge>
      case 'archivé':
        return <Badge variant="outline">Archivé</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Gestion des annonces */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Annonces</CardTitle>
              <CardDescription>Gérer les annonces du système</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle annonce
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle annonce</DialogTitle>
                  <DialogDescription>
                    Ajouter une nouvelle annonce au système
                  </DialogDescription>
                </DialogHeader>
                <CreateAnnouncementForm onClose={() => setIsCreateDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtres */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par titre..."
                value={searchTerm}
                onChange={(e: React.FormEvent<HTMLFormElement>) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="publié">Publié</SelectItem>
                <SelectItem value="archivé">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table annonces */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Chargement des annonces...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead>Date publication</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcementsData?.announcements?.map((announcement: Announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">{announcement.titre}</TableCell>
                      <TableCell>{getStatusBadge(announcement.statut)}</TableCell>
                      <TableCell>{new Date(announcement.date_creation).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {announcement.date_publication
                          ? new Date(announcement.date_publication).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {announcement.statut === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublish(announcement.id)}
                              disabled={publishMutation.isPending}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {announcement.statut === 'publié' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleArchive(announcement.id)}
                              disabled={archiveMutation.isPending}
                            >
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAnnouncement(announcement)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {announcementsData && announcementsData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Affichage de {(page - 1) * limit + 1} à {Math.min(page * limit, announcementsData.totalAnnouncements)} sur {announcementsData.totalAnnouncements} annonces
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= announcementsData.totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'annonce</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'annonce
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <EditAnnouncementForm
              announcement={selectedAnnouncement}
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateAnnouncementForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    previewImageUrl: ''
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => Promise.resolve({}), // Replace with actual API call
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast.success("Annonce créée")
      onClose()
    },
    onError: () => {
      toast.error("Erreur lors de la création")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="titre">Titre</Label>
        <Input
          id="titre"
          value={formData.titre}
          onChange={(e: React.FormEvent<HTMLFormElement>) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="contenu">Contenu</Label>
        <Textarea
          id="contenu"
          value={formData.contenu}
          onChange={(e: React.FormEvent<HTMLFormElement>) => setFormData(prev => ({ ...prev, contenu: e.target.value }))}
          rows={6}
          required
        />
      </div>
      <div>
        <Label htmlFor="previewImageUrl">URL de l'image d'aperçu (optionnel)</Label>
        <Input
          id="previewImageUrl"
          type="url"
          value={formData.previewImageUrl}
          onChange={(e: React.FormEvent<HTMLFormElement>) => setFormData(prev => ({ ...prev, previewImageUrl: e.target.value }))}
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
          Créer
        </Button>
      </DialogFooter>
    </form>
  )
}

function EditAnnouncementForm({ announcement, onClose }: { announcement: Announcement; onClose: () => void }) {
  const [formData, setFormData] = useState({
    titre: announcement.titre,
    contenu: announcement.contenu,
    previewImageUrl: ''
  })

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => Promise.resolve({}), // Replace with actual API call
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast.success("Annonce mise à jour")
      onClose()
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit_titre">Titre</Label>
        <Input
          id="edit_titre"
          value={formData.titre}
          onChange={(e: React.FormEvent<HTMLFormElement>) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="edit_contenu">Contenu</Label>
        <Textarea
          id="edit_contenu"
          value={formData.contenu}
          onChange={(e: React.FormEvent<HTMLFormElement>) => setFormData(prev => ({ ...prev, contenu: e.target.value }))}
          rows={6}
          required
        />
      </div>
      <div>
        <Label htmlFor="edit_previewImageUrl">URL de l'image d'aperçu (optionnel)</Label>
        <Input
          id="edit_previewImageUrl"
          type="url"
          value={formData.previewImageUrl}
          onChange={(e: React.FormEvent<HTMLFormElement>) => setFormData(prev => ({ ...prev, previewImageUrl: e.target.value }))}
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
          Mettre à jour
        </Button>
      </DialogFooter>
    </form>
  )
}

export default AdminAnnouncements