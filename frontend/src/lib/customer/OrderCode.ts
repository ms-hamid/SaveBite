// lib/order-code.ts
import { randomInt } from "crypto";

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CODE_LENGTH = 6;

export function generateOrderCode() {
  let code = "";

  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }

  return code;
}

export function getExpiredAt(minutes = 30) {
  const expiredAt = new Date();
  expiredAt.setMinutes(expiredAt.getMinutes() + minutes);

  return expiredAt.toISOString();
}