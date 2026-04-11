import { KYC_Status } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

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


export async function get_acc_by_email(email){
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    });
};

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