import React, { useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Bell, Wrench, Calendar, Music, MessageCircle, BarChart3 } from 'lucide-react';
import { SchedulingDashboard } from '@/components/scheduling/SchedulingDashboard';
import MusicLibraryManager from '@/components/cultos-studio/MusicLibraryManager';
import ChatInterno from '@/components/ministerios/ChatInterno';
import RelatoriosMinisterios from '@/components/ministerios/RelatoriosMinisterios';
import { AvailabilityManager } from '@/components/scheduling/AvailabilityManager';
import { RequirePermission } from '@/components/security/RequirePermission';
import { AppLayout } from '@/components/layout/AppLayout';
import ConvocacaoInteligenteTab from '@/components/cultos-studio/ConvocacaoInteligenteTab';
import WorshipPortalView from '@/components/cultos-studio/WorshipPortalView';

export default function MinisteriosPage() {
  // SEO basics
  useEffect(() => {
    document.title = 'Ministérios & Louvor | Centro de Comando';
    const desc = 'Ministérios & Louvor: Escalas inteligentes, Repertório e gestão centralizada.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    // canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.origin + '/dashboard/ministerios');
  }, []);

  const nextSunday = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = (7 - day) % 7 || 7; // days until next Sunday
    const next = new Date(d.getTime() + diff * 24 * 60 * 60 * 1000);
    return next.toISOString().split('T')[0];
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Ministérios & Louvor — Centro de Comando</h1>
          <p className="text-muted-foreground mt-2">Gerencie equipes, escalas, repertório e alertas em um só lugar.</p>
        </div>
          <Tabs defaultValue="equipes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-9 lg:w-[840px]">
              <TabsTrigger value="equipes" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Equipes
              </TabsTrigger>
              <TabsTrigger value="escalas" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Escalas
              </TabsTrigger>
              <TabsTrigger value="convocatoria" className="flex items-center gap-2">
                Convocatória
              </TabsTrigger>
              <TabsTrigger value="disponibilidade" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Disponibilidade
              </TabsTrigger>
              <TabsTrigger value="repertorio" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Repertório
              </TabsTrigger>
              <TabsTrigger value="portal" className="flex items-center gap-2">
                Portal de Louvor
              </TabsTrigger>
              <TabsTrigger value="comunicacao" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comunicação
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="alertas" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alertas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="equipes" className="space-y-6">
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> Equipes ativas <Badge variant="secondary">12</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Visualize e gerencie as equipes ministeriais da igreja.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" /> Funções configuradas <Badge variant="outline">36</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Defina funções e níveis para cada equipe.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-4 w-4" /> Pendências recentes <Badge>3</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>2 confirmações de escala aguardando resposta</li>
                      <li>1 recurso solicitando aprovação</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            <TabsContent value="escalas" className="space-y-6">
              <RequirePermission action="manage" subject="escalas">
                <SchedulingDashboard
                  planId="ministerios-demo-plan"
                  planTitle="Culto de Domingo - Ministérios"
                  serviceDate={nextSunday}
                  userRole="leader"
                />
              </RequirePermission>
            </TabsContent>

            <TabsContent value="disponibilidade" className="space-y-6">
              <AvailabilityManager />
            </TabsContent>

            <TabsContent value="convocatoria" className="space-y-6">
              <ConvocacaoInteligenteTab />
            </TabsContent>

            <TabsContent value="repertorio" className="space-y-6">
              <section>
                <MusicLibraryManager />
              </section>
            </TabsContent>

            <TabsContent value="portal" className="space-y-6">
              <WorshipPortalView />
            </TabsContent>
            <TabsContent value="comunicacao" className="space-y-6">
              <ChatInterno />
            </TabsContent>

            <TabsContent value="relatorios" className="space-y-6">
              <RelatoriosMinisterios />
            </TabsContent>

            <TabsContent value="alertas" className="space-y-6">
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle>Alertas recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Conflito de disponibilidade em 14/08 (Equipe Multimídia)</li>
                      <li>Falta 1 voluntário na escala de Recepção</li>
                      <li>Equipamento projetor com manutenção prevista</li>
                    </ul>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>
          </Tabs>
        </div>
    </AppLayout>
  );
}
