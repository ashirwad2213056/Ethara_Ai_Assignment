import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: "postgresql://postgres:ashirwad@localhost:5050/splitwise"
});

async function test() {
  try {
    await client.connect();
    console.log("Successfully connected to the database");
    await client.end();
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
  }
}

test();
