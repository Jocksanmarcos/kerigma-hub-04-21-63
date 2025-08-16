import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Edit, Phone, MapPin, Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PessoaFamiliaProps {
  pessoa: any;
}

export const PessoaFamilia = ({ pessoa }: PessoaFamiliaProps) => {
  console.log('PessoaFamilia renderizado:', pessoa);
  
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [openPersonSearch, setOpenPersonSearch] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [newMemberData, setNewMemberData] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    tipo_vinculo: 'filho'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar pessoas disponíveis para adicionar à família
  const { data: availablePeople } = useQuery({
    queryKey: ['available-people'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pessoas')
        .select('id, nome_completo, email, telefone, data_nascimento')
        .eq('situacao', 'ativo')
        .is('familia_id', null)
        .order('nome_completo');
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAddingMember
  });

  // Buscar dados da família
  const { data: familiaData, isLoading, error } = useQuery({
    queryKey: ['pessoa-familia', pessoa.id],
    queryFn: async () => {
      if (!pessoa.familia_id) return null;

      console.log('Buscando família com ID:', pessoa.familia_id);

      const [familiaResult, membrosResult] = await Promise.all([
        supabase
          .from('familias')
          .select('*')
          .eq('id', pessoa.familia_id)
          .single(),
        
        supabase
          .from('vinculos_familiares')
          .select(`
            *,
            pessoas:pessoa_id(
              nome_completo,
              email,
              telefone,
              data_nascimento,
              tipo_pessoa
            )
          `)
          .eq('familia_id', pessoa.familia_id)
      ]);

      console.log('Resultado família:', familiaResult);
      console.log('Resultado membros:', membrosResult);

      if (familiaResult.error) {
        console.error('Erro ao buscar família:', familiaResult.error);
      }
      if (membrosResult.error) {
        console.error('Erro ao buscar membros:', membrosResult.error);
      }

      // Ordenar membros: responsável primeiro, depois outros
      const membrosOrdenados = (membrosResult.data || []).sort((a: any, b: any) => {
        // Se um é responsável e o outro não, responsável vem primeiro
        if (a.responsavel_familiar && !b.responsavel_familiar) return -1;
        if (!a.responsavel_familiar && b.responsavel_familiar) return 1;
        
        // Se ambos são responsáveis ou nenhum é, manter ordem original
        return 0;
      });

      return {
        familia: familiaResult.data,
        membros: membrosOrdenados
      };
    },
    enabled: !!pessoa.familia_id
  });

  // Mutation para adicionar membro da família
  const addMemberMutation = useMutation({
    mutationFn: async (memberData: any) => {
      console.log('Executando mutation addMember:', memberData);
      let familiaId = pessoa.familia_id;
      
      // Se não tem família, criar uma primeira
      if (!familiaId) {
        const nomeFamilia = 'Família ' + pessoa.nome_completo.split(' ').pop();
        
        const { data: novaFamilia, error: familiaError } = await supabase
          .from('familias')
          .insert({
            nome_familia: nomeFamilia,
            endereco: pessoa.endereco || '',
            telefone_principal: pessoa.telefone || ''
          })
          .select()
          .single();

        if (familiaError) throw familiaError;
        familiaId = novaFamilia.id;

        // Atualizar a pessoa atual para ter família_id
        const { error: updatePessoaError } = await supabase
          .from('pessoas')
          .update({ familia_id: familiaId })
          .eq('id', pessoa.id);

        if (updatePessoaError) throw updatePessoaError;

        // Criar vínculo para a pessoa atual
        const { error: vinculoAtualError } = await supabase
          .from('vinculos_familiares')
          .insert({
            familia_id: familiaId,
            pessoa_id: pessoa.id,
            tipo_vinculo: 'responsavel',
            responsavel_familiar: true
          });

        if (vinculoAtualError) throw vinculoAtualError;
      }

      // Usar pessoa existente (selecionada) ou criar uma nova
      let novaPessoaId: string;

      if (selectedPersonId) {
        // Atualiza pessoa existente para vincular à família
        const { error: updateExistingErr } = await supabase
          .from('pessoas')
          .update({ familia_id: familiaId })
          .eq('id', selectedPersonId);
        if (updateExistingErr) throw updateExistingErr;
        novaPessoaId = selectedPersonId;
      } else {
        // Criar nova pessoa
        const { data: novaPessoa, error: pessoaError } = await supabase
          .from('pessoas')
          .insert({
            nome_completo: memberData.nome_completo,
            email: memberData.email || null,
            telefone: memberData.telefone || null,
            data_nascimento: memberData.data_nascimento || null,
            tipo_pessoa: 'membro',
            situacao: 'ativo',
            familia_id: familiaId
          })
          .select()
          .single();
        if (pessoaError) throw pessoaError;
        novaPessoaId = novaPessoa.id;
      }

      // Criar vínculo familiar
      const { error: vinculoError } = await supabase
        .from('vinculos_familiares')
        .insert({
          familia_id: familiaId,
          pessoa_id: novaPessoaId,
          tipo_vinculo: memberData.tipo_vinculo,
          responsavel_familiar: false
        });

      if (vinculoError) throw vinculoError;

      return { id: novaPessoaId };
    },
    onSuccess: () => {
      toast({
        title: "Membro adicionado",
        description: "Novo membro foi adicionado à família com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['pessoa-familia'] });
      queryClient.invalidateQueries({ queryKey: ['pessoas'] });
      setIsAddingMember(false);
      setNewMemberData({
        nome_completo: '',
        email: '',
        telefone: '',
        data_nascimento: '',
        tipo_vinculo: 'filho'
      });
    },
    onError: (error: any) => {
      let msg = 'Não foi possível adicionar o membro à família.';
      const text = typeof error?.message === 'string' ? error.message : JSON.stringify(error);
      if (text?.includes('pessoas_email_key')) {
        msg = 'Este email já está cadastrado. Selecione a pessoa existente na lista acima.';
      }
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
      console.error('Erro ao adicionar membro:', error);
    }
  });

  const getTipoVinculoBadge = (tipo: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      'pai': 'default',
      'mae': 'default',
      'filho': 'secondary',
      'conjuge': 'outline',
      'irmao': 'secondary',
      'responsavel': 'default'
    };
    return variants[tipo] || 'outline';
  };

  const getIdade = (dataNascimento: string) => {
    if (!dataNascimento) return '';
    const idade = new Date().getFullYear() - new Date(dataNascimento).getFullYear();
    return `${idade} anos`;
  };

  // Função para selecionar pessoa existente e preencher dados
  const handleSelectPerson = (personId: string) => {
    const person = availablePeople?.find(p => p.id === personId);
    if (person) {
      setNewMemberData(prev => ({
        ...prev,
        nome_completo: person.nome_completo,
        email: person.email || '',
        telefone: person.telefone || '',
        data_nascimento: person.data_nascimento || ''
      }));
      setSelectedPersonId(personId);
    }
    setOpenPersonSearch(false);
  };

  // Limpar dados quando fechar dialog
  const handleCloseDialog = () => {
    setIsAddingMember(false);
    setSelectedPersonId('');
    setNewMemberData({
      nome_completo: '',
      email: '',
      telefone: '',
      data_nascimento: '',
      tipo_vinculo: 'filho'
    });
  };

  const handleAddMember = () => {
    console.log('Botão Criar Família clicado!');
    console.log('Dados do novo membro:', newMemberData);
    console.log('Pessoa atual:', pessoa);
    addMemberMutation.mutate(newMemberData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Família
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pessoa.familia_id || !familiaData?.familia) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Família
          </CardTitle>
          <Dialog open={isAddingMember} onOpenChange={(open) => { setIsAddingMember(open); if (!open) handleCloseDialog(); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Criar Família
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Família</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Selecionar Pessoa Existente (Opcional)</Label>
                  <Popover open={openPersonSearch} onOpenChange={setOpenPersonSearch}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openPersonSearch}
                        className="w-full justify-between"
                      >
                        {selectedPersonId
                          ? availablePeople?.find(person => person.id === selectedPersonId)?.nome_completo
                          : "Buscar pessoa existente..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Digite o nome da pessoa..." />
                        <CommandEmpty>Nenhuma pessoa encontrada.</CommandEmpty>
                        <CommandGroup>
                          {availablePeople?.map((person) => (
                            <CommandItem
                              key={person.id}
                              value={person.nome_completo}
                              onSelect={() => handleSelectPerson(person.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPersonId === person.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{person.nome_completo}</span>
                                {person.email && (
                                  <span className="text-sm text-muted-foreground">{person.email}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={newMemberData.nome_completo}
                    onChange={(e) => setNewMemberData(prev => ({ ...prev, nome_completo: e.target.value }))}
                    placeholder="Digite o nome completo ou selecione acima"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMemberData.email}
                    onChange={(e) => setNewMemberData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Digite o email"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={newMemberData.telefone}
                    onChange={(e) => setNewMemberData(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="Digite o telefone"
                  />
                </div>
                <div>
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={newMemberData.data_nascimento}
                    onChange={(e) => setNewMemberData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tipo_vinculo">Tipo de Vínculo</Label>
                  <Select
                    value={newMemberData.tipo_vinculo}
                    onValueChange={(value) => setNewMemberData(prev => ({ ...prev, tipo_vinculo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="filho">Filho(a)</SelectItem>
                      <SelectItem value="conjuge">Cônjuge</SelectItem>
                      <SelectItem value="irmao">Irmão(ã)</SelectItem>
                      <SelectItem value="responsavel">Responsável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleAddMember}
                    disabled={addMemberMutation.isPending || !newMemberData.nome_completo}
                    className="flex-1"
                  >
                    {addMemberMutation.isPending ? 'Criando...' : 'Criar Família'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCloseDialog}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Não está vinculado a uma família</p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique em "Criar Família" para adicionar familiares
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { familia, membros } = familiaData;

  return (
    <div className="space-y-6">
      {/* Informações da Família */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {familia.nome_familia}
          </CardTitle>
          <Dialog open={isAddingMember} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Membro da Família</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Selecionar Pessoa Existente (Opcional)</Label>
                  <Popover open={openPersonSearch} onOpenChange={setOpenPersonSearch}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openPersonSearch}
                        className="w-full justify-between"
                      >
                        {selectedPersonId
                          ? availablePeople?.find(person => person.id === selectedPersonId)?.nome_completo
                          : "Buscar pessoa existente..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Digite o nome da pessoa..." />
                        <CommandEmpty>Nenhuma pessoa encontrada.</CommandEmpty>
                        <CommandGroup>
                          {availablePeople?.map((person) => (
                            <CommandItem
                              key={person.id}
                              value={person.nome_completo}
                              onSelect={() => handleSelectPerson(person.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPersonId === person.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{person.nome_completo}</span>
                                {person.email && (
                                  <span className="text-sm text-muted-foreground">{person.email}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={newMemberData.nome_completo}
                    onChange={(e) => setNewMemberData(prev => ({ ...prev, nome_completo: e.target.value }))}
                    placeholder="Digite o nome completo ou selecione acima"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMemberData.email}
                    onChange={(e) => setNewMemberData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Digite o email"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={newMemberData.telefone}
                    onChange={(e) => setNewMemberData(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="Digite o telefone"
                  />
                </div>
                <div>
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={newMemberData.data_nascimento}
                    onChange={(e) => setNewMemberData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tipo_vinculo">Tipo de Vínculo</Label>
                  <Select
                    value={newMemberData.tipo_vinculo}
                    onValueChange={(value) => setNewMemberData(prev => ({ ...prev, tipo_vinculo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pai">Pai</SelectItem>
                      <SelectItem value="mae">Mãe</SelectItem>
                      <SelectItem value="filho">Filho(a)</SelectItem>
                      <SelectItem value="conjuge">Cônjuge</SelectItem>
                      <SelectItem value="irmao">Irmão(ã)</SelectItem>
                      <SelectItem value="responsavel">Responsável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleAddMember}
                    disabled={addMemberMutation.isPending || !newMemberData.nome_completo}
                    className="flex-1"
                  >
                    {addMemberMutation.isPending ? 'Adicionando...' : 'Adicionar'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCloseDialog}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familia.endereco && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{familia.endereco}</span>
              </div>
            )}
            {familia.telefone_principal && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{familia.telefone_principal}</span>
              </div>
            )}
            {familia.observacoes && (
              <div className="text-sm text-muted-foreground">
                <strong>Observações:</strong> {familia.observacoes}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Membros da Família */}
      <Card>
        <CardHeader>
          <CardTitle>Membros da Família ({membros.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {membros.map((membro: any) => (
              <div key={membro.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{membro.pessoas?.nome_completo}</h4>
                    <Badge variant={getTipoVinculoBadge(membro.tipo_vinculo)}>
                      {membro.responsavel_familiar ? 'Responsável' : membro.tipo_vinculo}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {membro.pessoas?.email && (
                      <p>{membro.pessoas.email}</p>
                    )}
                    {membro.pessoas?.telefone && (
                      <p>{membro.pessoas.telefone}</p>
                    )}
                    {membro.pessoas?.data_nascimento && (
                      <p>{getIdade(membro.pessoas.data_nascimento)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};