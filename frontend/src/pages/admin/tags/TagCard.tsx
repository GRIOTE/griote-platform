import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Edit, Trash } from "lucide-react";
import type { Tag } from "@/types/tag";

interface TagCardProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (tagId: number) => void;
}

export default function TagCard({ tag, onEdit, onDelete }: TagCardProps) {
  return (
    <Card className="flex justify-between items-center p-4">
      <div>
        <CardTitle className="text-sm font-medium">{tag.name}</CardTitle>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(tag)}
        >
          <Edit className="h-4 w-4 mr-1" /> Modifier
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(tag.tag_id)}
        >
          <Trash className="h-4 w-4 mr-1" /> Supprimer
        </Button>
      </div>
    </Card>
  );
}
