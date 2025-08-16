import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PastoralInbox } from "@/components/aconselhamento/PastoralInbox";

const AconselhamentoPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aconselhamento Pastoral</h1>
          <p className="text-muted-foreground">
            Gerencie solicitações de aconselhamento e acompanhamento pastoral
          </p>
        </div>
        
        <PastoralInbox />
      </div>
    </AppLayout>
  );
};

export default AconselhamentoPage;