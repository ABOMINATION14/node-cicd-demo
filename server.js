
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CI/CD Demo</title>
    </head>
    <body style="font-family:Arial;text-align:center;margin-top:100px;">
      <h1>CI/CD Pipeline Successfully Deployed!</h1>
      <h2>GitHub + Jenkins + Docker + Kubernetes</h2>
      <p>Application is running successfully.</p>
    </body>
    </html>
  `);
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Application started on port 3000');
});
