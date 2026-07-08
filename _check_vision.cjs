const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const vision = db.prepare("SELECT id, model_id, platform, display_name, supports_vision FROM models WHERE supports_vision = 1 AND enabled = 1 ORDER BY platform").all();
console.log('Vision-enabled models:');
vision.forEach(m => console.log(`  [${m.platform}] ${m.model_id} (${m.display_name})`));
console.log('\nTotal:', vision.length);
db.close();
