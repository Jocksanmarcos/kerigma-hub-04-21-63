import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Play,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';
import { usePastoralAI } from '@/hooks/usePastoralAI';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const IADashboard: React.FC = () => {
  const { runInactivityDetection, isRunningDetection } = usePastoralAI();

  // Buscar estatísticas para o dashboard de IA
  const { data: aiStats } = useQuery({
    queryKey: ['ai-stats'],
    queryFn: async () => {
      const [
        { data: pessoasInativas },
        { data: visitantesFrequentes },
        { data: tarefasPendentes }
      ] = await Promise.all([
        supabase
          .from('pessoas')
          .select('id, nome_completo')
          .ilike('observacoes', '%#INATIVO%')
          .eq('situacao', 'ativo'),
        
        supabase
          .from('pessoas')
          .select('id, nome_completo, created_at')
          .eq('tipo_pessoa', 'visitante')
          .eq('situacao', 'ativo'),
        
        supabase
          .from('agendamentos_pastorais')
          .select('id, motivo_contato, status')
          .in('status', ['solicitado', 'agendado'])
      ]);

      // Calcular visitantes há mais de 3 semanas
      const visitantesParaIntegracao = visitantesFrequentes?.filter(v => {
        const diasComoVisitante = Math.floor((new Date().getTime() - new Date(v.created_at).getTime()) / (1000 * 60 * 60 * 24));
        return diasComoVisitante >= 21;
      }) || [];

      return {
        pessoasDetectadasInativas: pessoasInativas?.length || 0,
        visitantesParaIntegracao: visitantesParaIntegracao.length,
        tarefasPendentes: tarefasPendentes?.length || 0,
        ultimaExecucao: localStorage.getItem('ultima-execucao-ia') || null
      };
    },
    refetchInterval: 60000 // Atualizar a cada minuto
  });

  const handleRunAI = async () => {
    await runInactivityDetection.mutateAsync();
    localStorage.setItem('ultima-execucao-ia', new Date().toISOString());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>IA Pastoral</span>
          </h2>
          <p className="text-muted-foreground">
            Inteligência artificial para cuidado e acompanhamento pastoral
          </p>
        </div>
        <Button 
          onClick={handleRunAI}
          disabled={isRunningDetection}
          className="bg-kerigma-gradient"
        >
          {isRunningDetection ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Executar IA
            </>
          )}
        </Button>
      </div>

      {/* Estatísticas da IA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pessoas Inativas Detectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-yellow-600">
                {aiStats?.pessoasDetectadasInativas || 0}
              </div>
              <Badge variant="outline" className="text-yellow-600">
                Requer atenção
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Marcadas automaticamente pela IA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visitantes para Integração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">
                {aiStats?.visitantesParaIntegracao || 0}
              </div>
              <Badge variant="outline" className="text-blue-600">
                Oportunidade
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Visitantes há +3 semanas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">
                {aiStats?.tarefasPendentes || 0}
              </div>
              <Badge variant="outline" className="text-green-600">
                Geradas por IA
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Aguardando ação pastoral
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status da Última Execução */}
      {aiStats?.ultimaExecucao && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Última execução da IA: {new Date(aiStats.ultimaExecucao).toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      {/* Motores de IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Motor de Detecção de Inatividade</span>
            </CardTitle>
            <CardDescription>
              Identifica automaticamente membros com baixa participação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Como funciona:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Analisa atividade dos últimos 30 dias</li>
                <li>• Marca pessoas sem atividade como #INATIVO</li>
                <li>• Notifica líderes de célula automaticamente</li>
                <li>• Cria tarefas de acompanhamento pastoral</li>
              </ul>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <Badge variant="outline">Ativo</Badge>
              <span className="text-sm text-muted-foreground">
                Execução automática diária
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Motor de Acompanhamento de Visitantes</span>
            </CardTitle>
            <CardDescription>
              Identifica visitantes prontos para integração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Como funciona:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Monitora tempo como visitante</li>
                <li>• Detecta frequência de participação</li>
                <li>• Identifica potencial para conversão</li>
                <li>• Alerta equipe de integração</li>
              </ul>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <Badge variant="outline">Ativo</Badge>
              <span className="text-sm text-muted-foreground">
                Execução contínua
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Configurações de Execução</span>
          </CardTitle>
          <CardDescription>
            Configure quando e como a IA deve executar suas análises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Execução Automática</h4>
              <p className="text-sm text-muted-foreground">
                A IA executa automaticamente todos os dias às 06:00 para detectar 
                pessoas inativas e visitantes frequentes.
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Configurado via Cron Job
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Execução Manual</h4>
              <p className="text-sm text-muted-foreground">
                Você pode executar a IA manualmente a qualquer momento usando o 
                botão "Executar IA" no topo desta página.
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Disponível 24/7
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};