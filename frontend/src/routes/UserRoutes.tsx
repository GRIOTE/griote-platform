// src/routes/UserRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/auth/ProtectedRoute";
import MainLayout from "@/components/Layout/MainLayout";

import MonCompte from "@/pages/MonCompte";

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MonCompte />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
