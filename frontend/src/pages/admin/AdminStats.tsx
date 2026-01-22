import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import {
  getTotalUsers,
  getVerifiedUsers,
  getTotalDepots,
  getTotalDocuments
} from '@/services/admin.service';
import { BarChart3, Users, FileText, Tag, Loader2 } from "lucide-react";

function AdminStats() {
  const { data: totalUsers } = useQuery<{ totalUsers: number }>({
  queryKey: ['total-users'],
  queryFn: getTotalUsers
});

const { data: verifiedUsers } = useQuery<{ verifiedUsers: number }>({
  queryKey: ['verified-users'],
  queryFn: getVerifiedUsers
});

const { data: totalDepots } = useQuery<{ totalDepots: number }>({
  queryKey: ['total-depots'],
  queryFn: getTotalDepots
});

const { data: totalDocuments } = useQuery<{ totalDocuments: number }>({
  queryKey: ['total-documents'],
  queryFn: getTotalDocuments
});

  const isLoading = !totalUsers || !verifiedUsers || !totalDepots || !totalDocuments;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const chartData = [
    { name: 'Utilisateurs', value: totalUsers?.totalUsers || 0, color: '#8884d8' },
    { name: 'Utilisateurs Vérifiés', value: verifiedUsers?.verifiedUsers || 0, color: '#82ca9d' },
    { name: 'Dépôts', value: totalDepots?.totalDepots || 0, color: '#ffc658' },
    { name: 'Documents', value: totalDocuments?.totalDocuments || 0, color: '#ff7300' }
  ];

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {verifiedUsers?.verifiedUsers || 0} vérifiés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépôts Actifs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepots?.totalDepots || 0}</div>
            <p className="text-xs text-muted-foreground">Total des dépôts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments?.totalDocuments || 0}</div>
            <p className="text-xs text-muted-foreground">Fichiers uploadés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Vérification</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers && verifiedUsers
                ? Math.round((verifiedUsers.verifiedUsers / totalUsers.totalUsers) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Utilisateurs vérifiés</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Métriques</CardTitle>
            <CardDescription>Répartition des éléments plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { label: "Valeur" } }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Type</CardTitle>
            <CardDescription>Vue d'ensemble des contenus</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { label: "Valeur" } }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminStats;
