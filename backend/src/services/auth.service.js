import { hash_password, verify_password } from "../lib/hash.js";
import { generate_token } from "../lib/jwt.js";
import { confirm_merchant_acc, create_user, get_acc_by_email, insert_merchant_data } from "../repositories/auth.repository.js"

export async function register_user(body, account_type="CONSUMER") {
    
    let new_user;
    const user_field = {
        email: body.email,
        password_hash: await hash_password(body.password),
        full_name: body.full_name
    }

    if(account_type === "CONSUMER") {
        console.log("DAFTAR UNTUK CONSUMER")
        new_user = await create_user(user_field);
    }else if (account_type === "MERCHANT") {
        console.log("DAFTAR UNTUK MERCHANT")
        user_field.role = "MERCHANT"

        const merchant_field = {

            shop_name: body.shop_name,
            address: body.address,
            latitude: body.latitude,
            longitude: body.longitude,
            virtual_balance: body.virtual_balance,
            bank_name: body.bank_name,
            bank_account: body.bank_account
        }

        new_user = await create_user(user_field, "MERCHANT", merchant_field);
    }

    return new_user;
}


export async function register_admin(body) {
    
}

export async function confirm_merchant(id){
    const merchant_data = await confirm_merchant_acc(id);

    return merchant_data;
}

export async function get_token(body) {
    const acc = await get_acc_by_email(body.email);

    const password_match = verify_password(body.password, acc.password_hash);

    if (!password_match) {
        throw Error("Incorrect Username or Password!");
    }

    const payload = {
        email: acc.email,
        full_name: acc.full_name,
        id: acc.id,
        role: acc.role
    };

    const token = generate_token(payload);

    return token;
}