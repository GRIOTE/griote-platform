import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Edit2 } from "lucide-react";

import { getCategories, createCategory, updateCategory, deleteCategory } from "../../../services/category.service";
import type { Category } from "../../../types/category";

import { Card, CardContent, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../../../components/ui/dialog";
import CategoryForm from "./CategoryForm";

export default function AdminCategories() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  // ---------- QUERY ----------
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // ---------- MUTATIONS ----------
  const createMutation = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]});
      toast.success("Catégorie créée");
      setIsCreateOpen(false);
    },
    onError: () => toast.error("Erreur lors de la création"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; name: string }) =>
      updateCategory(payload.id, payload.name),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]});
      toast.success("Catégorie mise à jour");
      setIsEditOpen(false);
      setSelectedCategory(null);
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]});
      toast.success("Catégorie supprimée");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  // ---------- HANDLERS ----------
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleDelete = (categoryId: number) => {
    if (confirm("Supprimer cette catégorie ?")) {
      deleteMutation.mutate(categoryId);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // ---------- UI ----------
  return (
    <div className="space-y-6">
      {/* Top bar: création + recherche */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-xs"
        />

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
              onSubmit={(name) => createMutation.mutate(name)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.category_id} className="flex flex-col justify-between">
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.category_id)}
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
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm
              initialName={selectedCategory.name}
              loading={updateMutation.isPending}
              onSubmit={(name) =>
                updateMutation.mutate({ id: selectedCategory.category_id, name })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
