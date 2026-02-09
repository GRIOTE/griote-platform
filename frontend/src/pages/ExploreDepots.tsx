import { UnderConstruction } from "@/components/UnderConstruction"
import Header from "@/components/Layout/Header"
import Footer from "@/components/Layout/Footer"
import { useAuth } from "@/auth/useAuth"

export default function ExploreDepots() {
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-griote-white">

      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Overlay "En construction" avec effet de flou */}
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Contenu floué en arrière-plan */}
            <div className="filter blur-sm pointer-events-none select-none opacity-50 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-griote-blue mb-4">
                  Explorer les Dépôts
                </h1>
                <p className="text-xl text-griote-gray-800/80">
                  Découvrez les travaux académiques de notre communauté panafricaine
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            {/* Message "En construction" centré */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-lg mx-4">
                <UnderConstruction
                  title="Section en construction"
                  message="L'exploration des dépôts arrive bientôt ! Notre équipe travaille actuellement sur cette fonctionnalité pour vous offrir une expérience de recherche optimale."
                />
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
