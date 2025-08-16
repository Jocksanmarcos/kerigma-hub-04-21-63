import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  GraduationCap,
  Calendar,
  Music,
  Ticket,
  Landmark,
  Briefcase,
  ShieldCheck,
  Settings,
  HeartHandshake,
  Layers,
  BarChart3,
  Brain,
  MessageSquare,
  BookOpen,
  ClipboardList,
  Globe,
} from 'lucide-react';
import { useNewUserRole, newRolePermissions, UserRole } from '@/hooks/useNewRole';
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

// Principal
const principalNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home, page: 'dashboard' },
];

// Gestão
const gestaoNavItems = [
  { title: 'Pessoas', url: '/dashboard/pessoas', icon: Users, page: 'pessoas' },
  { title: 'Financeiro', url: '/dashboard/financeiro', icon: Landmark, page: 'financeiro' },
  { title: 'Ensino', url: '/ensino', icon: GraduationCap, page: 'ensino' },
  { title: 'Agenda', url: '/dashboard/agenda', icon: Calendar, page: 'agenda' },
  { title: 'Eventos', url: '/dashboard/eventos', icon: Ticket, page: 'eventos' },
  { title: 'Patrimônio', url: '/dashboard/patrimonio', icon: Briefcase, page: 'patrimonio' },
  { title: 'Ministérios', url: '/dashboard/ministerios', icon: Music, page: 'ministerios' },
  { title: 'Biblioteca', url: '/dashboard/biblioteca', icon: BookOpen, page: 'biblioteca' },
  { title: 'Células', url: '/dashboard/celulas', icon: HeartHandshake, page: 'celulas' },
  { title: 'Missões', url: '/dashboard/missoes', icon: Globe, page: 'missoes', roles: ['pastor', 'lider'] },
  { title: 'Aconselhamento', url: '/dashboard/aconselhamento', icon: MessageSquare, page: 'aconselhamento', roles: ['pastor'] },
];

// Relatórios
const relatoriosNavItems = [
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3, page: 'analytics', roles: ['pastor', 'lider'] },
];

// Administração
const adminNavItems = [
  { title: 'Configurações', url: '/admin/configuracoes', icon: Settings, page: 'configuracoes', roles: ['pastor', 'lider'] },
  { title: 'Sistema', url: '/admin/governanca', icon: ShieldCheck, page: 'sistema', roles: ['pastor'] },
];

export const Sidebar: React.FC = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { data: userRole } = useNewUserRole();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  // Filter items based on user role
  const filteredPrincipalItems = principalNavItems;
  
  const filteredGestaoItems = gestaoNavItems.filter(item => {
    if (item.roles && item.roles.length > 0 && userRole && !item.roles.includes(userRole)) {
      return false;
    }
    return true;
  });
  
  const filteredRelatoriosItems = relatoriosNavItems.filter(item => {
    if (item.roles && item.roles.length > 0 && userRole && !item.roles.includes(userRole)) {
      return false;
    }
    return true;
  });

  const filteredAdminItems = adminNavItems.filter(item => {
    if (item.roles && item.roles.length > 0 && userRole && !item.roles.includes(userRole)) {
      return false;
    }
    return true;
  });

  return (
    <SidebarUI className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent className="bg-card border-r">
        
        {/* Principal */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
              Principal
            </SidebarGroupLabel>
          )}
          
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredPrincipalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClass(item.url)}`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Gestão */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
              Gestão
            </SidebarGroupLabel>
          )}
          
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredGestaoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClass(item.url)}`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Relatórios */}
        {filteredRelatoriosItems.length > 0 && (
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                Relatórios
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredRelatoriosItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClass(item.url)}`}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Administração */}
        {filteredAdminItems.length > 0 && (
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                Administração
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClass(item.url)}`}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </SidebarUI>
  );
};