const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const k = db.prepare("SELECT value FROM settings WHERE key = 'unified_api_key'").get();
console.log('Unified key:', k?.value);
db.close();
