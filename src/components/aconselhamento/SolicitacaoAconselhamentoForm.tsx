import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HeartHandshake, Lock, UserCheck } from 'lucide-react';

const formSchema = z.object({
  nome_completo: z.string().min(2, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  motivo_contato: z.string().min(10, 'Descreva brevemente o motivo do contato'),
  detalhes_pedido: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta']),
  preferencia_horario: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SolicitacaoAconselhamentoFormProps {
  onSuccess?: () => void;
}

export const SolicitacaoAconselhamentoForm: React.FC<SolicitacaoAconselhamentoFormProps> = ({
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urgencia: 'media',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // First, get or create the person record
      const { data: { user } } = await supabase.auth.getUser();
      
      let pessoaId: string | null = null;
      
      if (user) {
        // User is logged in, try to find their person record
        const { data: pessoa } = await supabase
          .from('pessoas')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (pessoa) {
          pessoaId = pessoa.id;
        } else {
          // Create person record for logged in user
          const { data: newPessoa } = await supabase
            .from('pessoas')
            .insert({
              user_id: user.id,
              nome_completo: data.nome_completo,
              email: data.email,
              telefone: data.telefone,
            })
            .select('id')
            .single();
          
          if (newPessoa) pessoaId = newPessoa.id;
        }
      } else {
        // Anonymous user, create person record without user_id
        const { data: newPessoa } = await supabase
          .from('pessoas')
          .insert({
            nome_completo: data.nome_completo,
            email: data.email,
            telefone: data.telefone,
            tipo_pessoa: 'visitante',
          })
          .select('id')
          .single();
        
        if (newPessoa) pessoaId = newPessoa.id;
      }

      if (!pessoaId) {
        throw new Error('Erro ao criar registro de pessoa');
      }

      // Create the counseling appointment request
      const { error: appointmentError } = await supabase
        .from('agendamentos_pastorais')
        .insert({
          solicitante_id: pessoaId,
          motivo_contato: data.motivo_contato,
          detalhes_pedido: data.detalhes_pedido,
          urgencia: data.urgencia,
          telefone_contato: data.telefone,
          email_contato: data.email,
          preferencia_horario: data.preferencia_horario,
        });

      if (appointmentError) throw appointmentError;

      toast.success('Solicitação enviada com sucesso! Nossa equipe pastoral entrará em contato em breve.');
      form.reset();
      onSuccess?.();
      
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <HeartHandshake className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">Solicitação de Aconselhamento Pastoral</CardTitle>
        <CardDescription>
          Estamos aqui para caminhar ao seu lado. Compartilhe conosco como podemos ajudá-lo(a) em oração e orientação.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Privacy Notice */}
        <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Privacidade e Confidencialidade</h4>
              <p className="text-sm text-muted-foreground">
                Todas as informações compartilhadas são tratadas com total confidencialidade. 
                Apenas a equipe pastoral autorizada terá acesso aos seus dados.
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome_completo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgência</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivo_contato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo do Contato *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva brevemente o motivo pelo qual gostaria de falar com um pastor..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detalhes_pedido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalhes Adicionais (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Compartilhe mais detalhes se desejar..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferencia_horario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferência de Horário (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Manhãs, tardes, fins de semana..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Enviar Solicitação
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};