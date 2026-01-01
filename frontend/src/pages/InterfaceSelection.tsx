// src/pages/InterfaceSelection.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const InterfaceSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("InterfaceSelection rendered, user:", user);

  const handleAdminSelection = () => {
    navigate("/admin");
  };

  const handleUserSelection = () => {
    navigate("/mon-compte");
  };

  if (!user || user.role !== 'ADMIN') {
    console.log("Redirecting to home, user:", user);
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sélection d'interface
          </h1>
          <p className="text-gray-600">
            Bienvenue {user.first_name} {user.last_name}. Choisissez l'interface que vous souhaitez utiliser.
          </p>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Interface Administrateur</h2>
            <p className="text-gray-600 mb-4">
              Accédez au panneau d'administration pour gérer les utilisateurs et le système.
            </p>
            <button
              onClick={handleAdminSelection}
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Accéder à l'administration
            </button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Interface Utilisateur</h2>
            <p className="text-gray-600 mb-4">
              Accédez à votre espace personnel pour gérer vos dépôts et documents.
            </p>
            <button
              onClick={handleUserSelection}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Accéder à mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceSelection;
