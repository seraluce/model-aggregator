const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const fc = db.prepare("SELECT model_db_id, priority, enabled FROM fallback_config ORDER BY priority").all();
console.log(`Fallback config has ${fc.length} entries`);
if (fc.length > 0) {
  fc.forEach((f, i) => {
    const m = db.prepare("SELECT id, model_id, platform, display_name FROM models WHERE id = ?").get(f.model_db_id);
    if (m) console.log(`  ${i+1}. [${m.platform}] ${m.model_id} enabled=${f.enabled}`);
    else console.log(`  ${i+1}. id=${f.model_db_id} enabled=${f.enabled} (NOT FOUND)`);
  });
}
// Also check if glm-5v-turbo is in the chain
const g5v = db.prepare("SELECT id, model_id FROM models WHERE model_id = 'glm-5v-turbo'").get();
console.log(`\nglm-5v-turbo id=${g5v?.id}`);
const inFc = db.prepare("SELECT * FROM fallback_config WHERE model_db_id = ?").get(g5v?.id);
console.log(`in fallback_config: ${inFc ? JSON.stringify(inFc) : 'NO'}`);
db.close();
