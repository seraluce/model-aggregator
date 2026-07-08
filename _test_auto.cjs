const http = require('http');
const key = 'freellmapi-3648db3ad43a7d0c4e118b97315c700a64816112b968ab7b';

function testModel(model) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: '说"你好"两个字' }],
      max_tokens: 20
    });
    const req = http.request({
      hostname: 'localhost', port: 3001, path: '/v1/chat/completions',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (j.error) console.log(`${model}: HTTP ${res.statusCode} ERROR: ${j.error.message}`);
          else if (j.choices) console.log(`${model}: HTTP ${res.statusCode} OK: "${j.choices[0]?.message?.content?.substring(0, 80)}"`);
          else console.log(`${model}: HTTP ${res.statusCode} ${JSON.stringify(j).substring(0, 200)}`);
        } catch(e) { console.log(`${model}: PARSE ERROR ${res.statusCode} ${body.substring(0, 200)}`); }
        resolve();
      });
    });
    req.on('error', e => { console.log(`${model}: REQUEST ERROR ${e.message}`); resolve(); });
    req.write(data);
    req.end();
  });
}

(async () => {
  console.log('=== Testing auto ===');
  await testModel('auto');
  console.log('=== Testing custom:glm-5v-turbo ===');
  await testModel('custom:glm-5v-turbo');
})();
