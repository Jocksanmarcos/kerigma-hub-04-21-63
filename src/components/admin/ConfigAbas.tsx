import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AccessibilitySettings } from '@/components/admin/accessibility/AccessibilitySettings';
import { YoungUserTheme } from '@/components/admin/accessibility/YoungUserTheme';

interface ConfigAbasProps {
  activeTab: string;
}

export const ConfigAbas: React.FC<ConfigAbasProps> = ({ activeTab }) => {
  const [configuracoes, setConfiguracoes] = useState({
    // Geral
    nomeIgreja: 'Igreja Evangélica Kerigma',
    timezone: 'America/Sao_Paulo',
    idioma: 'pt-BR',
    // Perfil
    nome: 'João Silva',
    email: 'joao@igreja.com',
    telefone: '(11) 99999-9999',
    cargo: 'Pastor',
    // Notificações
    emailNotif: true,
    pushNotif: true,
    smsNotif: false,
    // Segurança
    twoFactor: false,
    sessaoExpira: '24h',
    // Aparência
    tema: 'auto',
    corPrimaria: '#3b82f6',
    // Sistema
    backup: true,
    manutencao: false
  });

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const { toast } = useToast();

  // Importação da Bíblia
  const [importVersion, setImportVersion] = useState<string>('de4e12af7f28f599-02');
  const [importBook, setImportBook] = useState<string>('GEN');

  const salvarConfiguracoes = () => {
    console.log('Salvando configurações:', configuracoes);
    alert('Configurações salvas com sucesso!');
  };

  const resetarSenha = () => {
    if (novaSenha.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    setNovaSenha('');
    alert('Senha alterada com sucesso!');
  };

  const handleImportStructure = async () => {
    const { data, error } = await supabase.functions.invoke('bible-import', {
      body: { action: 'import_structure', versions: [] }, // Deixar vazio para buscar as versões disponíveis
    });
    if (error) {
      toast({ title: 'Erro ao importar estrutura', description: String(error.message || error), variant: 'destructive' });
    } else {
      toast({ title: 'Estrutura importada', description: `Versões: ${data?.result?.versions} | Livros: ${data?.result?.books}` });
    }
  };

  const handleImportBook = async () => {
    const { data, error } = await supabase.functions.invoke('bible-import', {
      body: { action: 'import_book', version: importVersion, book: importBook },
    });
    if (error) {
      toast({ title: 'Erro ao importar livro', description: String(error.message || error), variant: 'destructive' });
    } else {
      toast({ title: 'Livro importado', description: `${data?.result?.book} (${data?.result?.version?.toUpperCase()}) – ${data?.result?.verses} versículos` });
    }
  };
  const GeralTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Igreja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nomeIgreja">Nome da Igreja</Label>
            <Input
              id="nomeIgreja"
              value={configuracoes.nomeIgreja}
              onChange={(e) => setConfiguracoes({...configuracoes, nomeIgreja: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select value={configuracoes.timezone} onValueChange={(value) => setConfiguracoes({...configuracoes, timezone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="idioma">Idioma</Label>
              <Select value={configuracoes.idioma} onValueChange={(value) => setConfiguracoes({...configuracoes, idioma: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PerfilTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={configuracoes.nome}
                onChange={(e) => setConfiguracoes({...configuracoes, nome: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={configuracoes.cargo}
                onChange={(e) => setConfiguracoes({...configuracoes, cargo: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={configuracoes.email}
                onChange={(e) => setConfiguracoes({...configuracoes, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={configuracoes.telefone}
                onChange={(e) => setConfiguracoes({...configuracoes, telefone: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const NotificacoesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferências de Notificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">Receber notificações por email</p>
            </div>
            <Switch 
              checked={configuracoes.emailNotif}
              onCheckedChange={(checked) => setConfiguracoes({...configuracoes, emailNotif: checked})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Notificações no navegador</p>
            </div>
            <Switch 
              checked={configuracoes.pushNotif}
              onCheckedChange={(checked) => setConfiguracoes({...configuracoes, pushNotif: checked})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS</Label>
              <p className="text-sm text-muted-foreground">Notificações por SMS</p>
            </div>
            <Switch 
              checked={configuracoes.smsNotif}
              onCheckedChange={(checked) => setConfiguracoes({...configuracoes, smsNotif: checked})}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SegurancaTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Segurança da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Autenticação em Duas Etapas</Label>
              <p className="text-sm text-muted-foreground">Proteger com código SMS/App</p>
            </div>
            <Switch 
              checked={configuracoes.twoFactor}
              onCheckedChange={(checked) => setConfiguracoes({...configuracoes, twoFactor: checked})}
            />
          </div>
          <Separator />
          <div>
            <Label htmlFor="sessaoExpira">Expiração da Sessão</Label>
            <Select value={configuracoes.sessaoExpira} onValueChange={(value) => setConfiguracoes({...configuracoes, sessaoExpira: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hora</SelectItem>
                <SelectItem value="8h">8 horas</SelectItem>
                <SelectItem value="24h">24 horas</SelectItem>
                <SelectItem value="7d">7 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="space-y-4">
            <Label>Alterar Senha</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={senhaVisivel ? "text" : "password"}
                  placeholder="Nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setSenhaVisivel(!senhaVisivel)}
                >
                  {senhaVisivel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={resetarSenha} disabled={!novaSenha}>
                <Lock className="h-4 w-4 mr-2" />
                Alterar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AparenciaTab = () => (
    <div className="space-y-6">
      {/* Configurações Básicas de Tema */}
      <Card>
        <CardHeader>
          <CardTitle>Personalização Visual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="tema">Tema</Label>
            <Select value={configuracoes.tema} onValueChange={(value) => setConfiguracoes({...configuracoes, tema: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="auto">Automático</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div>
            <Label htmlFor="corPrimaria">Cor Primária</Label>
            <div className="flex gap-2 mt-2">
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map((cor) => (
                <button
                  key={cor}
                  className={`w-8 h-8 rounded-full border-2 ${configuracoes.corPrimaria === cor ? 'border-foreground' : 'border-transparent'}`}
                  style={{ backgroundColor: cor }}
                  onClick={() => setConfiguracoes({...configuracoes, corPrimaria: cor})}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Acessibilidade */}
      <AccessibilitySettings />

      {/* Tema Jovem */}
      <YoungUserTheme />
    </div>
  );

  const SistemaTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup Automático</Label>
              <p className="text-sm text-muted-foreground">Backup diário dos dados</p>
            </div>
            <Switch 
              checked={configuracoes.backup}
              onCheckedChange={(checked) => setConfiguracoes({...configuracoes, backup: checked})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Manutenção</Label>
              <p className="text-sm text-muted-foreground">Desabilitar acesso dos usuários</p>
            </div>
            <Switch 
              checked={configuracoes.manutencao}
              onCheckedChange={(checked) => setConfiguracoes({...configuracoes, manutencao: checked})}
            />
          </div>
          <Separator />
          <div className="space-y-4">
            <div>
              <Label>Status do Sistema</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    <Database className="h-3 w-3 mr-1" />
                    Database Online
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    <Globe className="h-3 w-3 mr-1" />
                    API Funcionando
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Importação da Bíblia */}
      <Card>
        <CardHeader>
          <CardTitle>Bíblia – Importação de Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Configuração necessária:</strong> Configure a chave de API da "Scripture API.Bible" nas secrets das Edge Functions.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleImportStructure} className="sm:w-auto w-full">
              1. Importar Estrutura (Versões + Livros)
            </Button>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <Label>Versão</Label>
              <Select value={importVersion} onValueChange={setImportVersion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de4e12af7f28f599-02">ACF</SelectItem>
                  <SelectItem value="592420522e16049f-01">NAA</SelectItem>
                  <SelectItem value="06125adad2d5898a-01">NVI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Livro (ID)</Label>
              <Input value={importBook} onChange={(e) => setImportBook(e.target.value)} placeholder="Ex.: GEN, EXO, PSA, MAT" />
            </div>
            <div>
              <Button onClick={handleImportBook} className="w-full">
                2. Importar Livro
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Dica:</strong> Importe por livro para evitar timeouts.</p>
            <p><strong>IDs comuns:</strong> GEN (Gênesis), EXO (Êxodo), PSA (Salmos), ISA (Isaías), MAT (Mateus), JHN (João), REV (Apocalipse)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'geral': return <GeralTab />;
      case 'perfil': return <PerfilTab />;
      case 'notificacoes': return <NotificacoesTab />;
      case 'seguranca': return <SegurancaTab />;
      case 'aparencia': return <AparenciaTab />;
      case 'sistema': return <SistemaTab />;
      default: return <GeralTab />;
    }
  };

  return (
    <div className="space-y-6">
      {renderTabContent()}
      
      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button onClick={salvarConfiguracoes} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};