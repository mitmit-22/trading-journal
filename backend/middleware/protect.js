import { verifyToken } from "../lib/auth.js";

const protect = (req,res,next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({message:"not authorized , no token"})
    }

const token = authHeader.split(" ")[1]

try{
    const decoded = verifyToken(token);
    req.userId = decoded.userId 
    next()

}catch (error){
    return res.status(401).json({message:"not authorized, invalid token"})
}
}

export default protect;

