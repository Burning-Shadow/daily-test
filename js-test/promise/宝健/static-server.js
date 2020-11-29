const http = require('http');
const url = require('url');
const path = require('path');
const mime = require('mime');
const fs = require('fs');

const readStaticFile = (filePathname) => {
  return new Promise(filePathname, (resolve, reject) => {
    fs.readFile((err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  });
}

const server = http.createServer(async (req, res) => {
  const urlObj = url.parse(req.url);
  const urlPathname = urlObj.pathname;
  const filePathname = path.join(__dirname, '/public', urlPathname);

  const ext = path.parse(urlPathname).ext;
  const mimeType = mime.getType(ext);

  const fileResult = await readStaticFile(filePathname);

  res.writeHead(200, { 'Content-Type': mimeType });
  res.write(fileResult);
  res.end();
});

server.listen(3000, () => {
  console.log('We are now listening at 3000 PORT');
})
