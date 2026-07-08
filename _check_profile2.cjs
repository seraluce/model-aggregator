const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
// Check key_id=2
const key = db.prepare("SELECT * FROM api_keys WHERE id = 2").all();
console.log('Key 2:', JSON.stringify(key, null, 2));
// Get profile models correctly
const pp = db.prepare("SELECT * FROM profiles WHERE name = 'Default'").all();
if (pp.length > 0) {
  const pm = db.prepare("SELECT m.model_id, m.platform, m.display_name, m.supports_vision, m.id, pm.priority FROM profile_models pm JOIN models m ON pm.model_id = m.id WHERE pm.profile_id = ? ORDER BY pm.priority").all(pp[0].id);
  console.log('\nModels in Default profile:');
  pm.forEach(m => console.log(`  [${m.platform}] ${m.model_id} prio=${m.priority} vision=${m.supports_vision}`));
}
db.close();
