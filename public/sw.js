// Service Worker para cache offline
const CACHE_NAME = 'kerigma-hub-v1';
const STATIC_CACHE_NAME = 'kerigma-static-v1';
const DYNAMIC_CACHE_NAME = 'kerigma-dynamic-v1';

// Recursos para cache estático
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/favicon.ico',
  // Adicionar outros recursos críticos
];

// Recursos para cache dinâmico
const DYNAMIC_CACHE_URLS = [
  '/api/',
  'https://vsanvmekqtfkbgmrjwoo.supabase.co/'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Estratégia Cache First para recursos estáticos
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }
  
  // Estratégia Network First para APIs
  if (DYNAMIC_CACHE_URLS.some(pattern => url.href.includes(pattern))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Só cachear respostas bem-sucedidas
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback para cache se offline
          return caches.match(request);
        })
    );
    return;
  }
  
  // Estratégia Stale While Revalidate para outros recursos
  event.respondWith(
    caches.match(request).then((response) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });
      
      return response || fetchPromise;
    })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Implementar sincronização de dados offline
      syncOfflineData()
    );
  }
});

// Notificações Push
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver mais',
          icon: '/favicon.ico'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/favicon.ico'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Abrir aplicação
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Função para sincronizar dados offline
async function syncOfflineData() {
  try {
    // Implementar lógica de sincronização
    console.log('Service Worker: Syncing offline data...');
    
    // Recuperar dados pendentes do IndexedDB
    // Enviar para servidor quando online
    // Limpar dados sincronizados
    
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Sync failed:', error);
    throw error;
  }
}

// Limpeza de cache antigo
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});