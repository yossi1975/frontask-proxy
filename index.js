const express = require('express');
const request = require('request');
const app = express();
const PORT = 3000;

app.get('/proxy', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing URL');
  }

  request(
    {
      url: targetUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    },
    (error, response, body) => {
      if (error) return res.status(500).send('Error fetching page');

      // הסר את ההדרים שחוסמים IFRAME
      const filteredHeaders = { ...response.headers };
      delete filteredHeaders['x-frame-options'];
      delete filteredHeaders['content-security-policy'];

      res.set(filteredHeaders);
      res.send(body);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}/proxy`);
});
