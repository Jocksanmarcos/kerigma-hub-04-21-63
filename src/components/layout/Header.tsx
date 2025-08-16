import React, { useEffect, useState } from 'react';
import { Search, User } from 'lucide-react';
import { ConsultaRapidaBiblia } from '@/components/biblia/ConsultaRapidaBiblia';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { PlatformLogo } from '@/components/ui/platform-logo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ChurchSelector } from '@/components/ui/church-selector';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthed(!!session?.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setIsAuthed(!!session?.user));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Sessão encerrada' });
    navigate('/auth', { replace: true });
  };

  return (
    <header className="h-24 flex items-center justify-between border-b bg-background px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <NavLink to="/">
          <PlatformLogo className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
        </NavLink>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Desktop search */}
        <div className="hidden lg:flex">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Mobile search */}
        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
          <Search className="h-4 w-4" />
        </Button>

        {/* Church Selector */}
        {isAuthed && <ChurchSelector />}

        {/* Consulta Bíblica */}
        <ConsultaRapidaBiblia />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Ver Site quick button (visible when logado) */}
        {isAuthed && (
          <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
            <NavLink to="/">Ver Site</NavLink>
          </Button>
        )}

        {/* Notifications */}
        {isAuthed && <NotificationCenter />}

        {/* User menu */}
        {isAuthed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/')}>Ver Site</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/configuracoes')}>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <NavLink to="/auth">
            <Button size="sm" className="h-9">Entrar</Button>
          </NavLink>
        )}
      </div>
    </header>
  );
};