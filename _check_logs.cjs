const Database = require('better-sqlite3');
const db = new Database('server/data/freeapi.db');
// Check recent request logs
try {
  const logs = db.prepare(`
    SELECT requested_model, platform, model_id, status, error, created_at 
    FROM request_log 
    WHERE created_at > datetime('now', '-10 minutes')
    ORDER BY created_at DESC 
    LIMIT 20
  `).all();
  if (logs.length > 0) {
    console.log('Recent requests:');
    logs.forEach(l => console.log(`  ${l.created_at} | model=${l.requested_model} | route=${l.platform}/${l.model_id} | status=${l.status} | ${l.error || ''}`));
  } else {
    console.log('No recent requests in last 10 minutes');
    // Try a broader search
    const count = db.prepare("SELECT COUNT(*) as cnt FROM request_log").get();
    console.log(`Total request_log entries: ${count.cnt}`);
  }
} catch(e) {
  console.log('request_log table not found or error:', e.message);
  // Try request_logs (plural)
  try {
    const logs = db.prepare("SELECT COUNT(*) as cnt FROM request_logs").get();
    console.log(`request_logs total: ${logs.cnt}`);
  } catch(e2) {
    console.log('No request log table found');
  }
}
db.close();
