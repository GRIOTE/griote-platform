// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/auth/AuthProvider";

import AdminRoutes from "@/routes/AdminRoutes";
import UserRoutes from "@/routes/UserRoutes";
import PublicRoutes from "@/routes/PublicRoutes";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/mon-compte/*" element={<UserRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="/*" element={<PublicRoutes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
