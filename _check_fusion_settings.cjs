const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
// Check fusion settings
const settings = db.prepare("SELECT key, value FROM settings WHERE key LIKE '%fusion%'").all();
console.log('Fusion settings:');
settings.forEach(s => {
  try { console.log(`  ${s.key} = ${JSON.stringify(JSON.parse(s.value), null, 2)}`); }
  catch { console.log(`  ${s.key} = ${s.value}`); }
});
db.close();
