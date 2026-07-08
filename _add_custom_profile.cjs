const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');

// Get all custom platform models with enabled=1
const customModels = db.prepare("SELECT id, model_id, platform, display_name FROM models WHERE platform = 'custom' AND enabled = 1 ORDER BY id").all();
console.log('Custom models found:', customModels.length);
console.log(JSON.stringify(customModels, null, 2));

// Get existing profile_models for Default profile (id=1)
const existing = db.prepare('SELECT model_db_id FROM profile_models WHERE profile_id = 1').all();
const existingIds = new Set(existing.map(r => r.model_db_id));
console.log('Existing profile model IDs:', [...existingIds].sort((a,b)=>a-b));

// Get max priority in profile
const maxPrio = db.prepare('SELECT COALESCE(MAX(priority), 0) AS m FROM profile_models WHERE profile_id = 1').get();
console.log('Max priority:', maxPrio.m);

// Check which custom models are already in profile_models
const alreadyIn = customModels.filter(m => existingIds.has(m.id));
const toAdd = customModels.filter(m => !existingIds.has(m.id));
console.log('Already in profile:', alreadyIn.length, alreadyIn.map(m => m.model_id));
console.log('To add:', toAdd.length, toAdd.map(m => m.model_id));

// Add missing custom models to the Default profile
if (toAdd.length > 0) {
  const insert = db.prepare('INSERT INTO profile_models (profile_id, model_db_id, priority, enabled) VALUES (1, ?, ?, 1)');
  const addAll = db.transaction(() => {
    let prio = maxPrio.m;
    for (const m of toAdd) {
      prio++;
      console.log(`Adding model ${m.model_id} (id=${m.id}) at priority ${prio}`);
      insert.run(m.id, prio);
    }
  });
  addAll();
  console.log('Done! Added', toAdd.length, 'models to profile');
} else {
  console.log('All custom models already in profile');
}

// Verify
const verify = db.prepare(`
  SELECT pm.model_db_id, m.model_id, m.platform, m.display_name
  FROM profile_models pm
  JOIN models m ON m.id = pm.model_db_id
  WHERE pm.profile_id = 1 AND m.platform = 'custom'
  ORDER BY pm.priority
`).all();
console.log('\nCustom models in profile after update:');
console.log(JSON.stringify(verify, null, 2));

db.close();
