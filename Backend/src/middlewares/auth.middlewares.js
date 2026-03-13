import jsonwebtoken from 'jsonwebtoken';

const jwt = jsonwebtoken;

async function identifyUser(req, res, next) {
    const token = req.cookies.jwtToken;

    if(!token){
        req.status(401).json({
            message: "Token Not Found"
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