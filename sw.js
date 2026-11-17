const C='recehin-v1',A=['./','index.html','style.css','app.js','manifest.json','icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{if(e.request.method=='GET')e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./')))});
