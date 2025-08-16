import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Edit, 
  Trash2, 
  QrCode, 
  BookOpen,
  Filter,
  Plus
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

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  editora: string;
  isbn: string;
  categoria: string;
  localizacao_fisica: string;
  status: string;
  imagem_capa_url?: string;
  ano_publicacao?: number;
  numero_copias: number;
}

export const BibliotecaLivros = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [filteredLivros, setFilteredLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoriaFilter, setCategoriaFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchLivros();
  }, []);

  useEffect(() => {
    filterLivros();
  }, [livros, searchTerm, statusFilter, categoriaFilter]);

  const fetchLivros = async () => {
    try {
      const { data, error } = await supabase
        .from('biblioteca_livros')
        .select('*')
        .eq('ativo', true)
        .order('titulo');

      if (error) throw error;
      setLivros(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar livros',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterLivros = () => {
    let filtered = livros;

    if (searchTerm) {
      filtered = filtered.filter(livro => 
        livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livro.isbn?.includes(searchTerm) ||
        livro.editora?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(livro => livro.status === statusFilter);
    }

    if (categoriaFilter !== 'all') {
      filtered = filtered.filter(livro => livro.categoria === categoriaFilter);
    }

    setFilteredLivros(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este livro?')) return;

    try {
      const { error } = await supabase
        .from('biblioteca_livros')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Livro excluído',
        description: 'O livro foi removido do acervo com sucesso.'
      });

      fetchLivros();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir livro',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Disponível': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      'Emprestado': { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      'Reservado': { variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' },
      'Em Manutenção': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Disponível'];
    
    return (
      <Badge className={config.color}>
        {status}
      </Badge>
    );
  };

  const categorias = [...new Set(livros.map(l => l.categoria).filter(Boolean))];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando acervo...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Acervo da Biblioteca</CardTitle>
          <CardDescription>
            Gerencie todos os livros da biblioteca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, autor, ISBN ou editora..."
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
                <SelectItem value="Disponível">Disponível</SelectItem>
                <SelectItem value="Emprestado">Emprestado</SelectItem>
                <SelectItem value="Reservado">Reservado</SelectItem>
                <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livro</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cópias</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLivros.map((livro) => (
                  <TableRow key={livro.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-muted rounded-sm flex items-center justify-center overflow-hidden">
                          {livro.imagem_capa_url ? (
                            <img 
                              src={livro.imagem_capa_url} 
                              alt={livro.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{livro.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {livro.editora} • {livro.ano_publicacao}
                          </p>
                          {livro.isbn && (
                            <p className="text-xs text-muted-foreground">
                              ISBN: {livro.isbn}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{livro.autor}</TableCell>
                    <TableCell>
                      {livro.categoria && (
                        <Badge variant="outline">{livro.categoria}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{livro.localizacao_fisica}</TableCell>
                    <TableCell>{getStatusBadge(livro.status)}</TableCell>
                    <TableCell>{livro.numero_copias}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implementar geração de QR Code
                            toast({
                              title: 'QR Code',
                              description: 'Funcionalidade em desenvolvimento'
                            });
                          }}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implementar edição
                            toast({
                              title: 'Editar',
                              description: 'Funcionalidade em desenvolvimento'
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(livro.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLivros.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum livro encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || categoriaFilter !== 'all'
                  ? 'Tente ajustar os filtros para encontrar o que procura.'
                  : 'Comece cadastrando o primeiro livro do acervo.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};