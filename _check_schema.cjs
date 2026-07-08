const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const cols = db.prepare("PRAGMA table_info(profile_models)").all();
console.log('profile_models columns:', JSON.stringify(cols, null, 2));
// Also check model_id column exists
const cols2 = db.prepare("PRAGMA table_info(models)").all();
console.log('models columns:', JSON.stringify(cols2, null, 2));
db.close();
