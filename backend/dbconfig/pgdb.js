const { Pool } = require('pg');

async function user_client() { // default
  try {
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'your_database',
      password: 'your_password',
      port: 5432,
      idleTimeoutMillis: 80000,
      connectionTimeoutMillis: 10000,
    });
    console.log('Connected to the database successfully.');
    return pool;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error; // Optionally rethrow the error after logging it
  }

}
module.exports = { user_client };

