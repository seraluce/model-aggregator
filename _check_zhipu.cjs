const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
// Check zhipu key
const zKey = db.prepare("SELECT * FROM api_keys WHERE platform = 'zhipu'").all();
console.log('Zhipu keys:', JSON.stringify(zKey, null, 2));
// Check glm-4.6v-flash
const glm = db.prepare("SELECT id, model_id, platform, display_name, enabled, supports_vision FROM models WHERE model_id = 'glm-4.6v-flash'").all();
console.log('\nglm-4.6v-flash:', JSON.stringify(glm, null, 2));
// Check cooldowns
const cd = db.prepare("SELECT * FROM rate_limit_cooldowns WHERE platform = 'zhipu'").all();
console.log('\nZhipu cooldowns:', JSON.stringify(cd, null, 2));
// Check quota for zhipu
const q = db.prepare("SELECT * FROM provider_quota_state WHERE platform = 'zhipu'").all();
console.log('\nZhipu quota:', JSON.stringify(q, null, 2));
db.close();
