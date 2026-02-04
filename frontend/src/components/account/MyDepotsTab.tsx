import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function MyDepotsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-griote-blue-dark">Mes dépôts</CardTitle>
        <CardDescription className="text-griote-gray-600">
          Consultez vos dépôts uploadés
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-griote-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-griote-gray-900 mb-2">Aucun dépôt trouvé</h3>
        <p className="text-griote-gray-600 mb-4">
          Vous n'avez pas encore uploadé de dépôts sur la plateforme.
        </p>
        <Button className="bg-griote-blue text-white hover:bg-griote-blue-dark">
          <Upload className="mr-2 h-4 w-4" /> Uploader un dépôt
        </Button>
      </CardContent>
    </Card>
  );
}
