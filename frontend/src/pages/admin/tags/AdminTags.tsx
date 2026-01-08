import { useState } from "react"
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "../../../services/admin.service"

import type { Tag, TagFormData } from "./types"

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

import { Plus, Tag as TagIcon } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import TagsTable from "./TagsTable"
import TagForm from "./TagForm"

export default function AdminTags() {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const queryClient = useQueryClient()

  // ---------- QUERY ----------
  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: getTags,
  })

  // ---------- MUTATIONS ----------
  const createMutation = useMutation({
    mutationFn: (data: TagFormData) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag créé')
      setIsCreateOpen(false)
    },
    onError: () => toast.error('Erreur lors de la création'),
  })

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: TagFormData }) =>
      updateTag(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag mis à jour')
      setIsEditOpen(false)
      setSelectedTag(null)
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const deleteMutation = useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag supprimé')
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })

  // ---------- HANDLERS ----------
  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag)
    setIsEditOpen(true)
  }

  const handleDelete = (tagId: string) => {
    deleteMutation.mutate(tagId)
  }

  // ---------- UI ----------
  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tags Actifs</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des tags */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Tags</CardTitle>
              <CardDescription>Gestion des mots-clés</CardDescription>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un tag</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <TagForm
                  loading={createMutation.isPending}
                  onSubmit={createMutation.mutate}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <TagsTable
            data={tags}
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
            <DialogTitle>Modifier le tag</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selectedTag && (
            <TagForm
              initialValues={{
                name: selectedTag.name,
              }}
              loading={updateMutation.isPending}
              onSubmit={(data) =>
                updateMutation.mutate({
                  id: selectedTag.tag_id,
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
