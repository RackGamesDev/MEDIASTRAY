import { Client } from 'pg';
const testSql = async () => {
    const config = {
    host: 'your-custom-ip',           // e.g., '192.168.1.100'
    port: 5432,                       // default PostgreSQL port
    database: 'your-database-name',   // e.g., 'myapp_db'
    user: 'your-username',            // e.g., 'postgres'
    password: 'your-password',        // e.g., 'secret123'
    // Optional: specify SSL if needed
    // ssl: true,
  };

  const client = new Client(process.env.DATABASE_URL);

  try {
    console.log('✅ Attempting to connect to PostgreSQL...');

    await client.connect();

    console.log('✅ Connected to PostgreSQL successfully!');

    // Test: Run a simple query
    const result = await client.query('SELECT version() as postgres_version');
    console.log('PostgreSQL Version:', result.rows[0].postgres_version);

    // Optional: Test a simple SELECT
    const rows = await client.query('SELECT \'Hello from Node.js!\' as message');
    console.log('Test query result:', rows.rows[0].message);

    // Clean up
    await client.end();
    console.log('✅ Connection closed.');

  } catch (error) {
    console.error('❌ Connection failed or query error:', error.message);
    if (error.stack) console.error(error.stack);
  }
}
export {testSql}