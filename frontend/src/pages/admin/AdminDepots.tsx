import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDepots,
  deleteDepot,
} from '@/services/admin.service'
import type { Depot } from '@/services/admin.service'
import { BarChart3, Eye, Trash2, Loader2, FileText } from "lucide-react"
import { toast } from "sonner"
import { UnderConstruction } from "@/components/UnderConstruction"

function AdminDepots(): JSX.Element {
  const [selectedDepot, setSelectedDepot] = useState<Depot | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: depots = [], isLoading } = useQuery<Depot[]>({
    queryKey: ['depots'],
    queryFn: getDepots
  })

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteDepot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depots'] })
      toast.success("Dépôt supprimé")
    },
    onError: () => toast.error("Erreur lors de la suppression")
  })

  const handleDelete = (depotId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce dépôt ?")) {
      deleteMutation.mutate(depotId)
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Dépôts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{depots.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents Totaux</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {depots.reduce((total, d) => total + (d.documents?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dépôts Actifs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {depots.filter(d => d.status === 'PUBLISHED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des dépôts - En construction */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle>Gestion des Dépôts</CardTitle>
          <CardDescription>Superviser tous les dépôts</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Overlay "En construction" avec effet de flou */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <UnderConstruction
              title="Section en construction"
              message="La gestion des dépôts arrive bientôt. Notre équipe travaille actuellement sur cette fonctionnalité pour vous offrir une expérience optimale."
            />
          </div>

          {/* Contenu floué en arrière-plan */}
          <div className="filter blur-sm pointer-events-none select-none opacity-50">
            {isLoading ? (
              <div className="flex justify-center h-64 items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depots.map(depot => (
                    <TableRow key={depot.depot_id}>
                      <TableCell>{depot.title}</TableCell>
                      <TableCell>{depot.category?.name || "Aucune"}</TableCell>
                      <TableCell>
                        <Badge variant={depot.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                          {depot.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{depot.documents?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {depot.tags?.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag.name}</Badge>
                          ))}
                          {depot.tags && depot.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{depot.tags.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(depot.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDepot(depot)
                              setIsDetailsOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(depot.depot_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du dépôt</DialogTitle>
            <DialogDescription>Informations complètes sur le dépôt</DialogDescription>
          </DialogHeader>
          {selectedDepot && (
            <div className="space-y-4">
              <p><strong>Titre:</strong> {selectedDepot.title}</p>
              <p><strong>Statut:</strong> <Badge variant={selectedDepot.status === 'PUBLISHED' ? 'default' : 'secondary'}>{selectedDepot.status}</Badge></p>
              <p><strong>Catégorie:</strong> {selectedDepot.category?.name || "Aucune"}</p>
              <p><strong>Documents:</strong> {selectedDepot.documents?.length || 0}</p>
              <p><strong>Description:</strong> {selectedDepot.description || "Aucune"}</p>
              <p><strong>Tags:</strong> {selectedDepot.tags?.map((t, i) => <Badge key={i} variant="outline">{t.name}</Badge>) || "Aucun"}</p>
              <p><strong>Créé le:</strong> {new Date(selectedDepot.created_at).toLocaleString()}</p>
              <p><strong>Modifié le:</strong> {new Date(selectedDepot.updated_at).toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminDepots
