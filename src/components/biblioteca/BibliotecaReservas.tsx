import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  CheckCircle, 
  X,
  Clock,
  User,
  BookOpen,
  AlertCircle
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

interface Reserva {
  id: string;
  data_reserva: string;
  data_expiracao: string;
  status: string;
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

export const BibliotecaReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchReservas();
  }, []);

  useEffect(() => {
    filterReservas();
  }, [reservas, searchTerm, statusFilter]);

  const fetchReservas = async () => {
    try {
      const { data, error } = await supabase
        .from('biblioteca_reservas')
        .select(`
          *,
          biblioteca_livros!inner(titulo, autor, imagem_capa_url),
          pessoas!inner(nome_completo, email, telefone)
        `)
        .order('data_reserva', { ascending: false });

      if (error) throw error;
      setReservas(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar reservas',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterReservas = () => {
    let filtered = reservas;

    if (searchTerm) {
      filtered = filtered.filter(reserva => 
        reserva.biblioteca_livros.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.biblioteca_livros.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.pessoas.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(reserva => reserva.status === statusFilter);
    }

    setFilteredReservas(filtered);
  };

  const handleAtender = async (id: string) => {
    try {
      // Atualizar reserva para atendida
      const { error: reservaError } = await supabase
        .from('biblioteca_reservas')
        .update({ status: 'Atendida' })
        .eq('id', id);

      if (reservaError) throw reservaError;

      // Aqui deveria criar automaticamente um empréstimo
      // Para simplificar, vamos apenas mostrar uma mensagem
      toast({
        title: 'Reserva atendida',
        description: 'A reserva foi marcada como atendida. Proceda com o empréstimo do livro.'
      });

      fetchReservas();
    } catch (error: any) {
      toast({
        title: 'Erro ao atender reserva',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleCancelar = async (id: string) => {
    try {
      const { error } = await supabase
        .from('biblioteca_reservas')
        .update({ status: 'Cancelada' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Reserva cancelada',
        description: 'A reserva foi cancelada com sucesso.'
      });

      fetchReservas();
    } catch (error: any) {
      toast({
        title: 'Erro ao cancelar reserva',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string, dataExpiracao: string) => {
    const isExpirada = new Date(dataExpiracao) < new Date() && status === 'Ativa';
    
    const statusConfig = {
      'Ativa': { 
        variant: isExpirada ? 'destructive' as const : 'default' as const, 
        label: isExpirada ? 'Expirada' : 'Ativa',
        icon: isExpirada ? AlertCircle : Clock,
        color: isExpirada ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      },
      'Atendida': { 
        variant: 'default' as const, 
        label: 'Atendida',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800'
      },
      'Cancelada': { 
        variant: 'secondary' as const, 
        label: 'Cancelada',
        icon: X,
        color: 'bg-gray-100 text-gray-800'
      },
      'Expirada': { 
        variant: 'destructive' as const, 
        label: 'Expirada',
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Ativa'];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getDiasParaExpiracao = (dataExpiracao: string) => {
    const hoje = new Date();
    const dataLimite = new Date(dataExpiracao);
    const diffTime = dataLimite.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando reservas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Reservas</CardTitle>
          <CardDescription>
            Gerencie todas as reservas de livros da biblioteca
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
                <SelectItem value="Ativa">Ativas</SelectItem>
                <SelectItem value="Atendida">Atendidas</SelectItem>
                <SelectItem value="Cancelada">Canceladas</SelectItem>
                <SelectItem value="Expirada">Expiradas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livro</TableHead>
                  <TableHead>Pessoa</TableHead>
                  <TableHead>Data Reserva</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-muted rounded-sm flex items-center justify-center overflow-hidden">
                          {reserva.biblioteca_livros.imagem_capa_url ? (
                            <img 
                              src={reserva.biblioteca_livros.imagem_capa_url} 
                              alt={reserva.biblioteca_livros.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{reserva.biblioteca_livros.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {reserva.biblioteca_livros.autor}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{reserva.pessoas.nome_completo}</p>
                          <p className="text-sm text-muted-foreground">
                            {reserva.pessoas.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(reserva.data_reserva), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div>
                        {format(new Date(reserva.data_expiracao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        {reserva.status === 'Ativa' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {getDiasParaExpiracao(reserva.data_expiracao) > 0 
                              ? `${getDiasParaExpiracao(reserva.data_expiracao)} dias restantes`
                              : 'Expirada'
                            }
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(reserva.status, reserva.data_expiracao)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {reserva.status === 'Ativa' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleAtender(reserva.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelar(reserva.id)}
                            >
                              <X className="h-4 w-4" />
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

          {filteredReservas.length === 0 && (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma reserva encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros para encontrar o que procura.'
                  : 'Ainda não há reservas registradas.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};