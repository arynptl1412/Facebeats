import jsonwebtoken from 'jsonwebtoken';
import blacklistModel from '../models/blacklist.models.js';

const jwt = jsonwebtoken;

async function identifyUser(req, res, next) {
    const token = req.cookies.jwtToken;

    if(!token){
        res.status(401).json({
            message: "Token Not Found"
        })
    }

    const isTokenBlackListed = await blacklistModel.findOne({
        token
    })

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