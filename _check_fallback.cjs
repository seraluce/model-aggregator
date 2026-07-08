const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
// Check fallback_config
const fc = db.prepare("SELECT model_db_id, enabled FROM fallback_config ORDER BY priority").all();
console.log('Fallback config entries:');
const modelIds = fc.map(f => f.model_db_id);
if (modelIds.length > 0) {
  const placeholders = modelIds.map(() => '?').join(',');
  const models = db.prepare(`SELECT id, model_id, platform, display_name FROM models WHERE id IN (${placeholders})`).all();
  const modelMap = Object.fromEntries(models.map(m => [m.id, m]));
  fc.forEach((f, i) => {
    const m = modelMap[f.model_db_id];
    if (m) console.log(`  ${i+1}. [${m.platform}] ${m.model_id} (${m.display_name}) enabled=${f.enabled}`);
    else console.log(`  ${i+1}. id=${f.model_db_id} enabled=${f.enabled} (NOT FOUND)`);
  });
} else {
  console.log('  (empty)');
}
db.close();
