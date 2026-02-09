import { useState } from "react";
import {
  getAllAnnouncementsForAdmin,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  archiveAnnouncement,
} from "../../../services/announcement.service";

import type { Announcement } from "../../../types/announcement";
import type { AnnouncementFormData } from "./types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import AnnouncementsTable from "./AnnouncementsTable";
import AnnouncementForm from "./AnnouncementForm";

export default function AdminAnnouncements() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "published" | "archived"
  >("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<Announcement | null>(null);

  const queryClient = useQueryClient();

  // ---------- QUERY ----------
  const { data, isLoading } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: getAllAnnouncementsForAdmin,
  });

  // ---------- MUTATIONS ----------
  const createMutation = useMutation({
    mutationFn: async (formData: AnnouncementFormData) => {
      // Upload image if provided and convert to FormData for backend
      const imageFile = formData.image;
      
      return createAnnouncement({
        titre: formData.titre,
        contenu: formData.contenu,
        image: imageFile,
        image_apercu_id: formData.image_apercu_id,
      });
    },
    onSuccess: () => {
      toast.success("Annonce créée");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setOpenCreate(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Erreur lors de la création");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: number;
      titre: string;
      contenu: string;
      image?: File;
      image_apercu_id?: number;
    }) => {
      return updateAnnouncement(payload.id, {
        titre: payload.titre,
        contenu: payload.contenu,
        image: payload.image,
        image_apercu_id: payload.image_apercu_id,
      });
    },
    onSuccess: () => {
      toast.success("Annonce mise à jour");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setOpenEdit(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Erreur lors de la mise à jour");
    },
  });

  const publishMutation = useMutation({
    mutationFn: publishAnnouncement,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveAnnouncement,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });

  // ---------- FILTER FRONT ----------
  const announcements =
    data?.filter(
      (a) =>
        (statusFilter === "all" || a.statut === statusFilter) &&
        (!search || a.titre.toLowerCase().includes(search.toLowerCase()))
    ) ?? [];

  // ---------- UI ----------
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Gestion des annonces</CardTitle>
          <CardDescription>Administration du contenu</CardDescription>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Nouvelle annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle annonce</DialogTitle>
            </DialogHeader>
            <AnnouncementForm
              loading={createMutation.isPending}
              onSubmit={createMutation.mutate}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Recherche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as "all" | "pending" | "published" | "archived")
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnnouncementsTable
          data={announcements}
          isLoading={isLoading}
          onPublish={(id) => publishMutation.mutate(id)}
          onArchive={(id) => archiveMutation.mutate(id)}
          onDelete={(id) => deleteMutation.mutate(id)}
          onEdit={(a) => {
            setSelected(a);
            setOpenEdit(true);
          }}
        />
      </CardContent>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l’annonce</DialogTitle>
          </DialogHeader>
          {selected && (
            <AnnouncementForm
              initialValues={{
                titre: selected.titre,
                contenu: selected.contenu,
                previewImage: selected.previewImage,
              }}
              loading={updateMutation.isPending}
              onSubmit={(data) =>
                updateMutation.mutate({
                  id: selected.announcement_id,
                  ...data,
                  image_apercu_id: selected.previewImage?.id || data.image_apercu_id,
                })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
