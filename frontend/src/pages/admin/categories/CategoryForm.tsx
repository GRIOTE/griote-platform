import { useState } from "react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { DialogFooter } from "../../../components/ui/dialog"
import type { CategoryFormData } from "./types"

interface Props {
  initialValues?: {
    name: string
    description?: string
  }
  loading?: boolean
  onSubmit: (data: CategoryFormData) => void
}

export default function CategoryForm({ initialValues, loading, onSubmit }: Props) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nom</Label>
        <Input
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((p) => ({ ...p, name: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData((p) => ({ ...p, description: e.target.value }))
          }
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? 'En cours...' : initialValues ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogFooter>
    </form>
  )
}
