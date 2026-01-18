import { useState } from "react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { DialogFooter } from "../../../components/ui/dialog"

interface Props {
  initialName?: string
  loading?: boolean
  onSubmit: (name: string) => void

}

export default function CategoryForm({ initialName, loading, onSubmit }: Props) {
  const [name, setName] = useState(initialName ?? '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(name)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nom de la catégorie</Label>
        <Input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? 'En cours...' : initialName ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogFooter>
    </form>
  )
}
