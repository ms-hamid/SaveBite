import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

console.log(JWT_SECRET);
if (!JWT_SECRET) throw new Error("JWT_SECRET is not found!");

export async function generate_token(payload) {
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});
    return token
}

export async function verify_token(token) {
    try {
        return await jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    } 
}