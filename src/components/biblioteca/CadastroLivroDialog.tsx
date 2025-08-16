import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Search, BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CadastroLivroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LivroData {
  titulo: string;
  autor: string;
  editora: string;
  isbn: string;
  ano_publicacao?: number;
  numero_paginas?: number;
  categoria: string;
  sinopse: string;
  localizacao_fisica: string;
  numero_copias: number;
  imagem_capa_url?: string;
}

export const CadastroLivroDialog: React.FC<CadastroLivroDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState<LivroData>({
    titulo: '',
    autor: '',
    editora: '',
    isbn: '',
    categoria: '',
    sinopse: '',
    localizacao_fisica: '',
    numero_copias: 1,
  });
  const [loading, setLoading] = useState(false);
  const [searchingISBN, setSearchingISBN] = useState(false);
  const { toast } = useToast();

  const categorias = [
    'Teologia',
    'Devocionais',
    'Biografia',
    'História da Igreja',
    'Família Cristã',
    'Missões',
    'Discipulado',
    'Apologética',
    'Autoajuda Cristã',
    'Infantojuvenil',
    'Romance Cristão',
    'Estudos Bíblicos',
    'Outro'
  ];

  const handleInputChange = (field: keyof LivroData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const searchByISBN = async () => {
    if (!formData.isbn) {
      toast({
        title: 'ISBN necessário',
        description: 'Digite o ISBN para busca automática',
        variant: 'destructive'
      });
      return;
    }

    setSearchingISBN(true);
    try {
      // Buscar dados do livro através da API do Google Books
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${formData.isbn}`);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        
        setFormData(prev => ({
          ...prev,
          titulo: book.title || prev.titulo,
          autor: book.authors?.join(', ') || prev.autor,
          editora: book.publisher || prev.editora,
          ano_publicacao: book.publishedDate ? parseInt(book.publishedDate.split('-')[0]) : prev.ano_publicacao,
          numero_paginas: book.pageCount || prev.numero_paginas,
          sinopse: book.description || prev.sinopse,
          imagem_capa_url: book.imageLinks?.thumbnail || prev.imagem_capa_url,
        }));

        toast({
          title: 'Dados encontrados!',
          description: 'Informações do livro preenchidas automaticamente'
        });
      } else {
        toast({
          title: 'Livro não encontrado',
          description: 'Não foi possível encontrar dados para este ISBN',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro na busca',
        description: 'Não foi possível buscar os dados do livro',
        variant: 'destructive'
      });
    } finally {
      setSearchingISBN(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.autor) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Título e autor são obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('biblioteca_livros')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Livro cadastrado',
        description: 'O livro foi adicionado ao acervo com sucesso'
      });

      // Reset form
      setFormData({
        titulo: '',
        autor: '',
        editora: '',
        isbn: '',
        categoria: '',
        sinopse: '',
        localizacao_fisica: '',
        numero_copias: 1,
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao cadastrar livro',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Livro</DialogTitle>
          <DialogDescription>
            Adicione um novo livro ao acervo da biblioteca
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Cadastro Manual</TabsTrigger>
            <TabsTrigger value="isbn">Busca por ISBN</TabsTrigger>
          </TabsList>

          <TabsContent value="isbn" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Busca Automática por ISBN
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Digite o ISBN (10 ou 13 dígitos)"
                      value={formData.isbn}
                      onChange={(e) => handleInputChange('isbn', e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={searchByISBN}
                    disabled={searchingISBN || !formData.isbn}
                  >
                    {searchingISBN ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {searchingISBN ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Digite o ISBN e clique em buscar para preencher automaticamente os dados do livro
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <p className="text-sm text-muted-foreground mb-4">
              Preencha manualmente as informações do livro
            </p>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="autor">Autor *</Label>
              <Input
                id="autor"
                value={formData.autor}
                onChange={(e) => handleInputChange('autor', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editora">Editora</Label>
              <Input
                id="editora"
                value={formData.editora}
                onChange={(e) => handleInputChange('editora', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select 
                value={formData.categoria} 
                onValueChange={(value) => handleInputChange('categoria', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização Física</Label>
              <Input
                id="localizacao"
                placeholder="Ex: Prateleira A2"
                value={formData.localizacao_fisica}
                onChange={(e) => handleInputChange('localizacao_fisica', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano">Ano de Publicação</Label>
              <Input
                id="ano"
                type="number"
                value={formData.ano_publicacao || ''}
                onChange={(e) => handleInputChange('ano_publicacao', parseInt(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="copias">Número de Cópias</Label>
              <Input
                id="copias"
                type="number"
                min="1"
                value={formData.numero_copias}
                onChange={(e) => handleInputChange('numero_copias', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sinopse">Sinopse</Label>
            <Textarea
              id="sinopse"
              placeholder="Breve descrição do livro..."
              value={formData.sinopse}
              onChange={(e) => handleInputChange('sinopse', e.target.value)}
              rows={3}
            />
          </div>

          {formData.imagem_capa_url && (
            <div className="space-y-2">
              <Label>Preview da Capa</Label>
              <div className="flex items-center gap-4">
                <img 
                  src={formData.imagem_capa_url} 
                  alt="Capa do livro"
                  className="w-20 h-28 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleInputChange('imagem_capa_url', '')}
                >
                  Remover Imagem
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <BookOpen className="h-4 w-4 mr-2" />
              )}
              Cadastrar Livro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};