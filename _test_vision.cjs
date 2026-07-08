const http = require('http');
const key = 'freellmapi-3648db3ad43a7d0c4e118b97315c700a64816112b968ab7b';
const fs = require('fs');
const path = require('path');

// Create a small test PNG (1x1 pixel red dot, base64)
const tinyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==';

async function testVision(model) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: model,
      messages: [{ 
        role: 'user', 
        content: [
          { type: 'text', text: '描述这个图片内容' },
          { type: 'image_url', image_url: { url: `data:image/png;base64,${tinyPngBase64}` } }
        ]
      }],
      max_tokens: 50
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
          console.log(`${model}: HTTP ${res.statusCode}`);
          if (j.error) console.log(`  ERROR: ${j.error.message}`);
          else if (j.choices) console.log(`  OK: "${j.choices[0]?.message?.content?.substring(0, 120)}"`);
          else console.log(`  ${JSON.stringify(j).substring(0, 200)}`);
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
  console.log('=== Testing vision models ===');
  await testVision('custom:glm-5v-turbo');
  await testVision('glm-5v-turbo');
  await testVision('auto');
})();
