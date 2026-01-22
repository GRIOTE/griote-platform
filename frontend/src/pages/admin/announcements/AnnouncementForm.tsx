import { useState, useEffect } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import ReactQuill from "react-quill";
import { quillModules } from "../../../utils/quill";
import "react-quill/dist/quill.snow.css";
import type { AnnouncementFormData } from "./types";
import { X, Image as ImageIcon } from "lucide-react";

interface Props {
  initialValues?: {
    titre: string;
    contenu: string;
    previewImage?: { id?: number; url: string } | null; // ajout id pour backend
  };
  loading?: boolean;
  onSubmit: (data: AnnouncementFormData) => void;
}

export default function AnnouncementForm({
  initialValues,
  loading,
  onSubmit,
}: Props) {
  const [titre, setTitre] = useState(initialValues?.titre ?? "");
  const [contenu, setContenu] = useState(initialValues?.contenu ?? "");

  const [image, setImage] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removePreview, setRemovePreview] = useState(false);

  // si on a une image initiale et qu'on n'a pas encore choisi de fichier
  useEffect(() => {
    if (!image && initialValues?.previewImage?.url) {
      setImagePreview(initialValues.previewImage.url);
      setRemovePreview(false);
    }
  }, [initialValues, image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image trop lourde (max 5MB)");
      return;
    }
    setImage(file);
    setRemovePreview(false); // on garde l'image
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(undefined);
    setImagePreview(null);
    setRemovePreview(true); // indique au backend qu'il faut supprimer l'image existante
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // construction du payload pour le backend
    const payload: AnnouncementFormData = {
      titre,
      contenu,
      image: image, // fichier à uploader si nouveau
      removePreview, // flag pour supprimer l'image existante
      image_apercu_id: initialValues?.previewImage?.id, // si on a une image déjà associée
    };

    onSubmit(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* titre */}
      <div>
        <Label>Titre</Label>
        <Input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Titre de l'annonce"
          required
        />
      </div>

      {/* contenu */}
      <div>
        <Label>Contenu</Label>
        <ReactQuill
          value={contenu}
          onChange={setContenu}
          modules={quillModules}
        />
      </div>

      {/* image */}
      <div>
        <Label>Image d'aperçu (optionnel)</Label>
        {imagePreview ? (
          <div className="relative mt-2 w-full max-w-md">
            <img
              src={imagePreview}
              alt="Aperçu"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors mt-2">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Cliquez pour télécharger</span>{" "}
                ou glissez-déposez
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG ou GIF (max 5MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}

        {imagePreview && (
          <div className="mt-2">
            <label className="text-sm text-blue-600 cursor-pointer hover:underline">
              Choisir une autre image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        )}
      </div>

      {/* bouton */}
      <div className="flex gap-2 pt-4">
        <Button disabled={loading} type="submit">
          {loading ? "En cours..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
