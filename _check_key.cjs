const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const row = db.prepare("SELECT value FROM settings WHERE key = 'unified_api_key'").get();
console.log('Stored unified key:', row?.value);
db.close();
