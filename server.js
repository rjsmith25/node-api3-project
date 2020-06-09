const express = require("express");

const server = express();

// log incoming requests
server.use(logger);

// Parse incoming post request
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

module.exports = server;
