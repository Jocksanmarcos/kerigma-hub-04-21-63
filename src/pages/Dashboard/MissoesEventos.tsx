import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { 
  Calendar, 
  Plus, 
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { MissoesLayout } from '@/components/missoes/MissoesLayout';
import { useChurches } from '@/hooks/useChurches';
import { useChurchContext } from '@/contexts/ChurchContext';
import { useNewUserRole } from '@/hooks/useNewRole';
import { ResponsiveDashboardGrid } from '@/components/ui/responsive-dashboard-grid';
import { DateRange } from 'react-day-picker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  local: string;
  missao: string;
  tipo: 'culto' | 'evangelismo' | 'treinamento' | 'conferencia' | 'social';
  status: 'planejado' | 'confirmado' | 'em_andamento' | 'finalizado' | 'cancelado';
  participantes: number;
  maxParticipantes?: number;
  responsavel: string;
  destaque: boolean;
}

// Mock data
const mockEventos: Evento[] = [
  {
    id: '1',
    titulo: 'Culto de Gratidão',
    descricao: 'Culto especial de gratidão pelas bênçãos do ano',
    data: '2025-01-25',
    horario: '19:00',
    local: 'Templo Principal - Gapara',
    missao: 'Missão Gapara',
    tipo: 'culto',
    status: 'confirmado',
    participantes: 45,
    maxParticipantes: 80,
    responsavel: 'Pastor Carlos',
    destaque: true
  },
  {
    id: '2',
    titulo: 'Treinamento de Líderes',
    descricao: 'Capacitação para líderes de células',
    data: '2025-01-30',
    horario: '14:00',
    local: 'Salão de Eventos - Icatu',
    missao: 'Missão Icatu',
    tipo: 'treinamento',
    status: 'planejado',
    participantes: 12,
    maxParticipantes: 25,
    responsavel: 'Líder Sandra',
    destaque: false
  },
  {
    id: '3',
    titulo: 'Evangelismo no Centro',
    descricao: 'Ação evangelística no centro da cidade',
    data: '2025-02-01',
    horario: '09:00',
    local: 'Praça Central - Vila Maranhão',
    missao: 'Missão Vila Maranhão',
    tipo: 'evangelismo',
    status: 'confirmado',
    participantes: 18,
    responsavel: 'Ev. Roberto',
    destaque: true
  },
  {
    id: '4',
    titulo: 'Conferência de Missões',
    descricao: 'Encontro anual das missões da rede',
    data: '2025-02-15',
    horario: '08:00',
    local: 'Igreja Sede - São Luís',
    missao: 'Todas as Missões',
    tipo: 'conferencia',
    status: 'planejado',
    participantes: 120,
    maxParticipantes: 200,
    responsavel: 'Pastor Principal',
    destaque: true
  }
];

const MissoesEventos: React.FC = () => {
  const { data: churches = [], isLoading } = useChurches();
  const { isSuperAdmin } = useChurchContext();
  const { data: userRole, isLoading: roleLoading } = useNewUserRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMissao, setSelectedMissao] = useState<string>('todas');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange | undefined>();

  const hasAccess = isSuperAdmin || userRole === 'pastor' || userRole === 'lider';

  if (roleLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <MissoesLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-muted-foreground">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Apenas pastores e líderes podem acessar a programação de eventos.
            </p>
          </div>
        </div>
      </MissoesLayout>
    );
  }

  const filteredEventos = mockEventos.filter(evento => {
    const matchesSearch = evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evento.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMissao = selectedMissao === 'todas' || evento.missao === selectedMissao;
    const matchesTipo = selectedTipo === 'todos' || evento.tipo === selectedTipo;
    const matchesStatus = selectedStatus === 'todos' || evento.status === selectedStatus;
    
    return matchesSearch && matchesMissao && matchesTipo && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejado': return 'bg-gray-500';
      case 'confirmado': return 'bg-blue-500';
      case 'em_andamento': return 'bg-green-500';
      case 'finalizado': return 'bg-purple-500';
      case 'cancelado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planejado': return 'Planejado';
      case 'confirmado': return 'Confirmado';
      case 'em_andamento': return 'Em Andamento';
      case 'finalizado': return 'Finalizado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'culto': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'evangelismo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'treinamento': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'conferencia': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'social': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'culto': return 'Culto';
      case 'evangelismo': return 'Evangelismo';
      case 'treinamento': return 'Treinamento';
      case 'conferencia': return 'Conferência';
      case 'social': return 'Social';
      default: return tipo;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <MissoesLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primary">Eventos & Programação</h1>
            <p className="text-muted-foreground">
              Gestão de eventos e programação das missões
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{mockEventos.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Eventos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">
                    {mockEventos.reduce((acc, evento) => acc + evento.participantes, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Participantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">
                    {mockEventos.filter(e => e.destaque).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Em Destaque</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent-foreground">
                    {mockEventos.filter(e => e.status === 'planejado').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Planejados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Título ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Missão</label>
                <Select value={selectedMissao} onValueChange={setSelectedMissao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Missão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {churches.filter(c => c.type === 'missao').map((church) => (
                      <SelectItem key={church.id} value={church.name}>
                        {church.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="culto">Culto</SelectItem>
                    <SelectItem value="evangelismo">Evangelismo</SelectItem>
                    <SelectItem value="treinamento">Treinamento</SelectItem>
                    <SelectItem value="conferencia">Conferência</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="planejado">Planejado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <DatePickerWithRange
                  selected={selectedPeriod}
                  onSelect={setSelectedPeriod}
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full gap-2">
                  <Filter className="h-4 w-4" />
                  Aplicar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Eventos */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Próximos Eventos</h2>
          <ResponsiveDashboardGrid variant="pastor">
            {filteredEventos.map((evento) => (
              <Card key={evento.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{evento.titulo}</CardTitle>
                        {evento.destaque && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTipoColor(evento.tipo)}>
                          {getTipoText(evento.tipo)}
                        </Badge>
                        <Badge className={`${getStatusColor(evento.status)} text-white`}>
                          {getStatusText(evento.status)}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {evento.descricao}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(evento.data)} às {evento.horario}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{evento.local}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {evento.participantes} participantes
                        {evento.maxParticipantes && ` / ${evento.maxParticipantes}`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Responsável: {evento.responsavel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {evento.missao}
                    </p>
                  </div>

                  {evento.maxParticipantes && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Ocupação</span>
                        <span>{Math.round((evento.participantes / evento.maxParticipantes) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{
                            width: `${Math.min((evento.participantes / evento.maxParticipantes) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ResponsiveDashboardGrid>
        </div>

        {/* Empty State */}
        {filteredEventos.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-muted-foreground">Nenhum evento encontrado</h3>
              <p className="text-muted-foreground">
                Não há eventos que correspondam aos filtros selecionados.
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeiro Evento
            </Button>
          </div>
        )}
      </div>
    </MissoesLayout>
  );
};

export default MissoesEventos;