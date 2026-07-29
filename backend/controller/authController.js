const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {driver} = require('../DB/neo4j');

async function signup(req, res, next){
    try {
        const userName = req.body.userName;
        const pw = await bcrypt.hash(req.body.password, 10);   // 2^10 rounds of computation per hash making password guesses computationally costly. The hash: (bcrypt version; 2b in this case)$(salt round)$(salt)$(actual hash)
        const userId = req.body.userId;

        const {record, summary} = await driver.executeQuery(
            `CREATE (a:User {userName:${userName},{userId:${userId}, password: ${pw} )`,
            {userName:userName, pw:pw, userId:userId},
            {database:'neo4j'}
        )
        res.status(201).json({message: "User has been created."});
    } catch(err){
        res.status(500).json({message:"Signup failed"});
    }
}

async function refresh(req, res, next){
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message: "No refresh token"});
        }

        const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const user = await User.findOne({'refreshToken': hashedToken});

        if(!user){
            return res.status(403).json({message: "Invalid refresh token"});
        }

        const accessToken = jwt.sign(
            {userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '15m'}
        );

        res.status(200).json({accessToken});
    } catch(err){
        next(err);
    }
}

async function login(req, res, next){
    try{
        if(req.body.userName === null){
            return res.status(400).json({message: "Username not entered"});
        }
        const {record, summary} = await driver.executeQuery(
            `MATCH (a.User {userName : ${userName}})
            RETURN a.password AS pw, a.userId AS userId`,
            {userName: req.body.userName},
            {database:'neo4j'}
        )
        
        const pw = record.get('pw');
        if(await bcrypt.compare(pw,req.body.password)){   // Takes the hash, gets the salt rounds value and salt from the string and checks if the typed password hashed with this particular salt produces the actual-hash part stored in the hash
            const accessToken = jwt.sign(
                {userId: record.get('userId'), role:'user'},
                process.env.JWT_SECRET,
                { expiresIn: '15m'}
            );
            const refreshToken = crypto.createHash('sha256').update(crypto.randomBytes(40).toString('hex')).digest('hex');
            const updates = {};
            updates[loginRefreshToken] = refreshToken;

            const {record1, summary1} = await driver.executeQuery(
            `MATCH (a.User {userName : ${userName}, userId :${userId})
            SET a += ${updates}`,
            {userName: req.body.userName, userId: req.body.userId, updates:updates},
            {database:'neo4j'}
            )

            res.cookie('refreshToken',refreshToken,{
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7*24*60*60*1000
            })
            res.status(200).json({message: "Logged in", accessToken});
        }
        else{
            res.status(401).json({message: "Invalid credentials"});    // Better than "Incorrect password", because returning "Incorrect password" leaks info to attacker that the Email/userName exists in DB.
        }
    }catch(err){   
        next(err);
    }
}

async function signout(req, res){
    res.status(200).json({message:"Logged out"});
}

module.exports = {signup, login, signout,refresh};


