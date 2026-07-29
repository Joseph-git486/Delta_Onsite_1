const jwt = require('jsonwebtoken');

function authMiddleware(req,res,next){
    const authorization = req.headers.authorization;
    if( !authorization || !authorization.startsWith("Bearer ")){
        return res.status(401).json({error:"No token provided"});
    }
    const token = authorization.slice(7);
    const secretKey = process.env.JWT_SECRET;
    try {
        const payload = jwt.verify(token, secretKey);
        req.user = payload;     // {userId, role}
        next();
    } catch(err){
        res.status(401).json({error:"Invalid or expired token"});
    }
}

module.exports = {authMiddleware};