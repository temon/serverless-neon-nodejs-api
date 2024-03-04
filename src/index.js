const serverless = require("serverless-http");
const express = require("express");
const { getDBClient } = require("./db/clients");


const app = express();

async function indexRoute(req, res, next){
  let db = await getDBClient()
  const now = Date.now();
  const [dbResult] = await db`select now();`
  const timeDiff = (dbResult.now.getTime()-now)/1000;
  return res.status(200).json({
    message: "Hello from root!",
    timeDiff: timeDiff
  });

}

app.get("/", indexRoute);

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
