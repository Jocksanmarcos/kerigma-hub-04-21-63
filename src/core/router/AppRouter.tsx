import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import PublicSiteLayout from "@/components/layout/PublicSiteLayout";
import { PageLoader } from "@/components/performance/PageLoader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy load pages for better performance
const Index = React.lazy(() => import("@/pages/Index"));
const DashboardPage = React.lazy(() => import("@/pages/dashboard/DashboardPage"));
const PessoasPage = React.lazy(() => import("@/pages/dashboard/PessoasPage"));
const FinanceiroPage = React.lazy(() => import("@/pages/dashboard/FinanceiroPage"));
const AgendaPage = React.lazy(() => import("@/pages/dashboard/AgendaPage"));
const EventosPage = React.lazy(() => import("@/pages/dashboard/EventosPage"));
const PatrimonioPage = React.lazy(() => import("@/pages/dashboard/PatrimonioPage"));
const MinisteriosPage = React.lazy(() => import("@/pages/dashboard/MinisteriosPage"));
const EscalasPage = React.lazy(() => import("@/pages/dashboard/EscalasPage"));
const CultosStudioPage = React.lazy(() => import("@/pages/dashboard/CultosStudioPage"));
const LouvorAmbienteStudioPage = React.lazy(() => import("@/pages/dashboard/LouvorAmbienteStudioPage"));
const CelulasPage = React.lazy(() => import("@/pages/dashboard/CelulasPage"));
const AconselhamentoPage = React.lazy(() => import("@/pages/dashboard/AconselhamentoPage"));
const MissoesPage = React.lazy(() => import("@/pages/Dashboard/Missoes"));
const MissoesFinanceiroPage = React.lazy(() => import("@/pages/Dashboard/MissoesFinanceiro"));

const CentroEnsinoPage = React.lazy(() => import("@/pages/ensino/CentroEnsinoPage"));
const BibliaPage = React.lazy(() => import("@/pages/ensino/BibliaPage"));
const MeusCursosPage = React.lazy(() => import("@/pages/cursos/MeusCursosPage"));

const AnalyticsPage = React.lazy(() => import("@/pages/admin/AnalyticsPage"));
const ConfiguracoesPage = React.lazy(() => import("@/pages/admin/ConfiguracoesPage"));
const GovernancePage = React.lazy(() => import("@/pages/admin/GovernancePage"));
const IAPastoralPage = React.lazy(() => import("@/pages/admin/IAPastoralPage"));
const SitePage = React.lazy(() => import("@/pages/admin/SitePage"));

const PublicHomePage = React.lazy(() => import("@/pages/public/StablePublicHomePage"));
const PublicSobrePage = React.lazy(() => import("@/pages/public/PublicSobrePage"));
const PublicEventoPage = React.lazy(() => import("@/pages/public/PublicEventoPage"));
const PublicCelulasPage = React.lazy(() => import("@/pages/public/PublicCelulasPage"));
const PublicAgendaPage = React.lazy(() => import("@/pages/public/PublicAgendaPage"));
const PublicAconselhamentoPage = React.lazy(() => import("@/pages/public/PublicAconselhamentoPage"));
const PublicGaleriaPage = React.lazy(() => import("@/pages/public/NewPublicGaleriaPage"));
const PublicContatoPageDynamic = React.lazy(() => import("@/pages/public/PublicContatoPageDynamic"));
const PublicVisitePage = React.lazy(() => import("@/pages/public/PublicVisitePage"));

