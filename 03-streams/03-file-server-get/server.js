const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.indexOf('/') > 0) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
        const readStream = fs.createReadStream(filepath,{encoding: 'utf-8'});
        readStream.pipe(res);

        readStream.on('error', (error) => {
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
            res.end("File doesn't exist");
            return;
          }

          res.statusCode = 500;
          res.end('Something goes wrong on server')
          return;
        })

        req.on('abort',()=> {
          readStream.destroy();
          console.log("client request is aborted")
        });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
