import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Eye, Settings } from 'lucide-react';
import { SecurityDashboard } from './SecurityDashboard';
import { ProfilesPermissions } from './ProfilesPermissions';
import { UsersAccess } from './UsersAccess';
import { AuditTrail } from './AuditTrail';

export const GovernanceCenter: React.FC = () => {
  return (
    <div className="space-y-6">

      {/* Tabs Interface */}
      <Tabs defaultValue="dashboard" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-surface-blue shadow-kerigma-md">
          <TabsTrigger value="dashboard" className="flex items-center space-x-3 px-6 py-4">
            <Eye className="h-5 w-5" />
            <span className="font-semibold">Dashboard de Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center space-x-3 px-6 py-4">
            <Settings className="h-5 w-5" />
            <span className="font-semibold">Perfis & Permissões</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-3 px-6 py-4">
            <Users className="h-5 w-5" />
            <span className="font-semibold">Usuários & Acessos</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-3 px-6 py-4">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Trilha de Auditoria</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          <ProfilesPermissions />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UsersAccess />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditTrail />
        </TabsContent>
      </Tabs>
    </div>
  );
};