const AuthPage = React.lazy(() => import("@/pages/auth/AuthPage"));
const ForcePasswordChangePage = React.lazy(() => import("@/pages/auth/ForcePasswordChangePage"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const SiteMapPage = React.lazy(() => import("@/pages/SiteMapPage"));

const MinimalLoader = () => <PageLoader type="minimal" />;

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<MinimalLoader />}>
      <Routes>
        {/* Main Public Homepage */}
        <Route path="/" element={<PublicHomePage />} />
        
        {/* Public Pages Routes */}
        <Route path="/sobre" element={<PublicSobrePage />} />
        <Route path="/celulas" element={<PublicCelulasPage />} />
        <Route path="/agenda" element={<PublicAgendaPage />} />
        <Route path="/aconselhamento" element={<PublicAconselhamentoPage />} />
        <Route path="/galeria" element={<PublicGaleriaPage />} />
        <Route path="/contato" element={<PublicContatoPageDynamic />} />
        <Route path="/visite" element={<PublicVisitePage />} />
        <Route path="/evento/:id" element={<PublicEventoPage />} />

        {/* Legacy public routes */}
        <Route path="/public" element={<PublicSiteLayout><div /></PublicSiteLayout>}>
          <Route index element={<PublicHomePage />} />
          <Route path="sobre" element={<PublicSobrePage />} />
          <Route path="evento/:id" element={<PublicEventoPage />} />
        </Route>

        {/* Generosity Routes */}
        <Route path="/semear" element={React.createElement(React.lazy(() => import("@/pages/public/SemearTransformarPage")))} />
        <Route path="/semear/:status" element={React.createElement(React.lazy(() => import("@/pages/public/DonationStatusPage")))} />

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/force-password-change" element={<ForcePasswordChangePage />} />
        
        {/* Sitemap */}
        <Route path="/sitemap" element={<SiteMapPage />} />

        {/* Protected Dashboard Routes */}
        <Route path="/admin" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        
        <Route path="/dashboard/pessoas" element={<ProtectedRoute><PessoasPage /></ProtectedRoute>} />
        <Route path="/dashboard/biblioteca" element={<ProtectedRoute>{React.createElement(React.lazy(() => import("@/pages/dashboard/BibliotecaPage")))}</ProtectedRoute>} />
        <Route path="/dashboard/celulas" element={<ProtectedRoute><CelulasPage /></ProtectedRoute>} />
        <Route path="/dashboard/aconselhamento" element={<ProtectedRoute><AconselhamentoPage /></ProtectedRoute>} />
        <Route path="/dashboard/financeiro" element={<ProtectedRoute><FinanceiroPage /></ProtectedRoute>} />
        <Route path="/dashboard/agenda" element={<ProtectedRoute><AgendaPage /></ProtectedRoute>} />
        <Route path="/dashboard/eventos" element={<ProtectedRoute><EventosPage /></ProtectedRoute>} />
        <Route path="/dashboard/patrimonio" element={<ProtectedRoute><PatrimonioPage /></ProtectedRoute>} />
        <Route path="/dashboard/ministerios" element={<ProtectedRoute><MinisteriosPage /></ProtectedRoute>} />
        <Route path="/dashboard/escalas" element={<ProtectedRoute><EscalasPage /></ProtectedRoute>} />
        <Route path="/dashboard/cultos" element={<ProtectedRoute><CultosStudioPage /></ProtectedRoute>} />
        <Route path="/dashboard/louvor" element={<ProtectedRoute><LouvorAmbienteStudioPage /></ProtectedRoute>} />
        <Route path="/dashboard/missoes" element={<ProtectedRoute><MissoesPage /></ProtectedRoute>} />
        <Route path="/dashboard/missoes/financeiro" element={<ProtectedRoute><MissoesFinanceiroPage /></ProtectedRoute>} />
        <Route path="/dashboard/missoes/relatorios" element={<ProtectedRoute>{React.createElement(React.lazy(() => import("@/pages/Dashboard/MissoesRelatorios")))}</ProtectedRoute>} />
        <Route path="/dashboard/missoes/pessoas" element={<ProtectedRoute>{React.createElement(React.lazy(() => import("@/pages/Dashboard/MissoesPessoas")))}</ProtectedRoute>} />
        <Route path="/dashboard/missoes/eventos" element={<ProtectedRoute>{React.createElement(React.lazy(() => import("@/pages/Dashboard/MissoesEventos")))}</ProtectedRoute>} />
        <Route path="/dashboard/missoes/configuracoes" element={<ProtectedRoute>{React.createElement(React.lazy(() => import("@/pages/Dashboard/MissoesConfiguracoes")))}</ProtectedRoute>} />

        {/* Ensino Routes */}
        <Route path="/ensino" element={<ProtectedRoute><CentroEnsinoPage /></ProtectedRoute>} />
        <Route path="/ensino/biblia" element={<ProtectedRoute><BibliaPage /></ProtectedRoute>} />
        <Route path="/cursos" element={<ProtectedRoute><MeusCursosPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/site" element={<ProtectedRoute><SitePage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/admin/configuracoes" element={<ProtectedRoute><ConfiguracoesPage /></ProtectedRoute>} />
        <Route path="/admin/governanca" element={<ProtectedRoute><GovernancePage /></ProtectedRoute>} />
        <Route path="/admin/ia-pastoral" element={<ProtectedRoute><IAPastoralPage /></ProtectedRoute>} />

        {/* Fallback Routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};