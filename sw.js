const V='easycuadre-v1';
const ARCHIVOS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// Abre al instante desde lo guardado y se actualiza en segundo plano cuando hay internet.
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(guardado=>{
    const red=fetch(r).then(resp=>{
      if(resp&&resp.ok){const copia=resp.clone();caches.open(V).then(c=>c.put(r,copia));}
      return resp;
    }).catch(()=>guardado||(r.mode==='navigate'?caches.match('./index.html'):undefined));
    return guardado||red;
  }));
});
