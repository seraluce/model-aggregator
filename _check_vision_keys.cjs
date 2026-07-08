const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
// Check which models in the profile support vision AND have keys
const pp = db.prepare("SELECT * FROM profiles WHERE name = 'Default'").all();
if (pp.length > 0) {
  const visionModels = db.prepare(`
    SELECT m.model_id, m.platform, m.display_name, m.key_id, m.supports_vision, ak.status key_status
    FROM profile_models pm
    JOIN models m ON pm.model_db_id = m.id
    LEFT JOIN api_keys ak ON m.key_id = ak.id
    WHERE pm.profile_id = ? AND pm.enabled = 1 AND m.supports_vision = 1
    ORDER BY pm.priority
  `).all(pp[0].id);
  console.log('Vision models with keys in profile:');
  visionModels.forEach(m => {
    const hasKey = m.key_id ? `key=${m.key_id}(${m.key_status})` : 'NO KEY';
    console.log(`  [${m.platform}] ${m.model_id} ${hasKey} vision=${m.supports_vision}`);
  });
}
db.close();
