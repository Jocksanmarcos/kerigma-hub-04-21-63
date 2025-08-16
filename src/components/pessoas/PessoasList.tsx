import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Users,
  UserPlus,
  Crown,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PessoaDialog } from './PessoaDialog';
import { ExportButton } from './ExportButton';
import { PessoasListSkeleton } from './PessoasListSkeleton';
import { useFilters } from '@/hooks/useFilters';
import { PessoasFiltersBar } from './PessoasFiltersBar';

export const PessoasList: React.FC = () => {
  const { filters, setFilter, debouncedFilters, clearFilters } = useFilters({
    search: '',
    status_eclesiastico: '',
    nivel_jornada: '',
    discipulador_id: '',
    tags: [] as string[],
  });
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<any>(null);

  const { data: pessoas, isLoading } = useQuery<any>({
    queryKey: ['pessoas', JSON.stringify(debouncedFilters)],
    queryFn: async () => {
      let query: any = (supabase as any)
        .from('pessoas')
        .select(`
          *,
          profiles!pessoas_profile_id_fkey(name, level, description),
          celulas!pessoas_celula_id_fkey(nome)
        `)
        .order('created_at', { ascending: false });

      const f: any = debouncedFilters;
      if (f.search) {
        query = query.or(`nome_completo.ilike.%${f.search}%,email.ilike.%${f.search}%`);
      }
      if (f.status_eclesiastico) {
        query = query.eq('status_eclesiastico', f.status_eclesiastico);
      }
      if (f.nivel_jornada) {
        query = query.eq('nivel_jornada', f.nivel_jornada);
      }
      if (f.discipulador_id) {
        query = query.eq('discipulador_id', f.discipulador_id);
      }
      if (Array.isArray(f.tags) && f.tags.length > 0) {
        query = (query as any).overlaps('tags', f.tags);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const getStatusIcon = (situacao: string) => {
    switch (situacao) {
      case 'ativo': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inativo': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'afastado': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'membro': return <Users className="h-4 w-4 text-blue-600" />;
      case 'visitante': return <UserPlus className="h-4 w-4 text-purple-600" />;
      case 'lider': return <Crown className="h-4 w-4 text-amber-600" />;
      default: return <Users className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const variants = {
      membro: 'default',
      visitante: 'secondary', 
      lider: 'destructive'
    };
    return variants[tipo as keyof typeof variants] || 'outline';
  };

  const estatisticas = pessoas ? {
    total: pessoas.length,
    ativos: pessoas.filter(p => p.situacao === 'ativo').length,
    membros: pessoas.filter(p => p.tipo_pessoa === 'membro').length,
    visitantes: pessoas.filter(p => p.tipo_pessoa === 'visitante').length,
    lideres: pessoas.filter(p => p.tipo_pessoa === 'lider').length,
  } : null;

  if (isLoading) {
    return <PessoasListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Rápidas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{estatisticas.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{estatisticas.ativos}</div>
                  <div className="text-sm text-muted-foreground">Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{estatisticas.membros}</div>
                  <div className="text-sm text-muted-foreground">Membros</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{estatisticas.visitantes}</div>
                  <div className="text-sm text-muted-foreground">Visitantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-amber-600" />
                <div>
                  <div className="text-2xl font-bold">{estatisticas.lideres}</div>
                  <div className="text-sm text-muted-foreground">Líderes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros de Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PessoasFiltersBar
            values={filters as any}
            onChange={(k, v) => setFilter(k as any, v)}
            onClear={clearFilters}
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={() => { setSelectedPessoa(null); setShowDialog(true); }} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Adicionar Pessoa</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pessoas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lista de Pessoas</CardTitle>
              <CardDescription>
                Gerencie informações de membros, visitantes e líderes
              </CardDescription>
            </div>
            <ExportButton 
              searchTerm={(filters as any).search || ''}
              statusFilter={'todos'}
              tipoFilter={'todos'}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PessoasListSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Perfil de Acesso</TableHead>
                  <TableHead>Célula</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pessoas?.map((pessoa) => (
                  <TableRow key={pessoa.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{pessoa.nome_completo}</span>
                        <span className="text-sm text-muted-foreground">{pessoa.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTipoIcon(pessoa.tipo_pessoa)}
                        <Badge variant={getTipoBadge(pessoa.tipo_pessoa) as any}>
                          {pessoa.tipo_pessoa}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(pessoa.situacao)}
                        <span className="capitalize">{pessoa.situacao}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {pessoa.profiles ? (
                        <Badge variant="outline">
                          {pessoa.profiles.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Não definido</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {pessoa.celulas?.nome || (
                        <span className="text-muted-foreground text-sm">Sem célula</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/dashboard/pessoas/${pessoa.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedPessoa(pessoa);
                          setShowDialog(true);
                        }}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PessoaDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
        pessoa={selectedPessoa}
        onSuccess={() => {
          setShowDialog(false);
          setSelectedPessoa(null);
        }}
      />
    </div>
  );
};