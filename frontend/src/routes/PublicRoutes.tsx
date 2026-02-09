// src/routes/PublicRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/auth/useAuth"
import MainLayout from "@/components/Layout/MainLayout"
import AuthLayout from "@/components/Layout/AuthLayout"

import Home from "@/pages/Home"
import Depots from "@/pages/ExploreDepots"
import Announcements from "@/pages/Annonces"
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
      {/* Routes sans header/footer - Auth only */}
      <Route element={<AuthLayout />}>
        <Route
          path="/connexion"
          element={
            isAuthenticated
              ? <Navigate to="/depots" replace />
              : <Connexion />
          }
        />
        <Route
          path="/inscription"
          element={
            isAuthenticated
              ? <Navigate to="/depots" replace />
              : <Inscription />
          }
        />
      </Route>

      {/* Routes avec header/footer */}
      <Route element={<MainLayout />}>
        {/* Landing page */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/depots" replace />
              : <Home />
          }
        />

        {/* Explorer les dépôts - En construction */}
        <Route path="/depots" element={<Depots />} />

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
      </Route>
    </Routes>
  )
}
