const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');

// Get active chain entries for custom and zhipu platforms
const chain = db.prepare(`
  SELECT fc.id, fc.enabled as fc_enabled, fc.model_db_id, fc.priority,
         m.id as mid, m.model_id, m.platform, m.display_name, m.enabled as m_enabled
  FROM fallback_config fc
  JOIN models m ON fc.model_db_id = m.id
  WHERE m.platform IN ('custom', 'zhipu')
  ORDER BY m.platform, fc.priority
`).all();

console.log('Chain entries for custom/zhipu:');
console.log(JSON.stringify(chain, null, 2));
console.log('\nTotal entries:', chain.length);

// Check canUseProvider / rate limit state
const cooldowns = db.prepare('SELECT * FROM rate_limit_cooldowns').all();
console.log('\nCooldowns:', JSON.stringify(cooldowns, null, 2));

const quota = db.prepare("SELECT * FROM provider_quota_state WHERE platform IN ('custom','zhipu')").all();
console.log('\nQuota state:', JSON.stringify(quota, null, 2));

// Count total enabled fallback entries
const totalEnabled = db.prepare('SELECT COUNT(*) as cnt FROM fallback_config WHERE enabled = 1').get();
console.log('\nTotal enabled in fallback:', totalEnabled.cnt);

// Check default fusion config
const fusionSettings = db.prepare("SELECT * FROM settings WHERE key = 'fusion_default'").all();
console.log('\nFusion default settings:', JSON.stringify(fusionSettings, null, 2));

db.close();
