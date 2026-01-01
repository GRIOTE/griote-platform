// src/routes/AdminRoutes.tsx

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/auth/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout"; // ou ton chemin exact

import AdminStats from "@/pages/admin/AdminStats";
import AdminAnnouncements from "@/pages/admin/AdminAnnouncements";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminTags from "@/pages/admin/AdminTags";
import AdminDepots from "@/pages/admin/AdminDepots";

export default function AdminRoutes() {
  return (
    <ProtectedRoute adminOnly>
      <Routes>
        {/* Route parent avec le layout */}
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminStats />} />           {/* /admin/stats → stats */}
          <Route index element={<AdminStats />} />           {/* /admin → stats par défaut */}
          <Route path="stats" element={<AdminStats />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="depots" element={<AdminDepots />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}