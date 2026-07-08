const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const keys = db.prepare("SELECT id, platform, label, status, enabled FROM api_keys ORDER BY platform").all();
console.log('API Keys:');
keys.forEach(k => console.log(`  [${k.id}] ${k.platform} "${k.label}" status=${k.status} enabled=${k.enabled}`));
db.close();
