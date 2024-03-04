const secrets = require('../lib/secrets')
const schemas = require('../db/schemas')
const {migrate} = require('drizzle-orm/postgres-js/migrator')

require('dotenv').config()
const {Pool, neonConfig} = require("@neondatabase/serverless");
const ws = require('ws');
const {drizzle} = require('drizzle-orm/neon-serverless')

async function migrationHandler() {
    const dbUrl = await secrets.getDatabaseUrl()

    if (!dbUrl) {
        throw new Error('Database URL not found')
    }

    neonConfig.webSocketConstructor = ws
    const pool = new Pool({connectionString: dbUrl})
    pool.on('error', err => console.log(err))

    const client = await pool.connect()

    try {
        await client.query('BEGIN');
        const db = await drizzle(client, {schemas})

        await migrate(db, {migrationsFolder: 'src/migrations'})

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err
    } finally {
        client.release()
    }
    await pool.end()
}

if (require.main === module) {
    console.log('Migrating database...')
    migrationHandler().then((val) => {
        console.log('Database migrated')
        process.exit(0)
    }).catch((err) => {
        console.error('Error migrating database')
        console.error(err)
        process.exit(1)
    })
}
