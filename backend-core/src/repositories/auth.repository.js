// import { KYC_Status } from "@prisma/client";
// import { prisma } from "../lib/prisma.js";

import { profile } from "console";
import {prisma} from "../lib/prisma.js";
import crypto from "crypto";

export async function create_user(user_field, account_type="CONSUMSER", merchant_field={}) {
    return await prisma.$transaction(async (tx) => {
        const new_user = await tx.user.create({
            data: user_field
        });
    
        if (account_type === "MERCHANT") {
            merchant_field.user = {
                connect: {
                    id: new_user.id
                }
            }
            const merchant_data = await tx.merchant.create({
                data: merchant_field
            });
        
            new_user.merchant = merchant_data;
        }
    })
};


export async function get_acc_by_email(email) {
    return await prisma.authUser.findFirst({
        where: {
        email,
        },
        include: {
        profile: true,
        merchant: true
    },
    });
}

export async function insert_merchant_data(field) {
    return await prisma.merchant.create({
        data: field  
    });
};

export async function confirm_merchant_acc(merchant_id) {
    return await prisma.merchant.update({
        data: {
            kyc_status: "APPROVED"
        },
        where: {
            id: merchant_id
        }
    })
}

/**
 * Create password reset token record in database
 * @param {string} email
 * @param {string} tokenHash - hashed token
 * @param {Date} expiresAt - token expiration time
 * @returns {object} created password_resets record
 */
export async function create_password_reset_token(email, tokenHash, expiresAt) {
    return await prisma.password_resets.create({
        data: {
            email,
            token_hash: tokenHash,
            expires_at: expiresAt
        }
    });
}

/**
 * Get valid password reset token by email
 * @param {string} email
 * @returns {object|null} password_resets record if exists and not expired
 */
export async function get_password_reset_token(email) {
    return await prisma.password_resets.findFirst({
        where: {
            email,
            expires_at: { gt: new Date() } // Not expired
        }
    });
}

/**
 * Delete password reset token (invalidate after use)
 * @param {string} email
 * @returns {object} deleted count info
 */
export async function delete_password_reset_token(email) {
    return await prisma.password_resets.deleteMany({
        where: { email }
    });
}

/**
 * Update user password in auth.users table
 * @param {string} email
 * @param {string} hashedPassword - bcryptjs hashed password
 * @returns {object} updated user record
 */
export async function update_user_password(id, hashedPassword) {
    return await prisma.authUser.update({
        where: { id },
        data: {
            encrypted_password: hashedPassword,
            updated_at: new Date()
        }
    });
}

/**
 * Hash token using SHA-256 for storage
 * @param {string} token - plain token
 * @returns {string} hashed token
 */
export function hash_token(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}