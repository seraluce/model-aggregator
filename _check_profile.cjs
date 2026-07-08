const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
// Check cooldown expiry
const cd = db.prepare("SELECT platform, model_id, expires_at_ms, datetime(expires_at_ms/1000, 'unixepoch') as expires_at FROM rate_limit_cooldowns").all();
console.log('Cooldowns:');
cd.forEach(c => console.log(`  ${c.platform}/${c.model_id} expires at ${c.expires_at} (${c.expires_at_ms})`));
// Check glm-5v-turbo vision
const glm5 = db.prepare("SELECT * FROM models WHERE model_id = 'glm-5v-turbo'").all();
console.log('\nglm-5v-turbo:', JSON.stringify(glm5, null, 2));
// Check if glm-4.6v-flash is in Default profile
const pp = db.prepare("SELECT * FROM profiles WHERE name = 'Default'").all();
if (pp.length > 0) {
  const pm = db.prepare("SELECT m.model_id, m.platform, m.display_name, pm.priority FROM profile_models pm JOIN models m ON pm.model_id = m.id WHERE pm.profile_id = ? ORDER BY pm.priority").all(pp[0].id);
  console.log('\nModels in Default profile:');
  pm.forEach(m => console.log(`  [${m.platform}] ${m.model_id} (${m.display_name}) prio=${m.priority}`));
}
db.close();
