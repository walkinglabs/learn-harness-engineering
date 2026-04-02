const https = require('https');
https.get('https://raw.githubusercontent.com/anthropics/anthropic-cookbook/main/images/logo.svg', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
