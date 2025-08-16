import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  UserPlus,
  Crown,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Shield
} from 'lucide-react';
import { MissoesLayout } from '@/components/missoes/MissoesLayout';
import { useChurches } from '@/hooks/useChurches';
import { useChurchContext } from '@/contexts/ChurchContext';
import { useNewUserRole } from '@/hooks/useNewRole';
import { ResponsiveDashboardGrid } from '@/components/ui/responsive-dashboard-grid';

interface Pessoa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  missao: string;
  cargo: string;
  status: 'ativo' | 'inativo' | 'visitante';
  dataIngresso: string;
  avatar?: string;
}

interface Lider {
  id: string;
  nome: string;
  missao: string;
  cargo: string;
  telefone: string;
  email: string;
  experiencia: string;
  especializacao: string[];
  status: 'ativo' | 'licenca' | 'formacao';
}

// Mock data
const mockPessoas: Pessoa[] = [
  {
    id: '1',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(98) 99999-1111',
    missao: 'Missão Gapara',
    cargo: 'Membro',
    status: 'ativo',
    dataIngresso: '15/03/2024'
  },
  {
    id: '2',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(98) 99999-2222',
    missao: 'Missão Icatu',
    cargo: 'Líder de Célula',
    status: 'ativo',
    dataIngresso: '22/01/2024'
  },
  {
    id: '3',
    nome: 'Ana Costa',
    email: 'ana@email.com',
    telefone: '(98) 99999-3333',
    missao: 'Missão Vila Maranhão',
    cargo: 'Visitante',
    status: 'visitante',
    dataIngresso: '10/01/2025'
  }
];

const mockLideres: Lider[] = [
  {
    id: '1',
    nome: 'Pastor Carlos Eduardo',
    missao: 'Missão Gapara',
    cargo: 'Pastor Principal',
    telefone: '(98) 99999-0001',
    email: 'carlos@cbnkerigma.com',
    experiencia: '8 anos',
    especializacao: ['Plantação de Igrejas', 'Discipulado', 'Evangelismo'],
    status: 'ativo'
  },
  {
    id: '2',
    nome: 'Líder Sandra Oliveira',
    missao: 'Missão Icatu',
    cargo: 'Líder de Missão',
    telefone: '(98) 99999-0002',
    email: 'sandra@cbnkerigma.com',
    experiencia: '5 anos',
    especializacao: ['Ministério Infantil', 'Discipulado Feminino'],
    status: 'ativo'
  },
  {
    id: '3',
    nome: 'Ev. Roberto Lima',
    missao: 'Missão Vila Maranhão',
    cargo: 'Evangelista',
    telefone: '(98) 99999-0003',
    email: 'roberto@cbnkerigma.com',
    experiencia: '3 anos',
    especializacao: ['Evangelismo Urbano', 'Plantação de Células'],
    status: 'formacao'
  }
];

const MissoesPessoas: React.FC = () => {
  const { data: churches = [], isLoading } = useChurches();
  const { isSuperAdmin } = useChurchContext();
  const { data: userRole, isLoading: roleLoading } = useNewUserRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMissao, setSelectedMissao] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState<'pessoas' | 'lideres'>('pessoas');

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
              Apenas pastores e líderes podem acessar o gerenciamento de pessoas.
            </p>
          </div>
        </div>
      </MissoesLayout>
    );
  }

  const filteredPessoas = mockPessoas.filter(pessoa => {
    const matchesSearch = pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pessoa.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMissao = selectedMissao === 'todas' || pessoa.missao === selectedMissao;
    const matchesStatus = selectedStatus === 'todos' || pessoa.status === selectedStatus;
    
    return matchesSearch && matchesMissao && matchesStatus;
  });

  const filteredLideres = mockLideres.filter(lider => {
    const matchesSearch = lider.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMissao = selectedMissao === 'todas' || lider.missao === selectedMissao;
    
    return matchesSearch && matchesMissao;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500';
      case 'inativo': return 'bg-red-500';
      case 'visitante': return 'bg-blue-500';
      case 'licenca': return 'bg-yellow-500';
      case 'formacao': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'inativo': return 'Inativo';
      case 'visitante': return 'Visitante';
      case 'licenca': return 'Licença';
      case 'formacao': return 'Formação';
      default: return status;
    }
  };

  return (
    <MissoesLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primary">Pessoas & Líderes</h1>
            <p className="text-muted-foreground">
              Gerenciamento de pessoas e liderança nas missões
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Pessoa
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{mockPessoas.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Pessoas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{mockLideres.length}</p>
                  <p className="text-sm text-muted-foreground">Líderes Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">
                    {mockPessoas.filter(p => p.status === 'visitante').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Visitantes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent-foreground">12</p>
                  <p className="text-sm text-muted-foreground">Novos Este Mês</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome ou email..."
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
                    <SelectValue placeholder="Selecione a missão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Missões</SelectItem>
                    {churches.filter(c => c.type === 'missao').map((church) => (
                      <SelectItem key={church.id} value={church.name}>
                        {church.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="visitante">Visitante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full gap-2">
                  <Filter className="h-4 w-4" />
                  Aplicar Filtros
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
              <Button
                variant={activeTab === 'pessoas' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('pessoas')}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Pessoas ({filteredPessoas.length})
              </Button>
              <Button
                variant={activeTab === 'lideres' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('lideres')}
                className="gap-2"
              >
                <Crown className="h-4 w-4" />
                Líderes ({filteredLideres.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Pessoas */}
        {activeTab === 'pessoas' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Lista de Pessoas</h2>
            <ResponsiveDashboardGrid variant="pastor">
              {filteredPessoas.map((pessoa) => (
                <Card key={pessoa.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{pessoa.nome}</CardTitle>
                          <p className="text-sm text-muted-foreground">{pessoa.cargo}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(pessoa.status)} text-white`}>
                        {getStatusText(pessoa.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{pessoa.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{pessoa.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{pessoa.missao}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Ingressou em {pessoa.dataIngresso}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Contatar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ResponsiveDashboardGrid>
          </div>
        )}

        {/* Lista de Líderes */}
        {activeTab === 'lideres' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Lista de Líderes</h2>
            <ResponsiveDashboardGrid variant="pastor">
              {filteredLideres.map((lider) => (
                <Card key={lider.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                          <Crown className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{lider.nome}</CardTitle>
                          <p className="text-sm text-muted-foreground">{lider.cargo}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(lider.status)} text-white`}>
                        {getStatusText(lider.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{lider.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{lider.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{lider.missao}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        <span>Experiência: {lider.experiencia}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Especializações:</p>
                      <div className="flex flex-wrap gap-1">
                        {lider.especializacao.map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Contatar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ResponsiveDashboardGrid>
          </div>
        )}
      </div>
    </MissoesLayout>
  );
};

export default MissoesPessoas;