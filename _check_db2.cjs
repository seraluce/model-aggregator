const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', JSON.stringify(tables.map(t => t.name)));
const keys = db.prepare('SELECT * FROM api_keys').all();
console.log('api_keys:', JSON.stringify(keys));
db.close();
