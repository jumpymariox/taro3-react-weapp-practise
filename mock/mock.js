const jsonServer = require("json-server");
const https = require("https");
const path = require("path");
const fs = require("fs");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const keyFile = path.join(__dirname, "./ssl/server.key");
const certFile = path.join(__dirname, "./ssl/server.crt");

https
  .createServer(
    {
      key: fs.readFileSync(keyFile),
      cert: fs.readFileSync(certFile),
    },
    server
  )
  .listen(3001, () => {
    console.log("Go to https://127.0.0.1:3001/");
  });
