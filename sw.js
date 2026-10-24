/* Service worker: lets the game open offline after the first visit (network first, cache as fallback). */
const CACHE='bena-v19';
const ASSETS=['./','index.html','css/themes.css','css/style.css','js/data/questions.js','js/data/forfeits.js','js/data/fem.js','js/data/more.js','js/config.js','js/i18n.js','js/util.js','js/audio.js','js/state.js','js/ui.js','js/net.js','js/room.js','js/features.js','js/app.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
