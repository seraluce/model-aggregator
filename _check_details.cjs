const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const all = db.prepare("SELECT * FROM rate_limit_cooldowns").all();
console.log('All cooldowns:', JSON.stringify(all, null, 2));
// Also check the actual model and key relationship
const models = db.prepare("SELECT id, model_id, platform, key_id FROM models WHERE model_id LIKE '%glm-5v%' OR model_id LIKE '%glm-5-turbo%'").all();
console.log('\nglm-5 models:', JSON.stringify(models, null, 2));
// Check how many requests were made
const recent = db.prepare("SELECT platform, model_id, COUNT(*) as cnt FROM request_log WHERE created_at > datetime('now', '-1 hour') GROUP BY platform, model_id ORDER BY cnt DESC LIMIT 10").all();
console.log('\nRecent requests:', JSON.stringify(recent, null, 2));
db.close();
