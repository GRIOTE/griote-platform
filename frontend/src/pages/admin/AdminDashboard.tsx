import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  User as UserIcon,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, PlatformStats } from '@/services/admin.service';
import { User } from '@/services/auth.service';
import UserModal from '@/components/admin/UserModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/connexion');
      return;
    }
    
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load platform statistics
      const statsData = await adminService.getPlatformStats();
      setStats(statsData);

      // Load users
      const usersData = await adminService.getAllUsers({ limit: 50 });
      setUsers(usersData.users || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/connexion');
  };

  const handleClientInterface = () => {
    navigate('/');
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (userData: UserData) => {
    setSelectedUser(userData);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await adminService.deleteUser(userId);
      loadDashboardData(); // Reload data
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(`Erreur: ${error.message || 'Erreur lors de la suppression de l\'utilisateur'}`);
    }
  };

  const handleUserModalClose = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'USER': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(u => 
    u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-griote-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-griote-gray-800">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-griote-blue">
                Administration Griote
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleClientInterface}
                className="flex items-center space-x-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>Espace Client</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-griote-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </span>
                    </div>
                    <span className="hidden md:block">{user?.first_name} {user?.last_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'users', label: 'Utilisateurs', icon: Users },
              { id: 'content', label: 'Contenu', icon: FileText },
              { id: 'orders', label: 'Commandes', icon: ShoppingCart },
              { id: 'settings', label: 'Paramètres', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-griote-blue text-white'
                      : 'text-griote-gray-800 hover:text-griote-blue hover:bg-griote-blue/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs Vérifiés</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.verifiedUsers || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nouveaux (30j)</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.recentUsers || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Vérification</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalUsers ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users by Role Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Rôle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.usersByRole?.map((roleData) => (
                    <div key={roleData.role} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleBadgeColor(roleData.role)}>
                          {roleData.role}
                        </Badge>
                      </div>
                      <span className="font-medium">{roleData.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-griote-blue">Gestion des Utilisateurs</h2>
              <Button className="griote-button" onClick={handleCreateUser}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel Utilisateur
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'inscription
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((userData) => (
                        <tr key={userData.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-griote-blue rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {userData.first_name[0]}{userData.last_name[0]}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {userData.first_name} {userData.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {userData.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getRoleBadgeColor(userData.role)}>
                              {userData.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={userData.is_email_verified ? "default" : "secondary"}>
                              {userData.is_email_verified ? 'Vérifié' : 'Non vérifié'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(userData.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditUser(userData)}>
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteUser(userData.user_id)} className="text-red-600">
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other tabs placeholders */}
        {activeTab === 'content' && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion du Contenu</h3>
            <p className="text-gray-500">Cette section sera développée prochainement.</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des Commandes</h3>
            <p className="text-gray-500">Cette section sera développée prochainement.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Paramètres Système</h3>
            <p className="text-gray-500">Cette section sera développée prochainement.</p>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={handleUserModalClose}
        user={selectedUser}
        onUserUpdated={loadDashboardData}
      />
    </div>
  );
};

export default AdminDashboard;
