// src/routes/PublicRoutes.tsx
import { Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import Recherche from "@/pages/Recherche";
import Connexion from "@/pages/Connexion";
import Inscription from "@/pages/Inscription";
import VerifyEmail from "@/pages/VerifyEmail";
import APropos from "@/pages/APropos";
import BureauExecutif from "@/pages/BureauExecutif";
import Contributeurs from "@/pages/Contributeurs";
import CestQuoiGriote from "@/pages/CestQuoiGriote";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recherche" element={<Recherche />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/a-propos/bureau-executif" element={<BureauExecutif />} />
      <Route path="/a-propos/contributeurs" element={<Contributeurs />} />
      <Route path="/a-propos/cest-quoi-griote" element={<CestQuoiGriote />} />
    </Routes>
  );
}
