import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, MessageSquare, Calendar, FileText, Settings } from 'lucide-react';

const quickActions = [
  {
    title: 'Novo Curso',
    description: 'Criar um novo curso',
    icon: Plus,
    action: () => {},
  },
  {
    title: 'Upload de Conteúdo',
    description: 'Adicionar materiais',
    icon: Upload,
    action: () => {},
  },
  {
    title: 'Mensagens',
    description: 'Enviar comunicados',
    icon: MessageSquare,
    action: () => {},
  },
  {
    title: 'Agendar Evento',
    description: 'Marcar novo evento',
    icon: Calendar,
    action: () => {},
  },
  {
    title: 'Relatórios',
    description: 'Gerar relatórios',
    icon: FileText,
    action: () => {},
  },
  {
    title: 'Configurações',
    description: 'Ajustes do sistema',
    icon: Settings,
    action: () => {},
  },
];

export const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
              onClick={action.action}
            >
              <action.icon className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};