import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../ui/sidebar";
import { LogOut, Settings, BarChart3, Users, FolderOpen, Tag, Megaphone } from "lucide-react";
import { useAuth } from "../../auth/useAuth";

const menuItems = [
  { id: "stats", title: "Statistiques", icon: BarChart3, path: "/admin/stats" },
  { id: "announcements", title: "Annonces", icon: Megaphone, path: "/admin/announcements" },
  { id: "users", title: "Utilisateurs", icon: Users, path: "/admin/users" },
  { id: "categories", title: "Catégories", icon: FolderOpen, path: "/admin/categories" },
  { id: "tags", title: "Tags", icon: Tag, path: "/admin/tags" },
  { id: "depots", title: "Dépôts", icon: BarChart3, path: "/admin/depots" },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirection si non connecté
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur logout:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    navigate("/");
  };

  const activeItem = menuItems.find((item) => item.path === location.pathname);

  return (
    <SidebarProvider>
      <Sidebar>
        {/* Header */}
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Settings className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Administration</span>
              <span className="text-xs text-muted-foreground">GRIOTE</span>
            </div>
          </div>
        </SidebarHeader>

        {/* Menu principal */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.path}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.path);
                        }}
                        className={`flex items-center gap-2 ${
                          location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Contenu principal */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-lg font-semibold">{activeItem?.title || "Administration"}</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminLayout;
