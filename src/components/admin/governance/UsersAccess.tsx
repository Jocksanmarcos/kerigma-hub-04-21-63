import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Filter, 
  UserX, 
  Shield, 
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
export const UsersAccess: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
const [filterProfile, setFilterProfile] = useState<string>('all');
const [editOpen, setEditOpen] = useState(false);
const [editingUser, setEditingUser] = useState<any | null>(null);
const [selectedProfileId, setSelectedProfileId] = useState<string | 'no-profile'>('no-profile');
const navigate = useNavigate();
const queryClient = useQueryClient();
const { toast } = useToast();

  // Query para buscar usuários com seus perfis
  const { data: users } = useQuery({
    queryKey: ['users-access', searchTerm, filterProfile],
    queryFn: async () => {
      let query = supabase
        .from('pessoas')
        .select(`
          *,
          profiles!pessoas_profile_id_fkey(name, level, description)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`nome_completo.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Query para buscar perfis para filtro
  const { data: profiles } = useQuery({
    queryKey: ['profiles-filter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('active', true)
        .order('level', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Mutação para atualizar perfil do usuário
  const updateUserProfile = useMutation({
    mutationFn: async ({ userId, profileId }: { userId: string; profileId: string | null }) => {
      const { error } = await supabase
        .from('pessoas')
        .update({ profile_id: profileId })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Perfil atualizado com sucesso' });
      queryClient.invalidateQueries({ queryKey: ['users-access'] });
      setEditOpen(false);
      setEditingUser(null);
    },
    onError: (e) => {
      toast({ title: 'Erro ao atualizar perfil', description: (e as any).message, variant: 'destructive' as any });
    }
  });

  const getProfileBadge = (profile: any) => {
    if (!profile) return <Badge variant="secondary">Sem Perfil</Badge>;
    
    const variants = {
      1: 'secondary',
      2: 'default',
      3: 'default',
      4: 'destructive',
      5: 'destructive'
    };
    
    return (
      <Badge variant={variants[profile.level as keyof typeof variants] as any}>
        {profile.name}
      </Badge>
    );
  };

  const filteredUsers = users?.filter(user => {
    if (filterProfile === 'all') return true;
    if (filterProfile === 'no-profile') return !user.profile_id;
    return user.profiles?.name === filterProfile;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Usuários & Acessos</h2>
          <p className="text-muted-foreground">Gerencie usuários, perfis e permissões individuais</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterProfile} onValueChange={setFilterProfile}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Perfis</SelectItem>
                <SelectItem value="no-profile">Sem Perfil</SelectItem>
                {profiles?.map((profile) => (
                  <SelectItem key={profile.id} value={profile.name}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers?.map((user) => (
          <Card key={user.id} className="hover:shadow-kerigma transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-kerigma-gradient rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{user.nome_completo}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getProfileBadge(user.profiles)}
                      {user.situacao === 'ativo' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Última atividade</div>
                    <div>
                      {user.updated_at ? 
                        new Date(user.updated_at).toLocaleDateString() : 
                        'Nunca'
                      }
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/pessoas/${user.id}`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingUser(user);
                        setSelectedProfileId(user.profile_id ?? 'no-profile');
                        setEditOpen(true);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: 'Assumir usuário',
                          description:
                            'Posso habilitar a funcionalidade de impersonação (assumir sessão) via Supabase. Confirme se deseja que eu implemente.',
                        })
                      }
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Assumir
                    </Button>
                  </div>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-medium">Célula:</span>
                  <span className="ml-2 text-muted-foreground">
                    {user.celula_id ? 'Sim' : 'Não definida'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Congregação:</span>
                  <span className="ml-2 text-muted-foreground">
                    {user.congregacao_id ? 'Sim' : 'Não definida'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Registro:</span>
                  <span className="ml-2 text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil do usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">{editingUser?.nome_completo}</div>
              <div className="text-xs text-muted-foreground">{editingUser?.email}</div>
            </div>
            <Select value={selectedProfileId} onValueChange={(v) => setSelectedProfileId(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-profile">Sem Perfil</SelectItem>
                {profiles?.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (editingUser) {
                  updateUserProfile.mutate({
                    userId: editingUser.id,
                    profileId: selectedProfileId === 'no-profile' ? null : (selectedProfileId as string),
                  });
                }
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{filteredUsers?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total de Usuários</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {filteredUsers?.filter(u => u.situacao === 'ativo').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Usuários Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-secondary" />
              <div>
                <div className="text-2xl font-bold">
                  {filteredUsers?.filter(u => u.profiles?.level >= 4).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Administradores</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {filteredUsers?.filter(u => !u.profile_id).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Sem Perfil</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};