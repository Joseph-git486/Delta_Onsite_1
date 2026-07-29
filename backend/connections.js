const driver = require('./DB/neo4j');

async function getConnections(req,res,next){
    try{
        const {records, summary} = await driver.executeQuery(
            `MATCH path = (me:User {userId:${userId}})-[:CONNECTED_TO*1..3 {status:ACCEPTED}]->(other:User)
            WHERE other <> me
            WITH other, min(length(path)) AS degree
            RETURN other.userName AS userName, degree
            ORDER BY degree`,
            {userId: req.user.userId},
            {database:'neo4j'}
        )
        const {record1, summary1} = await driver.executeQuery(
            `MATCH (me:User {userId:${userId}})
            RETURN me.userName as userName`,
            {userId: req.user.userId},
            {database:'neo4j'}
        )
        const friend1 =[];
        const friend2 =[];
        const friend3 =[];
        for(const record of records){
            if(record.get('degree')===1){
                friend1.push(record.get('name'));
            }
            else if(record.get('degree')===2){
                friend2.push(record.get('name'));
            }
            else if(record.get('degree')===3){
                friend3.push(record.get('name'));
            }
        }
        res.status(200).json({friend1, friend2, friend3, userName: record1.get('userName')});
    }catch(err){
        res.status(500).json({message:"Request failed"});
    }
    
}

async function getAllUsers(){
    try{
        const {records, summary} = await driver.executeQuery(
            `MATCH (a:User)
            WHERE a.userId <> ${userId}
            RETURN a.userName as userName`,
            {userId: req.user.userId},
            {database:'neo4j'}
        )
        const users = [];
        for(const record of records){
            users.push(record.get('userName'));
        }
        res.status(200).json({users});
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}

module.exports = {getConnections, getAllUsers};