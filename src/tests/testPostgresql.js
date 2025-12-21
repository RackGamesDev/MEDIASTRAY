import { Client } from 'pg';
const testSql = async () => {

  const client = new Client(process.env.DATABASE_URL);

  try {
    console.log('Attempting to connect to PostgreSQL...');
    await client.connect();
    console.log('Connected to PostgreSQL successfully!');
    const result = await client.query('SELECT version() as postgres_version');
    console.log('PostgreSQL Version:', result.rows[0].postgres_version);
    const rows = await client.query('SELECT \'Hello from Node.js!\' as message');
    console.log('POSTGRESQL PERFECTO Test query result:', rows.rows[0].message);
    await client.end();
    console.log('Connection closed.');

  } catch (error) {
    console.error('Connection failed or query error:', error.message);
    if (error.stack) console.error(error.stack);
  }
}
export {testSql}