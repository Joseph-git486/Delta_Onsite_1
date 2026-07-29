const neo4j = require('neo4j-driver');
require('dotenv').config();
console.log(process.env.NEO4J_URI);

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function verifyConnection() {
  try {
    await driver.verifyConnectivity();
    console.log('Neo4j connection established');
  } catch (err) {
    console.error('Neo4j connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { driver, verifyConnection };