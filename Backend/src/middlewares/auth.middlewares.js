import jsonwebtoken from 'jsonwebtoken';
import redis from '../config/cache.js';

const jwt = jsonwebtoken;

async function identifyUser(req, res, next) {
    const token = req.cookies.jwtToken;

    if(!token){
        return res.status(401).json({
            message: "Token Not Found"
        })
    }

    const isTokenBlackListed = await redis.get(token);

    if(isTokenBlackListed){
        return res.status(401).json({
            message: "The token is Blacklisted."
        })
    }

    let decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }

}

export default identifyUser;