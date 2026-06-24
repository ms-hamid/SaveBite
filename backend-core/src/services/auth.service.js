// import { kyc_status } from "@prisma/client";
import { hash_password, verify_password } from "../lib/hash.js";
import { generate_token, generate_reset_token, verify_reset_token } from "../lib/jwt.js";
import { 
    confirm_merchant_acc, 
    create_user, 
    get_acc_by_email, 
    insert_merchant_data,
    create_password_reset_token,
    get_password_reset_token,
    delete_password_reset_token,
    update_user_password,
    hash_token
} from "../repositories/auth.repository.js"
import { createCustomerData } from "../repositories/customer.repository.js";
import { createMerchantData } from "../repositories/merchant.repository.js";
import { validateEmail, validateOTP, validatePassword, validatePasswordMatch, validateResetToken } from "../validators/auth.validator.js";

export async function completeRegister(
    payload
  ) {
    const {
      user_id,
      full_name,
      role,
    } = payload;
  
    console.log(payload);

    if (role === "CUSTOMER") {
      return createCustomerData(
        payload
      );
    }
  
    if (role === "MERCHANT") {
      return createMerchantData(
        payload
      );
    }
  
    throw new Error(
      "Role tidak valid"
    );
  }



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

    console.log(acc)
    const password_match = await verify_password(body.password, acc.encrypted_password);
    
    console.log(password_match ? "password sesuai" : "password tidak sesuai");


    if (!password_match) {
        throw Error("Incorrect Username or Password!");
    }

    const payload = {
        email: acc.email,
        full_name: acc.profile.full_name, 
        id: acc.id,
        role: acc.profile.role, 
        kyc_status: acc.merchant ? acc.merchant.kyc_status : "",
        email_verified: Boolean(acc.email_confirmed_at)
    };

    const token = generate_token(payload);

    return {token: token, role: payload.role};
}

/**
 * Initiate password reset by sending OTP email
 * Uses Supabase Auth to handle OTP generation and sending
 * 
 * @param {string} email
 * @param {object} supabaseClient - Supabase auth client
 * @returns {object} { success: true, message }
 * @throws {Error} if email format is invalid (exposed) or other errors
 */
export async function forgot_password_service(email, supabaseClient) {
  validateEmail(email);

  try {
      const user = await get_acc_by_email(email);

      if (!user) {
          return { success: true };
      }
  } catch (err) {
      console.error("Error checking email:", err);
      return { success: true };
  }

  try {

      const { error } = await supabaseClient.auth.signInWithOtp({
          email,
          options: {
              shouldCreateUser: false,
          },
      });

      if (error) {
          console.error("Supabase OTP send error:", error);
      }

      return { success: true };
  } catch (err) {
      console.error("Error sending OTP:", err);
      return { success: true };
  }
}
/**
 * Verify OTP and generate single-use reset token
 * 
 * @param {string} email
 * @param {string} otp - 6-digit code from email
 * @param {object} supabaseClient - Supabase auth client
 * @returns {object} { success: true, resetToken: string }
 * @throws {Error} if OTP invalid/expired or other validation errors
 */
export async function verify_reset_otp_service(email, otp, supabaseClient) {
    // 1. Validate inputs
    validateEmail(email);
    validateOTP(otp);

    // 2. Verify OTP with Supabase
    const { data, error } = await supabaseClient.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
    });

    if (error || !data) {
        throw new Error("OTP invalid atau expired");
    }

    // 3. Get user from auth.users
    let user;
    try {
        user = await get_acc_by_email(email);
    } catch (err) {
        throw new Error("User not found");
    }

    if (!user) {
        throw new Error("User not found");
    }

    // 4. Generate reset token (JWT) - 10 minute expiry
    const resetToken = generate_reset_token({
        sub: user.id,
        email: user.email
    });

    // 5. Store token hash in database
    const tokenHash = hash_token(resetToken);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    try {
        await create_password_reset_token(email, tokenHash, expiresAt);
    } catch (err) {
        console.error("Error storing reset token:", err);
        throw new Error("Failed to process OTP verification");
    }

    // 6. Return reset token to frontend (for next step)
    return {
        success: true,
        resetToken: resetToken,
        message: "OTP verified successfully"
    };
}

/**
 * Reset password using verified reset token
 * 
 * @param {string} resetToken - JWT reset token from previous step
 * @param {string} password - new password
 * @param {string} confirmPassword - password confirmation
 * @returns {object} { success: true, message }
 * @throws {Error} if token invalid/expired or password validation fails
 */
export async function reset_password_service(resetToken, password, confirmPassword) {
    // 1. Validate inputs
    validateResetToken(resetToken);
    validatePassword(password);
    validatePasswordMatch(password, confirmPassword);

    // 2. Verify reset token (JWT)
    let decoded;
    try {
        decoded = verify_reset_token(resetToken);
    } catch (err) {
        throw new Error("Token invalid atau expired");
    }

    // Ensure we have required fields
    if (!decoded.sub || !decoded.email) {
        throw new Error("Invalid token payload");
    }

    // 3. Check if token record still exists in DB (not already used)
    try {
        const tokenRecord = await get_password_reset_token(decoded.email);
        if (!tokenRecord) {
            throw new Error("Token not found or already used");
        }
    } catch (err) {
        throw new Error("Token not found or already used");
    }

    // 4. Hash new password
    const hashedPassword = await hash_password(password);

    const acc = await get_acc_by_email(decoded.email);

    // 5. Update user password in auth.users
    let updatedUser;
    try {
        updatedUser = await update_user_password(acc.id, hashedPassword);
    } catch (err) {
        console.error("Error updating password:", err);
        throw new Error("Failed to update password");
    }

    if (!updatedUser) {
        throw new Error("Failed to update password");
    }

    // 6. Delete reset token from database (invalidate)
    try {
        await delete_password_reset_token(decoded.email);
    } catch (err) {
        console.error("Error deleting reset token:", err);
        // Don't throw - token is already used, deletion is just cleanup
    }

    return {
        success: true,
        message: "Password reset successfully. Please log in with your new password"
    };
}