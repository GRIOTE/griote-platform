import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import type { Announcement } from "../../../types/announcement"
import { Edit, Trash2, RefreshCw, CheckCircle, Archive, Image as ImageIcon } from "lucide-react"

interface Props {
  data: Announcement[];
  isLoading: boolean;
  onPublish: (id: number) => void;
  onArchive: (id: number) => void;
  onEdit: (a: Announcement) => void;
  onDelete: (id: number) => void;
}

const statusBadge = (status: string) => {
  if (status === "pending") return <Badge variant="secondary">En attente</Badge>
  if (status === "published") return <Badge className="bg-green-100 text-green-800">Publié</Badge>
  return <Badge variant="outline">Archivé</Badge>
}

export default function AnnouncementsTable({ data, isLoading, onPublish, onArchive, onEdit, onDelete }: Props) {
  if (isLoading) return <p className="text-center py-8">Chargement...</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Aperçu</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Création</TableHead>
          <TableHead>Publication</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(a => (
          <TableRow key={a.announcement_id}>
            <TableCell>
              <div className="w-20 h-14 rounded overflow-hidden bg-gray-100">
                {a.previewImage ? <img src={a.previewImage.url} alt={a.titre} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-400"/></div>}
              </div>
            </TableCell>
            <TableCell className="font-medium max-w-xs truncate">{a.titre}</TableCell>
            <TableCell>{statusBadge(a.statut)}</TableCell>
            <TableCell>{new Date(a.date_creation).toLocaleDateString()}</TableCell>
            <TableCell>{a.date_publication ? new Date(a.date_publication).toLocaleDateString() : "-"}</TableCell>
            <TableCell className="flex gap-2">
              {a.statut === "pending" && <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onPublish(a.announcement_id)} title="Publier"><CheckCircle className="h-4 w-4 mr-1"/>Publier</Button>}
              {a.statut === "published" && <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => onArchive(a.announcement_id)} title="Archiver"><Archive className="h-4 w-4 mr-1"/>Archiver</Button>}
              {a.statut === "archived" && <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onPublish(a.announcement_id)} title="Republier"><RefreshCw className="h-4 w-4 mr-1"/>Republier</Button>}
              <Button size="sm" variant="outline" onClick={() => onEdit(a)} title="Modifier"><Edit className="h-4 w-4"/></Button>
              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => onDelete(a.announcement_id)} title="Supprimer"><Trash2 className="h-4 w-4"/></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
