const { neon, neonConfig} = require("@neondatabase/serverless");
const secrets = require("../lib/secrets");
const {drizzle} = require('drizzle-orm/neon-http')
async function getDBClient(){
    const dbUrl = await secrets.getDatabaseUrl();
    return neon(dbUrl);
}

async function getDrizzleClient(){
    const neonClient = await getDBClient();
    return drizzle(neonClient);
}

module.exports = {
    getDBClient,
    getDrizzleClient
}
