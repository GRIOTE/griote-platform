import { Link } from 'react-router-dom';
import GrioteLogo from '@/assets/griote.svg';

const Footer = () => {
  return (
    <footer className="bg-griote-blue border-t-4 border-griote-accent">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo et description */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
              <img src={GrioteLogo} alt="Griote Logo" className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-griote-white leading-none">Griote</span>
                <span className="text-[10px] font-medium text-griote-white/80 leading-tight">foundation</span>
              </div>
            </Link>
            <p className="text-griote-white/80 text-sm leading-relaxed">
              Plateforme panafricaine dédiée à la valorisation des dépôts académiques 
              et à l'accès aux bourses d'études supérieures.
            </p>
          </div>

          {/* Liens essentiels */}
          <div>
            <h4 className="text-griote-accent font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/recherche" 
                  className="text-griote-white/80 hover:text-griote-accent text-sm transition-colors duration-300"
                >
                  Explorer les dépôts
                </Link>
              </li>
              <li>
                <Link 
                  to="/recherche" 
                  className="text-griote-white/80 hover:text-griote-accent text-sm transition-colors duration-300"
                >
                  Nos annonces
                </Link>
              </li>
              <li>
                <Link 
                  to="/bourses" 
                  className="text-griote-white/80 hover:text-griote-accent text-sm transition-colors duration-300"
                >
                  Opportunités disponibles
                </Link>
              </li>
              <li>
                <Link 
                  to="/a-propos" 
                  className="text-griote-white/80 hover:text-griote-accent text-sm transition-colors duration-300"
                >
                  À propos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de page */}
        <div className="border-t border-griote-accent/30 mt-8 pt-8 text-center">
          <p className="text-griote-white/60 text-sm">
            © 2025 Fondation Griote. Tous droits réservés.
          </p>
          <p className="text-griote-white/60 text-sm mt-2">
            Fait avec ❤️ pour l'Afrique
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
