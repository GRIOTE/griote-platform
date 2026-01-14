// src/components/Layout/Footer.tsx
import { Link } from "react-router-dom"
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react"
import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/button"
import GrioteLogo from "@/assets/griote.svg"

export default function Footer() {
  const { isAuthenticated, user } = useAuth()

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

        {/* === Ligne principale === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          {/* === Identité & vision === */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={GrioteLogo} alt="Griote" className="h-9 w-auto" />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tight">Griote</span>
                <span className="text-[11px] uppercase tracking-widest text-background/60">
                  Project-Africa
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-background/80 max-w-sm">
              Plateforme panafricaine dédiée à la structuration,
              la transmission et la valorisation des savoirs africains,
              académiques et technologiques.
            </p>
          </div>

          {/* === Navigation compacte === */}
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <Link to="/depots" className="hover:underline">Explorer</Link>
            <Link to="/annonces" className="hover:underline">Annonces</Link>
            <Link to="/projets-open-source" className="hover:underline">Open source</Link>
            <Link to="/a-propos" className="hover:underline">À propos</Link>

            {!isAuthenticated ? (
              <>
                <Link to="/connexion" className="hover:underline">Connexion</Link>
                <Link to="/inscription" className="hover:underline">Inscription</Link>
              </>
            ) : (
              <>
                <Link to="/mon-compte" className="hover:underline">Mon espace</Link>
                {user?.role === "ADMIN" && (
                  <Link to="/admin/stats" className="hover:underline">
                    Administration
                  </Link>
                )}
              </>
            )}
          </div>

          {/* === Contact / CTA assumé === */}
          <div className="flex flex-col items-start lg:items-end gap-5">

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/40 text-foreground hover:bg-background/10"
            >
              <a href="mailto:contact@griote.foundation" className="flex items-center gap-3">
                Contacter la fondation
                <Mail className="h-5 w-5" />
              </a>
            </Button>

            <div className="flex gap-4 text-background/60">
              <a href="https://github.com/griote-foundation" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 hover:text-background transition" />
              </a>
              <a href="https://twitter.com/griotefdn" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 hover:text-background transition" />
              </a>
              <a href="https://linkedin.com/company/griote-foundation" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5 hover:text-background transition" />
              </a>
            </div>
          </div>

        </div>

        {/* === Ligne finale === */}
        <div className="mt-14 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/50">
          <span>© {new Date().getFullYear()} Griote Foundation</span>
          <span className="flex items-center gap-1">
            Afrique → Monde <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>

      </div>
    </footer>
  )
}
