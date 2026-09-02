const { Pool } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
let pool = null;
let schemaReadyPromise = null;
function getPool() { if (!DATABASE_URL) throw new Error('DATABASE_URL is not set.'); if (!pool) pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } }); return pool; }
async function ensureSchema() { if (!schemaReadyPromise) { schemaReadyPromise = getPool().query(`CREATE TABLE IF NOT EXISTS group_settings (jid TEXT NOT NULL, key TEXT NOT NULL, value JSONB NOT NULL, PRIMARY KEY (jid, key));`).then(() => { console.log('✅ Connected to PostgreSQL'); }).catch((err) => { schemaReadyPromise = null; throw err; }); } return schemaReadyPromise; }
async function query(text, params) { await ensureSchema(); return getPool().query(text, params); }
module.exports = { query, ensureSchema };
