import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Edit2 } from "lucide-react";

import { getTags, createTag, updateTag, deleteTag } from "../../../services/tag.service";
import type { Tag } from "../../../types/tag";

import { Card, CardContent, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../../../components/ui/dialog";
import TagForm from "./TagForm";

export default function AdminTags() {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  // ---------- QUERY ----------
  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  // ---------- MUTATIONS ----------
  const createMutation = useMutation({
    mutationFn: (data: { name: string }) => createTag(data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tags"]});
      toast.success("Tag créé");
      setIsCreateOpen(false);
    },
    onError: () => toast.error("Erreur lors de la création"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; data: { name: string } }) =>
      updateTag(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tags"]});
      toast.success("Tag mis à jour");
      setIsEditOpen(false);
      setSelectedTag(null);
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const deleteMutation = useMutation({
    mutationFn: (tagId: number) => deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["tags"]});
      toast.success("Tag supprimé");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  // ---------- HANDLERS ----------
  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setIsEditOpen(true);
  };

  const handleDelete = (tagId: number) => {
    if (confirm("Supprimer ce tag ?")) {
      deleteMutation.mutate(tagId);
    }
  };

  const filteredTags = useMemo(() => {
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tags, searchTerm]);

  // ---------- UI ----------
  return (
    <div className="space-y-6">
      {/* Top bar: création + recherche */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Rechercher un tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-xs"
        />

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
              onSubmit={(data) => createMutation.mutate(data)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTags.map((tag) => (
          <Card key={tag.tag_id} className="flex flex-col justify-between">
            <CardContent className="flex flex-col gap-2 pt-6">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-sm font-medium truncate">{tag.name}</CardTitle>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(tag)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(tag.tag_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog édition */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le tag</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selectedTag && (
            <TagForm
              initialValues={{ name: selectedTag.name }}
              loading={updateMutation.isPending}
              onSubmit={(data) =>
                updateMutation.mutate({ id: selectedTag.tag_id, data })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
