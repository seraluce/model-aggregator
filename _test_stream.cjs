const http = require('http');
const key = 'freellmapi-3648db3ad43a7d0c4e118b97315c700a64816112b968ab7b';

async function testStream(model) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: '说你好' }],
      max_tokens: 20,
      stream: true
    });
    const req = http.request({
      hostname: 'localhost', port: 3001, path: '/v1/chat/completions',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let body = '';
      let chunks = 0;
      res.on('data', c => { body += c; chunks++; });
      res.on('end', () => {
        console.log(`${model}: HTTP ${res.statusCode}, chunks=${chunks}`);
        // Show last few lines
        const lines = body.split('\n').filter(l => l.trim());
        const lastLines = lines.slice(-3);
        lastLines.forEach(l => console.log(`  ${l.substring(0, 120)}`));
        resolve();
      });
    });
    req.on('error', e => { console.log(`${model}: REQUEST ERROR ${e.message}`); resolve(); });
    req.write(data);
    req.end();
  });
}

(async () => {
  console.log('=== Testing streaming ===');
  await testStream('custom:glm-5v-turbo');
  await testStream('glm-5v-turbo');
})();
