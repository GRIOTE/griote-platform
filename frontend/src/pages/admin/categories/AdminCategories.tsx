import { useState } from "react"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/admin.service"

import type { Category, CategoryFormData } from "./types"

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

import { Plus, FolderOpen } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import CategoriesTable from "./CategoriesTable"
import CategoryForm from "./CategoryForm"

export default function AdminCategories() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const queryClient = useQueryClient()

  // ---------- QUERY ----------
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  // ---------- MUTATIONS ----------
  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie créée')
      setIsCreateOpen(false)
    },
    onError: () => toast.error('Erreur lors de la création'),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: CategoryFormData }) =>
      updateCategory(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie mise à jour')
      setIsEditOpen(false)
      setSelectedCategory(null)
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Catégorie supprimée')
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })

  // ---------- HANDLERS ----------
  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsEditOpen(true)
  }

  const handleDelete = (categoryId: string) => {
    deleteMutation.mutate(categoryId)
  }

  // ---------- UI ----------
  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Catégories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Catégories Actives</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des catégories */}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Gestion des Catégories</CardTitle>
              <CardDescription>Organisation du contenu</CardDescription>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle catégorie
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une catégorie</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <CategoryForm
                  loading={createMutation.isPending}
                  onSubmit={createMutation.mutate}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <CategoriesTable
            data={categories}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm
              initialValues={{
                name: selectedCategory.name,
                description: selectedCategory.description,
              }}
              loading={updateMutation.isPending}
              onSubmit={(data) =>
                updateMutation.mutate({
                  id: selectedCategory.category_id,
                  data,
                })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
