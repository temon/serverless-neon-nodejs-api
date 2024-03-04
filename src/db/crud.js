const client = require('./clients');
const schemas = require('./schemas');
const {desc} = require("drizzle-orm");

async function createLead({email}) {
    const db = await client.getDrizzleClient();
    console.log(email)
    return db.insert(schemas.LeadTable).values({
        email: email
    }).returning({timestamp: schemas.LeadTable.createdAt});
}

async function getLeads() {
    const db = await client.getDrizzleClient();
    return db.select().from(schemas.LeadTable)
        .orderBy(desc(schemas.LeadTable.createdAt))
        .limit(10);
}

module.exports = {
    createLead,
    getLeads
}
