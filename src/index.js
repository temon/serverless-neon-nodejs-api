const serverless = require("serverless-http");
const express = require("express");
const { neon } = require("@neondatabase/serverless");
const app = express();

async function dbClient(){
  return neon(process.env.DATABASE_URL);
}

async function indexRoute(req, res, next){
  let db = await dbClient()
  const [result] = await db`select now();`
  return res.status(200).json({
    message: "Hello from root!",
    nowData: result.now
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
