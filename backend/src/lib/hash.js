import bcrypt from "bcrypt";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

export async function hash_password(plain_password) {
    return await bcrypt.hash(plain_password, SALT_ROUNDS);
}

export function verify_password(plain_password, hashed_password) {
    return bcrypt.compare(plain_password, hashed_password);
}