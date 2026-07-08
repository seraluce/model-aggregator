const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
// Enable vision on glm-5v-turbo (custom model, id=160)
const result = db.prepare("UPDATE models SET supports_vision = 1 WHERE id = 160 AND model_id = 'glm-5v-turbo'");
const info = result.run();
console.log('glm-5v-turbo vision update:', info.changes > 0 ? 'OK' : 'FAILED');
// Verify
const row = db.prepare("SELECT id, model_id, supports_vision FROM models WHERE model_id = 'glm-5v-turbo'").get();
console.log('glm-5v-turbo now:', JSON.stringify(row));
db.close();
