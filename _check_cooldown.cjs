const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
const cd = db.prepare("SELECT platform, model_id, expires_at_ms, datetime(expires_at_ms/1000, 'unixepoch') as expires_at FROM rate_limit_cooldowns ORDER BY expires_at_ms").all();
const now = Date.now();
console.log(`Current time: ${new Date(now).toISOString()}`);
cd.forEach(c => {
  const remaining = Math.max(0, Math.ceil((c.expires_at_ms - now) / 60000));
  console.log(`${c.platform}/${c.model_id}: expires ${c.expires_at} (${remaining} min remaining)`);
});
// Also test a text-only request to see if auto still works
db.close();
