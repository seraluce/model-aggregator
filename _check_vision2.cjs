const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const now = Date.now();
const cd = db.prepare("SELECT * FROM rate_limit_cooldowns").all();
cd.forEach(c => {
  const expired = now >= c.expires_at_ms;
  console.log(`${c.platform}/${c.model_id}: expires_at=${new Date(c.expires_at_ms).toISOString()}, now=${new Date(now).toISOString()}, expired=${expired}`);
});
// Check which vision models have healthy keys and are in profile
const pp = db.prepare("SELECT * FROM profiles WHERE name = 'Default'").all();
if (pp.length > 0) {
  const vision = db.prepare(`
    SELECT m.model_id, m.platform, m.display_name, ak.status as key_status, ak.enabled as key_enabled
    FROM profile_models pm
    JOIN models m ON pm.model_db_id = m.id
    LEFT JOIN api_keys ak ON m.platform = ak.platform
    WHERE pm.profile_id = ? AND m.supports_vision = 1
  `).all(pp[0].id);
  console.log('\nVision models in Default profile:');
  vision.forEach(v => console.log(`  [${v.platform}] ${v.model_id} key=${v.key_status}/${v.key_enabled}`));
}
db.close();
