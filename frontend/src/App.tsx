
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index";
import Recherche from "./pages/Recherche";
import APropos from "./pages/APropos";
import Annonces from "./pages/Annonces";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import VerifyEmail from "./pages/VerifyEmail";
import MonCompte from "./pages/MonCompte";
import InterfaceSelection from "./pages/InterfaceSelection";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recherche" element={<Recherche />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/annonces" element={<Annonces />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/mon-compte" element={
              <ProtectedRoute>
                <MonCompte />
              </ProtectedRoute>
            } />
            <Route path="/interface-selection" element={
              <ProtectedRoute adminOnly>
                <InterfaceSelection />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
