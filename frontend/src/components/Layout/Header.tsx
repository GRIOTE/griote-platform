// src/components/Layout/Header.tsx
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, LogOut, Home, Search, Megaphone, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/auth/useAuth"

import GrioteLogo from "@/assets/griote.svg"

const getNavItems = (isAuthenticated: boolean) => {
  const baseItems = [
    { name: "Explorer", href: "/recherche", icon: Search },
    { name: "Annonces", href: "/annonces", icon: Megaphone },
    { name: "À propos", href: "/a-propos", icon: Info },
  ]

  if (!isAuthenticated) {
    return [{ name: "Accueil", href: "/", icon: Home }, ...baseItems]
  }

  return baseItems
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated, logout, isLoading, user } = useAuth()

  const navItems = getNavItems(isAuthenticated)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={GrioteLogo} alt="Griote Foundation" className="h-10 w-auto" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-primary">Griote</span>
              <span className="text-[10px] uppercase tracking-widest text-primary/70 -mt-0.5">
                Project-Africa
              </span>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <div className="flex gap-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition",
                      isActive
                        ? "text-primary bg-accent"
                        : "text-black hover:bg-accent/70"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-3">

            {/* Desktop */}
            <div className="hidden lg:flex gap-3">
              {isLoading ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Chargement...
                </div>
              ) : !isAuthenticated ? (
                <>
                  <Link to="/connexion">
                    <button className="px-5 py-2 text-sm border rounded-lg">
                      Se connecter
                    </button>
                  </Link>
                  <Link to="/inscription">
                    <button className="px-6 py-2 text-sm bg-accent rounded-lg">
                      S'inscrire
                    </button>
                  </Link>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/mon-compte">
                    <button className="px-4 py-2 text-sm border rounded-lg hover:bg-accent/50 transition-colors">
                      Mon compte
                    </button>
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin/stats">
                      <button className="px-4 py-2 text-sm bg-accent rounded-lg hover:bg-accent/80 transition-colors">
                        Panneau d'administration
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Burger mobile */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="lg:hidden p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="px-6 py-5 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}

            <div className="pt-4 border-t">
              {isLoading ? (
                <div className="w-full py-3 text-center text-muted-foreground">
                  Chargement...
                </div>
              ) : !isAuthenticated ? (
                <>
                  <Link to="/connexion">
                    <button className="w-full py-3 border rounded-lg">
                      Se connecter
                    </button>
                  </Link>
                  <Link to="/inscription">
                    <button className="w-full py-3 bg-accent rounded-lg">
                      S'inscrire
                    </button>
                  </Link>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/mon-compte">
                    <button className="w-full py-3 border rounded-lg">
                      Mon compte
                    </button>
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin/stats">
                      <button className="w-full py-3 bg-accent rounded-lg">
                        Panneau d'administration
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full py-3 border rounded-lg"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
