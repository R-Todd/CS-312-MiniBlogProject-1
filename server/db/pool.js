// /server/db/pool.js
import pkg from 'pg';
const { Pool } = pkg;

// COPIED FROM INDEX.JS 

// set pool const to be called in auth.js 
// loads environment variables from .env file

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

export default pool;


