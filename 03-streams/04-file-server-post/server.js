const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream')

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
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {
        flags: 'wx'
      });
      const limitSizeStream = new LimitSizeStream({limit: 1024});
      req.pipe(limitSizeStream).pipe(writeStream);

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File saved');
        return;
      })

      limitSizeStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('File size is too big');
          writeStream.destroy();

          fs.unlink(filepath, err => {});
          return;
        }
      })

      writeStream.on('error', (error) => {
        console.log('error', error);
        if (error.code === "EEXIST") {
          writeStream.destroy();
          res.statusCode = 409;
          res.end('File already exists');
          return;
        }

        writeStream.destroy();
        res.statusCode = 500;
        res.end('Something goes wrong on a server')
        return;

      })

      req.on('abort',()=> {
        writeStream.destroy();
        limitSizeStream.destroy();
        fs.unlink(filepath, err => {});
        console.log("client request is aborted")
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
