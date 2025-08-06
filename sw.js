// Service Worker para Mueveme.es
// Mejora la velocidad de carga y permite funcionalidad offline básica

const CACHE_NAME = 'mueveme-v1.0.0';
const CACHE_ASSETS = [
    '/',
    '/inicio.html',
    '/servicios.html',
    '/contacto.html',
    '/assets/central.css',
    '/assets/central.js',
    '/assets/favicon.ico'
];

// Install Event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
    
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
    console.log('Service Worker: Fetching');
    
    // Strategy: Cache First para assets, Network First para HTML
    if (e.request.destination === 'document') {
        // Network First para páginas HTML
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const resClone = res.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(e.request, resClone);
                        });
                    return res;
                })
                .catch(() => caches.match(e.request))
        );
    } else {
        // Cache First para assets (CSS, JS, imágenes)
        e.respondWith(
            caches.match(e.request)
                .then(res => {
                    return res || fetch(e.request)
                        .then(fetchRes => {
                            const fetchResClone = fetchRes.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(e.request, fetchResClone);
                                });
                            return fetchRes;
                        });
                })
        );
    }
});
