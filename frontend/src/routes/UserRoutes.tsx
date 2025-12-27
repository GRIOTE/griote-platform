// src/routes/UserRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/auth/ProtectedRoute";

import MonCompte from "@/pages/MonCompte";

export default function UserRoutes() {
  return (
    <Routes>
      <Route
        path="compte"
        element={
          <ProtectedRoute>
            <MonCompte />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
