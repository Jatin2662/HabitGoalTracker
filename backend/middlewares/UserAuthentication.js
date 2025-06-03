


const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next)=>{

    const auth = req.headers['authorization'];
    if(!auth){
        return res.status(403).json({ message: "Unauthorized, Please LogIn" })
    }

    try{
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = decoded;
        next();

    }catch(err){
        res.status(403).json({ message: "Unauthorized, Login Expired!!!" })
    }
}

const ensureAuthorized = (roles) =>{
    return (req, res, next)=>{
        const { role } = req.user;
        if(!roles.includes(role)){
            return res.status(403).json({ message: "Access Forbidden" })
        }
        next();
    };
}

module.exports = {
    ensureAuthenticated,
    ensureAuthorized
}