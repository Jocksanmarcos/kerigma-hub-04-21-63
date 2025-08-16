import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  RotateCcw, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  User,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Emprestimo {
  id: string;
  data_emprestimo: string;
  data_devolucao_prevista: string;
  data_devolucao_real?: string;
  status: string;
  observacoes?: string;
  biblioteca_livros: {
    titulo: string;
    autor: string;
    imagem_capa_url?: string;
  };
  pessoas: {
    nome_completo: string;
    email: string;
    telefone?: string;
  };
}

export const BibliotecaEmprestimos = () => {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [filteredEmprestimos, setFilteredEmprestimos] = useState<Emprestimo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchEmprestimos();
  }, []);

  useEffect(() => {
    filterEmprestimos();
  }, [emprestimos, searchTerm, statusFilter]);

  const fetchEmprestimos = async () => {
    try {
      const { data, error } = await supabase
        .from('biblioteca_emprestimos')
        .select(`
          *,
          biblioteca_livros!inner(titulo, autor, imagem_capa_url),
          pessoas!inner(nome_completo, email, telefone)
        `)
        .order('data_emprestimo', { ascending: false });

      if (error) throw error;
      setEmprestimos(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar empréstimos',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEmprestimos = () => {
    let filtered = emprestimos;

    if (searchTerm) {
      filtered = filtered.filter(emprestimo => 
        emprestimo.biblioteca_livros.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emprestimo.biblioteca_livros.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emprestimo.pessoas.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(emprestimo => emprestimo.status === statusFilter);
    }

    setFilteredEmprestimos(filtered);
  };

  const handleDevolucao = async (id: string) => {
    try {
      const { error: emprestimoError } = await supabase
        .from('biblioteca_emprestimos')
        .update({ 
          status: 'Devolvido',
          data_devolucao_real: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (emprestimoError) throw emprestimoError;

      // Atualizar status do livro para disponível
      const emprestimo = emprestimos.find(e => e.id === id);
      if (emprestimo) {
        const { error: livroError } = await supabase
          .from('biblioteca_livros')
          .update({ status: 'Disponível' })
          .eq('titulo', emprestimo.biblioteca_livros.titulo);

        if (livroError) throw livroError;
      }

      toast({
        title: 'Devolução realizada',
        description: 'O livro foi devolvido com sucesso.'
      });

      fetchEmprestimos();
    } catch (error: any) {
      toast({
        title: 'Erro na devolução',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleRenovacao = async (id: string) => {
    try {
      const emprestimo = emprestimos.find(e => e.id === id);
      if (!emprestimo) return;

      const novaDataDevolucao = new Date();
      novaDataDevolucao.setDate(novaDataDevolucao.getDate() + 15); // Renova por mais 15 dias

      const { error } = await supabase
        .from('biblioteca_emprestimos')
        .update({ 
          status: 'Renovado',
          data_devolucao_prevista: novaDataDevolucao.toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Empréstimo renovado',
        description: `Nova data de devolução: ${format(novaDataDevolucao, 'dd/MM/yyyy', { locale: ptBR })}`
      });

      fetchEmprestimos();
    } catch (error: any) {
      toast({
        title: 'Erro na renovação',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string, dataDevolucao: string) => {
    const isAtrasado = new Date(dataDevolucao) < new Date() && status === 'Ativo';
    
    const statusConfig = {
      'Ativo': { 
        variant: isAtrasado ? 'destructive' as const : 'default' as const, 
        label: isAtrasado ? 'Atrasado' : 'Ativo',
        icon: isAtrasado ? AlertTriangle : Clock
      },
      'Devolvido': { 
        variant: 'default' as const, 
        label: 'Devolvido',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800'
      },
      'Renovado': { 
        variant: 'secondary' as const, 
        label: 'Renovado',
        icon: RotateCcw
      },
      'Atrasado': { 
        variant: 'destructive' as const, 
        label: 'Atrasado',
        icon: AlertTriangle
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Ativo'];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getDiasAtrasado = (dataDevolucao: string) => {
    const hoje = new Date();
    const dataLimite = new Date(dataDevolucao);
    const diffTime = hoje.getTime() - dataLimite.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando empréstimos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Empréstimos</CardTitle>
          <CardDescription>
            Gerencie todos os empréstimos da biblioteca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por livro ou pessoa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativos</SelectItem>
                <SelectItem value="Devolvido">Devolvidos</SelectItem>
                <SelectItem value="Renovado">Renovados</SelectItem>
                <SelectItem value="Atrasado">Atrasados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livro</TableHead>
                  <TableHead>Pessoa</TableHead>
                  <TableHead>Data Empréstimo</TableHead>
                  <TableHead>Devolução Prevista</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmprestimos.map((emprestimo) => (
                  <TableRow key={emprestimo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-muted rounded-sm flex items-center justify-center overflow-hidden">
                          {emprestimo.biblioteca_livros.imagem_capa_url ? (
                            <img 
                              src={emprestimo.biblioteca_livros.imagem_capa_url} 
                              alt={emprestimo.biblioteca_livros.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{emprestimo.biblioteca_livros.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {emprestimo.biblioteca_livros.autor}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{emprestimo.pessoas.nome_completo}</p>
                          <p className="text-sm text-muted-foreground">
                            {emprestimo.pessoas.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(emprestimo.data_emprestimo), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div>
                        {format(new Date(emprestimo.data_devolucao_prevista), 'dd/MM/yyyy', { locale: ptBR })}
                        {emprestimo.status === 'Ativo' && getDiasAtrasado(emprestimo.data_devolucao_prevista) > 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            {getDiasAtrasado(emprestimo.data_devolucao_prevista)} dias de atraso
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(emprestimo.status, emprestimo.data_devolucao_prevista)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {(emprestimo.status === 'Ativo' || emprestimo.status === 'Renovado') && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRenovacao(emprestimo.id)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleDevolucao(emprestimo.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEmprestimos.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum empréstimo encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros para encontrar o que procura.'
                  : 'Ainda não há empréstimos registrados.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};