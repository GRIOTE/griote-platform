// src/routes/AdminRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/auth/ProtectedRoute";

import AdminDashboard from "@/pages/admin/AdminDashboard";
// import Users from "@/pages/admin/Users";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* futurs écrans admin */}
      {/* <Route path="users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} /> */}
    </Routes>
  );
}
