const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');

// Check what profile_models contains for custom platform
const profileCustom = db.prepare(`
  SELECT pm.*, m.model_id, m.display_name, m.platform
  FROM profile_models pm
  JOIN models m ON m.id = pm.model_db_id
  WHERE pm.profile_id = 1 AND m.platform = 'custom'
  ORDER BY pm.priority
`).all();

console.log('Custom models in profile (profile_id=1):');
console.log('Count:', profileCustom.length);
profileCustom.forEach(p => console.log(`  ${p.model_db_id}: ${p.model_id} (${p.display_name}) enabled=${p.enabled} priority=${p.priority}`));

// Check if active profile setting exists
const active = db.prepare("SELECT * FROM settings WHERE key = 'active_profile_id'").all();
console.log('\nActive profile setting:', JSON.stringify(active));

// Check total profile_models count
const total = db.prepare('SELECT COUNT(*) as cnt FROM profile_models WHERE profile_id = 1').get();
console.log('Total profile models:', total.cnt);

// Check models in fallback_config for custom
const fbCustom = db.prepare(`
  SELECT fc.*, m.model_id, m.display_name
  FROM fallback_config fc
  JOIN models m ON m.id = fc.model_db_id
  WHERE m.platform = 'custom' AND fc.enabled = 1
  ORDER BY fc.priority
`).all();
console.log('\nCustom models in fallback_config with enabled=1:');
console.log('Count:', fbCustom.length);

// What are the group keys for custom models?
const groups = db.prepare(`
  SELECT m.id, m.model_id, m.display_name,
    LOWER(TRIM(REPLACE(REPLACE(REPLACE(m.display_name, '-', ' '), '_', ' '), '  ', ' '))) as normalized_key
  FROM models m
  WHERE m.platform = 'custom' AND m.enabled = 1
  ORDER BY m.id
`).all();
console.log('\nCustom model normalized keys:');
groups.forEach(g => console.log(`  ${g.id}: "${g.model_id}" -> normalized: "${g.normalized_key}"`));

db.close();
