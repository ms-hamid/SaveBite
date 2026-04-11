import { verify_token } from "../lib/jwt.js";

export function role_middleware(...allowed_roles) {
    return (req, res, next) => {
        const user = req.user;

        console.log(user)
        console.log(user.role)

        if (!user) {
            return res.status(401).json({
                message: "Unauthorize: invalid role"
            });
        }

        if (!allowed_roles.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        
        next()
    }
}

export async function auth_middleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token) {
        throw res.status(401).json({message: "Unauthorize: token not found"})
    }

    const decoded = await verify_token(token);

    if(!decoded) {
        throw res.status(403).json({message: "Invalid Token"});
    }

    req.user = decoded;
    
    next();
}