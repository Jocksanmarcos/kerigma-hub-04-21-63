import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Search, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VersiculoResultado {
  id: string;
  livro_nome: string;
  capitulo: number;
  versiculo: number;
  texto: string;
  versao_nome: string;
}

export const ConsultaRapidaBiblia: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<VersiculoResultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedTermo, setDebouncedTermo] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTermo(termo);
    }, 500);

    return () => clearTimeout(timer);
  }, [termo]);

  // Search effect
  useEffect(() => {
    if (debouncedTermo.length > 2) {
      buscarVersiculos(debouncedTermo);
    } else {
      setResultados([]);
    }
  }, [debouncedTermo]);

  const parseReferencia = (input: string) => {
    // Parse referencias como "gn 1:1", "salmos 91", "joão 3:16", etc.
    const patterns = [
      // Padrão completo: livro capitulo:versiculo
      /^(\w+)\s*(\d+):(\d+)$/i,
      // Padrão capítulo: livro capitulo
      /^(\w+)\s*(\d+)$/i,
    ];

    for (const pattern of patterns) {
      const match = input.trim().match(pattern);
      if (match) {
        return {
          livro: match[1].toLowerCase(),
          capitulo: parseInt(match[2]),
          versiculo: match[3] ? parseInt(match[3]) : null
        };
      }
    }
    return null;
  };

  const buscarVersiculos = async (busca: string) => {
    setLoading(true);
    try {
      const referencia = parseReferencia(busca);
      
      if (referencia) {
        // Busca específica por referência
        await buscarPorReferencia(referencia);
      } else {
        // Busca por texto completo
        await buscarPorTexto(busca);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({ 
        title: 'Erro na busca', 
        description: 'Não foi possível realizar a busca. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarPorReferencia = async (ref: { livro: string; capitulo: number; versiculo?: number | null }) => {
    let query = supabase
      .from('biblia_versiculos')
      .select(`
        id,
        capitulo,
        versiculo,
        texto,
        biblia_livros!inner(nome),
        biblia_versoes!inner(nome)
      `)
      .eq('capitulo', ref.capitulo);

    // Buscar livro por nome ou abreviação
    if (ref.livro) {
      query = query.or(`biblia_livros.nome.ilike.%${ref.livro}%,biblia_livros.abreviacao.ilike.%${ref.livro}%`);
    }

    if (ref.versiculo) {
      query = query.eq('versiculo', ref.versiculo);
    }

    const { data } = await query.limit(20);
    
    if (data) {
      setResultados(data.map(item => ({
        id: item.id,
        livro_nome: item.biblia_livros.nome,
        capitulo: item.capitulo,
        versiculo: item.versiculo,
        texto: item.texto,
        versao_nome: item.biblia_versoes.nome
      })));
    }
  };

  const buscarPorTexto = async (texto: string) => {
    const { data } = await supabase
      .from('biblia_versiculos')
      .select(`
        id,
        capitulo,
        versiculo,
        texto,
        biblia_livros!inner(nome),
        biblia_versoes!inner(nome)
      `)
      .textSearch('texto', texto.split(' ').join(' & '))
      .limit(15);

    if (data) {
      setResultados(data.map(item => ({
        id: item.id,
        livro_nome: item.biblia_livros.nome,
        capitulo: item.capitulo,
        versiculo: item.versiculo,
        texto: item.texto,
        versao_nome: item.biblia_versoes.nome
      })));
    }
  };

  const copiarVersiculo = (versiculo: VersiculoResultado) => {
    const texto = `${versiculo.texto} - ${versiculo.livro_nome} ${versiculo.capitulo}:${versiculo.versiculo}`;
    navigator.clipboard.writeText(texto);
    toast({ title: 'Versículo copiado!' });
  };

  const abrirBiblia = () => {
    setIsOpen(false);
    window.open('/ensino/biblia', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Bíblia</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Busca Inteligente da Bíblia
            </span>
            <Button variant="outline" size="sm" onClick={abrirBiblia}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Leitor
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite 'gn 1:1', 'salmos 91' ou busque por palavras..."
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 flex-1" />
                </div>
              ))}
            </div>
          )}

          {!loading && resultados.length > 0 && (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {resultados.map((versiculo) => (
                <div 
                  key={versiculo.id}
                  className="group flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Badge variant="outline" className="shrink-0 mt-1">
                    {versiculo.livro_nome} {versiculo.capitulo}:{versiculo.versiculo}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">{versiculo.texto}</p>
                    <p className="text-xs text-muted-foreground mt-1">{versiculo.versao_nome}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copiarVersiculo(versiculo)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && termo.length > 2 && resultados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum versículo encontrado</p>
              <p className="text-sm mt-1">Tente outras palavras-chave ou referências</p>
            </div>
          )}

          {!loading && termo.length <= 2 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Busque versículos por referência ou palavras</p>
              <div className="text-sm mt-2 space-y-1">
                <p>Exemplos: <code className="px-2 py-1 bg-muted rounded">gn 1:1</code></p>
                <p><code className="px-2 py-1 bg-muted rounded">salmos 91</code> ou <code className="px-2 py-1 bg-muted rounded">amor esperança</code></p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};