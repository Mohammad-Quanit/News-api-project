let newsStaticCache = 'news-static';
let newsDynamicCache = 'news-dynamic';
let assets = [
    './',
    './app.js',
    './images/logo.png',
    './images/logo128.png',
    './images/logo144.png',
    './images/logo152.png',
    './images/logo192.png',
    './images/logo256.png',
    './images/heart01.png',
    './images/icon.ico',
    './fallback.json',
    './images/f.jpg'
];

self.addEventListener('install', async e => {
    console.log(`Install`);
    const cache = await caches.open(newsStaticCache);
    cache.addAll(assets);
});


self.addEventListener('activate', e => {
    caches.keys().then(function (keylist) {
        return Promise.all(keylist.map(function (key) {
            if (key != newsStaticCache && key != newsDynamicCache) {
                console.log('Removig Old Caches', key);
                return caches.delete(key);
            }
        }));
    });
    return self.clients.claim();
});


self.addEventListener('fetch', e => {
    console.log(`Fetch`)
    const req = e.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkFirst(req));
    }

});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}
async function networkFirst(req) {
    const cache = await caches.open(newsDynamicCache);
    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
    }
}