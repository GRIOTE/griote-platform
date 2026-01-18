import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Category } from "../../../services/admin.service"
import { Edit, Trash2, Loader2 } from "lucide-react"

interface Props {
  data: Category[]
  isLoading: boolean
  onEdit: (category: Category) => void
  onDelete: (categoryId: string) => void
}

export default function CategoriesTable({ data, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center h-48 items-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
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
          {data.map((category) => (
            <TableRow key={category.category_id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description ?? '—'}</TableCell>
              <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(category.updated_at).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                      onDelete(category.category_id)
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
