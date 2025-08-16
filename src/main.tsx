import React from 'react'
import { createRoot } from 'react-dom/client'
import { UltraStableProviders } from '@/core/providers/UltraStableProviders'
import { MinimalLiveEditorProvider } from '@/core/providers/MinimalLiveEditorProvider'
import { AppRouter } from '@/core/router/AppRouter'
import './index.css'
import { initErrorReporting } from './utils/errorReporting'
import { initializeBundleOptimizations } from '@/shared/utils/bundleOptimization'
import { performanceMonitor } from '@/shared/utils/performance'

// Inicializar monitoramento de performance
performanceMonitor.mark('app-start')

// Preload recursos críticos
const preloadCriticalResources = () => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = '/src/assets/hero-immersive.jpg'
  link.as = 'image'
  document.head.appendChild(link)
}

// Inicializar monitoramento de erros
initErrorReporting()

// Inicializar otimizações de performance
initializeBundleOptimizations()

// Preload recursos se já carregado, senão aguardar DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preloadCriticalResources)
} else {
  preloadCriticalResources()
}

// Registrar Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

/**
 * Aplicação Kerigma - Reconstrução Arquitetural Completa
 * 
 * Esta versão elimina loops de renderização e garante estabilidade:
 * 1. Providers estáveis sem re-criação
 * 2. LiveEditor carregado condicionalmente apenas para admins
 * 3. Inicialização segura de todos os contextos
 */
// Render otimizado
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UltraStableProviders>
      <MinimalLiveEditorProvider>
        <AppRouter />
      </MinimalLiveEditorProvider>
    </UltraStableProviders>
  </React.StrictMode>
)

// Finalizar monitoramento
performanceMonitor.mark('app-render-complete')
