const { neon, neonConfig} = require("@neondatabase/serverless");
const secrets = require("../lib/secrets");
async function getDBClient(){
    const dbUrl = await secrets.getDatabaseUrl();

    neonConfig.fetchConnectionCache = true;
    return neon(dbUrl);
}

module.exports = {
    getDBClient
}
