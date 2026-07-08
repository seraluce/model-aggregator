const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const pp = db.prepare("SELECT * FROM profiles WHERE name = 'Default'").all();
if (pp.length > 0) {
  // Get all profile models with key status
  const pm = db.prepare(`
    SELECT m.model_id, m.platform, m.display_name, pm.priority, m.key_id, ak.status as key_status, ak.enabled as key_enabled
    FROM profile_models pm
    JOIN models m ON pm.model_db_id = m.id
    LEFT JOIN api_keys ak ON m.key_id = ak.id
    WHERE pm.profile_id = ? AND pm.enabled = 1
    ORDER BY pm.priority
  `).all(pp[0].id);
  console.log('Profile models with key status:');
  let i = 0;
  pm.forEach(m => {
    i++;
    const hasKey = m.key_id ? `${m.key_id}(${m.key_status}/${m.key_enabled})` : 'NO KEY';
    const marker = i <= 4 ? ' <- top4' : '';
    console.log(`  ${i}. [${m.platform}] ${m.model_id} key=${hasKey}${marker}`);
  });
}
db.close();
