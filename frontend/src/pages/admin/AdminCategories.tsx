import React, { useState } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category
} from '@/services/admin.service'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FolderOpen, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

function AdminCategories(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success("Catégorie supprimée")
    }
  })

  return (
    <div className="space-y-6">
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
                <CreateCategoryForm onClose={() => setIsCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center h-48 items-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Création</TableHead>
                    <TableHead>Modification</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map(c => (
                    <TableRow key={c.category_id}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.description ?? '—'}</TableCell>
                      <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(c.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCategory(c)
                            setIsEditOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(c.category_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selectedCategory && (
            <EditCategoryForm
              category={selectedCategory}
              onClose={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateCategoryForm({ onClose }: { onClose: () => void }): JSX.Element {
  const [formData, setFormData] = useState<{ name: string; description?: string }>({
    name: '',
    description: ''
  })

  const queryClient = useQueryClient()

  const mutation = useMutation<
    Category,
    Error,
    { name: string; description?: string }
  >({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success("Catégorie créée")
      onClose()
    }
  })

  const submit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Label>Nom</Label>
      <Input
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData(p => ({ ...p, name: e.target.value }))
        }
      />
      <Label>Description</Label>
      <Textarea
        value={formData.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setFormData(p => ({ ...p, description: e.target.value }))
        }
      />
      <DialogFooter>
        <Button type="submit">Créer</Button>
      </DialogFooter>
    </form>
  )
}

function EditCategoryForm({
  category,
  onClose
}: {
  category: Category
  onClose: () => void
}): JSX.Element {
  const [formData, setFormData] = useState<{ name: string; description?: string }>({
    name: category.name,
    description: category.description
  })

  const queryClient = useQueryClient()

  const mutation = useMutation<
    Category,
    Error,
    { name: string; description?: string }
  >({
    mutationFn: (data) => updateCategory(category.category_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success("Catégorie mise à jour")
      onClose()
    }
  })

  const submit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Label>Nom</Label>
      <Input
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData(p => ({ ...p, name: e.target.value }))
        }
      />
      <Label>Description</Label>
      <Textarea
        value={formData.description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setFormData(p => ({ ...p, description: e.target.value }))
        }
      />
      <DialogFooter>
        <Button type="submit">Mettre à jour</Button>
      </DialogFooter>
    </form>
  )
}

export default AdminCategories
