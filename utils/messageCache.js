const CACHE_LIMIT = 3000;
const cache = new Map();
function set(remoteJid, id, data) { const key = `${remoteJid}:${id}`; cache.set(key, { ...data, timestamp: Date.now() }); if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value); }
function get(remoteJid, id) { return cache.get(`${remoteJid}:${id}`) || null; }
function clear() { const size = cache.size; cache.clear(); return size; }
module.exports = { set, get, clear };
