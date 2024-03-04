const serverless = require("serverless-http");
const express = require("express");
const { getDBClient } = require("./db/clients");
const crud = require("./db/crud");


const app = express();

app.use(express.json());

async function indexRoute(req, res, next){
  let db = await getDBClient()
  const now = Date.now();
  const [dbResult] = await db`select now();`
  const timeDiff = (dbResult.now.getTime()-now)/1000;
  return res.status(200).json({
    message: "Connected to Neon database!",
    timeDiff: timeDiff
  });

}

app.get("/", indexRoute);

app.get("/leads", async (req, res, next) => {
    const results = await crud.getLeads();
    return res.status(200).json({
      results
    });
});

app.post("/leads", async (req, res, next) => {
  const data = await req.body;
  const result = await crud.createLead(data)
  return res.status(200).json({
    message: "Lead created!",
    results: result,
  });
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
