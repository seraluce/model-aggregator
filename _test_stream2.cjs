const http = require('http');
const key = 'freellmapi-3648db3ad43a7d0c4e118b97315c700a64816112b968ab7b';

function testStream(model) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ model, messages: [{ role: 'user', content: '说你好' }], max_tokens: 20, stream: true });
    const req = http.request({
      hostname: 'localhost', port: 3001, path: '/v1/chat/completions',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const firstLine = body.split('\n').find(l => l.startsWith('data: {"choices"'));
        const errorLine = body.split('\n').find(l => l.includes('error'));
        console.log(`${model}: HTTP ${res.statusCode} ${res.statusCode === 200 ? 'FIRST: ' + (firstLine ? firstLine.substring(0, 150) : 'no data') : 'ERROR: ' + (errorLine ? errorLine.substring(0, 150) : body.substring(0, 150))}`);
        resolve();
      });
    });
    req.write(data);
    req.end();
  });
}

(async () => {
  // Wait for cooldowns to clear
  await new Promise(r => setTimeout(r, 15000));
  console.log('=== Testing streaming auto ===');
  await testStream('auto');
  console.log('=== Testing streaming glm-5v-turbo ===');
  await testStream('glm-5v-turbo');
})();
