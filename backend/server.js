const neo4j = require('neo4j-driver');
const dotenv = require('dotenv').config({quiet:true});
require('dns').setServers(['8.8.8.8', '8.8.4.4']);  // Local ISP DNS resolvers might not be capable of handling SRV records. Hence, using Google's DNS resolver (8.8.8.8) or (8.8.4.4)
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

console.log("abc");

const URI = process.env.URI;
const userName = process.env.userName;
const password = process.env.Password;
let driver = neo4j.driver(URI, neo4j.auth.basic(userName,password));
driver.getServerInfo()
    .then(()=>app.listen(PORT, ()=> console.log("Database connected and server has launched.")))
    .catch((err) => {console.log(`Connection error\n${err}\nCause: ${err.cause}`)
                        async () => {
                        await driver.close();
                        }
                    });  

const cypherQuery = `
      MATCH (a:Person)-[:FRIEND]->(b:Person)
      WHERE a.name = ${name}
      RETURN b.name AS name`;

async function getFriend1(){
    const result = await driver.executeQuery(cypherQuery, { name: "Chimamanda Ngozi Adichie" })  
} 
  
