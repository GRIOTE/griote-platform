import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Tag } from "../../../services/admin.service"
import { Edit, Trash2, Loader2 } from "lucide-react"

interface Props {
  data: Tag[]
  isLoading: boolean
  onEdit: (tag: Tag) => void
  onDelete: (tagId: string) => void
}

export default function TagsTable({ data, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
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
          {data.map((tag) => (
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
                  onClick={() => onEdit(tag)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) {
                      onDelete(tag.tag_id)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
