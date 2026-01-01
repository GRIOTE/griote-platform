// src/routes/PublicRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/auth/useAuth"

import Home from "@/pages/Home"
import Recherche from "@/pages/Recherche"
import Announcements from "@/pages/Announcements"
import Connexion from "@/pages/Connexion"
import Inscription from "@/pages/Inscription"
import VerifyEmail from "@/pages/VerifyEmail"
import APropos from "@/pages/APropos"
import BureauExecutif from "@/pages/BureauExecutif"
import Contributeurs from "@/pages/Contributeurs"
import CestQuoiGriote from "@/pages/CestQuoiGriote"
import InterfaceSelection from "@/pages/InterfaceSelection"
import AnnouncementDetail from "@/pages/AnnouncementDetail"

export default function PublicRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  return (
    <Routes>
      {/* Landing page */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to="/recherche" replace />
            : <Home />
        }
      />

      {/* Auth */}
      <Route
        path="/connexion"
        element={
          isAuthenticated
            ? <Navigate to="/recherche" replace />
            : <Connexion />
        }
      />
      <Route
        path="/inscription"
        element={
          isAuthenticated
            ? <Navigate to="/recherche" replace />
            : <Inscription />
        }
      />

      {/* Explorer (devient la base logique après login) */}
      <Route path="/recherche" element={<Recherche />} />

      {/* Autres routes publiques */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/interface-selection" element={<InterfaceSelection />} />

      {/* Annonces */}
      <Route path="/annonces" element={<Announcements />} />
      <Route path="/annonces/:id" element={<AnnouncementDetail />} />

      {/* À propos */}
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/a-propos/bureau-executif" element={<BureauExecutif />} />
      <Route path="/a-propos/contributeurs" element={<Contributeurs />} />
      <Route path="/a-propos/cest-quoi-griote" element={<CestQuoiGriote />} />
    </Routes>
  )
}
