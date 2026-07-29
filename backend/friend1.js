const cypherQuery = `
      MATCH (a:Person)-[:FRIEND]->(b:Person)
      WHERE a.name = ${name}
      RETURN b.name AS name`;

const cypherQuery = `
      MATCH (a:Person)-[:FRIEND]->(b:Person)
      WHERE a.name = ${name}
      RETURN b.name AS name`;

async function getFriend1(req, res, next){
    try{
        const result1 = await driver.executeQuery(cypherQuery, { name: req.body.name });
        const friends1 = [];
        const friends2 = [];
        const friends3 = [];
        for(const record1 of result1.records){
            friends.push(record1.get('name'));
            const result2 = await driver.executeQuery(cypherQuery, {name: record1.get('name')});
            for(const record2 of result2.records){
                friends1.push(record2.get('name'));
                const result3 = await driver.executeQuery(cypherQuery, {name: record2.get('name')});
                for(const record3 of result3.records){
                    friends3.push(record3.get('name'));
                }
            }
        }  
        res.status(200).json({friends1, friends2, friends3});
    } catch(err){
        res.status(500).json({error:"Name not found"});
    }
} 

module.exports = getFriend1;