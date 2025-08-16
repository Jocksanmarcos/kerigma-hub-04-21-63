import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, X } from 'lucide-react';

interface PessoaCadastroInfoProps {
  pessoa: any;
}

export const PessoaCadastroInfo: React.FC<PessoaCadastroInfoProps> = ({ pessoa }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: pessoa.nome_completo || '',
    email: pessoa.email || '',
    telefone: pessoa.telefone || '',
    data_nascimento: pessoa.data_nascimento || '',
    sexo: pessoa.sexo || '',
    estado_civil: pessoa.estado_civil || '',
    profissao: pessoa.profissao || '',
    endereco: pessoa.endereco || '',
    cep: pessoa.cep || '',
    cidade: pessoa.cidade || '',
    estado: pessoa.estado || '',
    observacoes: pessoa.observacoes || '',
    data_batismo: pessoa.data_batismo || '',
    igreja_origem: pessoa.igreja_origem || '',
    como_conheceu: pessoa.como_conheceu || '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('pessoas')
        .update(data)
        .eq('id', pessoa.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoa', pessoa.id] });
      setIsEditing(false);
      toast({
        title: 'Dados atualizados!',
        description: 'As informações foram salvas com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar as informações.',
        variant: 'destructive',
      });
      console.error('Erro:', error);
    }
  });

  const handleSave = () => {
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      nome_completo: pessoa.nome_completo || '',
      email: pessoa.email || '',
      telefone: pessoa.telefone || '',
      data_nascimento: pessoa.data_nascimento || '',
      sexo: pessoa.sexo || '',
      estado_civil: pessoa.estado_civil || '',
      profissao: pessoa.profissao || '',
      endereco: pessoa.endereco || '',
      cep: pessoa.cep || '',
      cidade: pessoa.cidade || '',
      estado: pessoa.estado || '',
      observacoes: pessoa.observacoes || '',
      data_batismo: pessoa.data_batismo || '',
      igreja_origem: pessoa.igreja_origem || '',
      como_conheceu: pessoa.como_conheceu || '',
    });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Informações de Cadastro</h2>
          <p className="text-muted-foreground">
            Dados pessoais e demográficos completos
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={mutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>
              Informações básicas da pessoa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo</Label>
                <Input
                  id="nome_completo"
                  value={formData.nome_completo}
                  onChange={(e) => handleChange('nome_completo', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => handleChange('data_nascimento', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select 
                  value={formData.sexo} 
                  onValueChange={(value) => handleChange('sexo', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado_civil">Estado Civil</Label>
                <Select 
                  value={formData.estado_civil} 
                  onValueChange={(value) => handleChange('estado_civil', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao_estavel">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formData.profissao}
                  onChange={(e) => handleChange('profissao', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>
              Localização e contato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleChange('cep', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Eclesiásticas */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Eclesiásticas</CardTitle>
            <CardDescription>
              Histórico e conexão com a igreja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_batismo">Data do Batismo</Label>
                <Input
                  id="data_batismo"
                  type="date"
                  value={formData.data_batismo}
                  onChange={(e) => handleChange('data_batismo', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="igreja_origem">Igreja de Origem</Label>
                <Input
                  id="igreja_origem"
                  value={formData.igreja_origem}
                  onChange={(e) => handleChange('igreja_origem', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="como_conheceu">Como conheceu a igreja</Label>
                <Input
                  id="como_conheceu"
                  value={formData.como_conheceu}
                  onChange={(e) => handleChange('como_conheceu', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações Gerais</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                disabled={!isEditing}
                rows={4}
                placeholder="Informações adicionais sobre a pessoa..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};