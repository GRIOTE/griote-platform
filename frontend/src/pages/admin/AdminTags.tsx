import React, { useState } from 'react'
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  Tag
} from '@/services/admin.service'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Tag as TagIcon, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

function AdminTags(): JSX.Element {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: getTags
  })

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success("Tag supprimé")
    }
  })

  return (
    <div className="space-y-6">
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
                <CreateTagForm onClose={() => setIsCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Création</TableHead>
                    <TableHead>Modification</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.map(tag => (
                    <TableRow key={tag.tag_id}>
                      <TableCell>
                        <Badge variant="outline">{tag.name}</Badge>
                      </TableCell>
                      <TableCell>{new Date(tag.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(tag.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTag(tag)
                            setIsEditOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(tag.tag_id)}
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
            <DialogTitle>Modifier le tag</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selectedTag && (
            <EditTagForm
              tag={selectedTag}
              onClose={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateTagForm({ onClose }: { onClose: () => void }): JSX.Element {
  const [name, setName] = useState('')

  const queryClient = useQueryClient()

  const mutation = useMutation<Tag, Error, { name: string }>({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success("Tag créé")
      onClose()
    }
  })

  const submit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    mutation.mutate({ name })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Label>Nom du tag</Label>
      <Input
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />
      <DialogFooter>
        <Button type="submit">Créer</Button>
      </DialogFooter>
    </form>
  )
}

function EditTagForm({
  tag,
  onClose
}: {
  tag: Tag
  onClose: () => void
}): JSX.Element {
  const [name, setName] = useState(tag.name)

  const queryClient = useQueryClient()

  const mutation = useMutation<Tag, Error, { name: string }>({
    mutationFn: (data) => updateTag(tag.tag_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success("Tag mis à jour")
      onClose()
    }
  })

  const submit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    mutation.mutate({ name })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Label>Nom du tag</Label>
      <Input
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />
      <DialogFooter>
        <Button type="submit">Mettre à jour</Button>
      </DialogFooter>
    </form>
  )
}

export default AdminTags
