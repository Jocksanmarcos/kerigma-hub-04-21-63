import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PessoasList } from '@/components/pessoas/PessoasList';
import { FamilyTreeView } from '@/components/pessoas/FamilyTreeView';
import { FamilyStatsCard } from '@/components/pessoas/FamilyStatsCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PessoasPage = () => {
  const [showFamilyTree, setShowFamilyTree] = useState(false);

  const handleViewFamilies = () => {
    setShowFamilyTree(true);
  };

  const handleBackToPeople = () => {
    setShowFamilyTree(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {showFamilyTree ? 'Árvore Genealógica das Famílias' : 'Gestão de Pessoas'}
            </h1>
            <p className="text-muted-foreground">
              {showFamilyTree 
                ? 'Visualize a estrutura familiar organizada por hierarquia' 
                : 'Gerencie membros, visitantes e líderes da sua igreja'
              }
            </p>
          </div>
          {showFamilyTree && (
            <Button variant="outline" onClick={handleBackToPeople}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Pessoas
            </Button>
          )}
        </div>
        
        {showFamilyTree ? (
          <FamilyTreeView />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <FamilyStatsCard onViewFamilies={handleViewFamilies} />
            </div>
            <PessoasList />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PessoasPage;