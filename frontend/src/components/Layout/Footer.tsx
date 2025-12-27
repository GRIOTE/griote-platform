// components/layout/Footer.tsx
import { Link } from "react-router-dom";
import GrioteLogo from "@/assets/griote.svg";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 pt-16 pb-10 lg:pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 max-w-6xl mx-auto">

          {/* === COLONNE 1 – Logo + slogan fort === */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-4 mb-6">
              <img src={GrioteLogo} alt="Griote Foundation" className="h-14 w-auto" />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold text-white">Griote</span>
                <span className="text-xs uppercase tracking-widest text-white/60">
                  Foundation
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-lg font-light max-w-xs">
              L’écosystème panafricain du savoir et de l’innovation technologique.
            </p>
          </div>

          {/* === COLONNE 2 – Liens rapides === */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-6">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/70 hover:text-white transition">Accueil</Link></li>
              <li><Link to="/explorer/tous" className="text-white/70 hover:text-white transition">Explorer les dépôts</Link></li>
              <li><Link to="/annonces/bourses" className="text-white/70 hover:text-white transition">Annonces & opportunités</Link></li>
              <li><Link to="/projets-open-source" className="text-white/70 hover:text-white transition">Projets open source</Link></li>
              <li><Link to="/apropos/mission" className="text-white/70 hover:text-white transition">À propos</Link></li>
            </ul>
          </div>

          {/* === COLONNE 3 – Contact & réseaux === */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-6">Rejoignez-nous</h3>
            <div className="flex justify-center md:justify-start gap-5 mb-6">
              <a href="https://github.com/griote-foundation" target="_blank" rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/griotefdn" target="_blank" rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/company/griote-foundation" target="_blank" rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:contact@griote.foundation"
                className="text-white/60 hover:text-white transition">
                <Mail className="w-6 h-6" />
              </a>
            </div>
            <p className="text-white/60 text-sm">
              contact@griote.foundation
            </p>
          </div>

        </div>

        {/* === Ligne finale – fierté africaine === */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Griote Foundation • Fait avec passion pour l’Afrique et par l’Afrique
          </p>
        </div>

      </div>
    </footer>
  );
} 