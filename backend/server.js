const express = require('express');
require('dotenv').config();
const cors = require('cors');
const authRoute = require('./routes/auth');
const {verifyConnection} = require('./DB/neo4j');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoute);

const PORT = process.env.PORT;
verifyConnection()
    .then( ()=> app.listen(PORT, console.log(`Server started running on PORT${PORT}`)) )
    // no need of catch(err) block since the function verifyConnection itself exist the process in case of error.