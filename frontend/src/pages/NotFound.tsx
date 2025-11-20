import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import GrioteLogo from '@/assets/griote.svg';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
      <div className="text-center px-4">
        {/* Illustration 404 */}
        <div className="mb-8">
          <img src={GrioteLogo} alt="Griote Logo" className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-6xl md:text-8xl font-bold text-[#003399] mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#003399] mb-4">
            Page introuvable
          </h2>
          <p className="text-lg text-[#6B7280] mb-8 max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/">
            <Button className="bg-[#003399] text-white hover:bg-[#F2B600] hover:text-[#003399] px-6 py-3 transition-colors duration-200 flex items-center justify-center">
              <Home className="w-5 h-5 mr-2" /> Accueil
            </Button>
          </Link>
          <Link to="/recherche">
            <Button variant="outline" className="border-[#003399] text-[#003399] hover:bg-[#F2B600] hover:text-[#003399] px-6 py-3 transition-colors duration-200 flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" /> Explorer les dépôts
            </Button>
          </Link>
        </div>

        {/* Lien retour */}
        <button
          onClick={() => window.history.back()}
          className="mt-4 inline-flex items-center text-[#003399] hover:text-[#F2B600] transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la page précédente
        </button>
      </div>
    </div>
  );
};

export default NotFound;
