// src/routes/UserRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/auth/ProtectedRoute";
import MainLayout from "@/components/Layout/MainLayout";

import Account from "@/pages/Account";

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

