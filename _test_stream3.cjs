const http = require('http');
const key = 'freellmapi-3648db3ad43a7d0c4e118b97315c700a64816112b968ab7b';

function testStreamDebug(model) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ model, messages: [{ role: 'user', content: '说你好' }], max_tokens: 20, stream: true });
    const req = http.request({
      hostname: 'localhost', port: 3001, path: '/v1/chat/completions',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let body = '';
      console.log(`${model}: HTTP ${res.statusCode}, headers=${JSON.stringify(res.headers)}`);
      res.on('data', c => body += c);
      res.on('end', () => {
        // Show all non-empty lines
        const lines = body.split('\n').filter(l => l.trim());
        if (lines.length > 0) {
          console.log(`  lines:`);
          lines.forEach((l, i) => console.log(`    ${i}: ${l.substring(0, 200)}`));
        } else {
          console.log(`  (empty response body)`);
        }
        resolve();
      });
    });
    req.write(data);
    req.end();
  });
}

(async () => {
  console.log('=== auto streaming ===');
  await testStreamDebug('auto');
  console.log('\n=== glm-5v-turbo streaming ===');
  await testStreamDebug('glm-5v-turbo');
})();
