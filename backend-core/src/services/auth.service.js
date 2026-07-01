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


export async function is_email_unavailable(
  email
) {
  const acc = await get_acc_by_email(email);
  return acc ? false : true;
}

export async function completeRegister(
    payload
  ) {
    const {
      user_id,
      full_name,
      role,
    } = payload;
  

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



// ── Typed error classes ───────────────────────────────────────────────────────

/**
 * Authentication failure (wrong password, user not found).
 * Controllers should map this to HTTP 401.
 */
export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Duplicate-resource conflict (email already registered).
 * Controllers should map this to HTTP 409.
 */
export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}

/**
 * Token not found, already used, or past its expiry.
 * Controllers should map this to HTTP 400.
 */
export class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenError";
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Return `user` with `password_hash` removed so it is never sent over the wire.
 * @param {object} user
 * @returns {object}
 */
function strip_sensitive(user) {
  if (!user) return user;
  const { password_hash, ...safe } = user;
  return safe;
}

/**
 * Derive the SHA-256 hex digest of a raw token string.
 * @param {string} raw_token
 * @returns {string}
 */
function sha256(raw_token) {
  return crypto.createHash("sha256").update(raw_token).digest("hex");
}

// ── FR-U-01 — Registration ────────────────────────────────────────────────────

/**
 * Register a new CONSUMER or MERCHANT account.
 *
 * Throws `ConflictError` if the email is already registered.
 *
 * @param {object} body
 * @param {"CONSUMER"|"MERCHANT"} account_type
 * @returns {Promise<object>} Safe user object (no password_hash)
 */
export async function register_user(body, account_type = "CONSUMER") {
  const user_field = {
    email: body.email.trim().toLowerCase(),
    password_hash: await hash_password(body.password),
    full_name: body.full_name.trim(),
  };

  let new_user;

  try {
    if (account_type === "CONSUMER") {
      new_user = await create_user(user_field);
    } else if (account_type === "MERCHANT") {
      user_field.role = "MERCHANT";

      const merchant_field = {
        shop_name: body.shop_name,
        address: body.address,
        latitude: body.latitude,
        longitude: body.longitude,
        virtual_balance: body.virtual_balance ?? 0,
        bank_name: body.bank_name,
        bank_account: body.bank_account,
      };

      new_user = await create_user(user_field, "MERCHANT", merchant_field);
    }
  } catch (err) {
    // Prisma unique-constraint violation — email already exists
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      throw new ConflictError("An account with this email address already exists.");
    }
    throw err;
  }

  return strip_sensitive(new_user);
}

// ── FR-U-01 — Login ───────────────────────────────────────────────────────────

/**
 * Authenticate a user and return a signed HS256 JWT (15-min TTL).
 *
 * Throws `AuthError` for non-existent users or incorrect passwords.
 *
 * @param {{ email: string, password: string }} body
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function get_token(body) {
  const acc = await get_acc_by_email(body.email);

  
  if (!acc) {
      throw Error("Email is not regisered!");
  }

  const password_match = await verify_password(body.password, acc.encrypted_password);

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



// ── FR-U-02 — Logout ──────────────────────────────────────────────────────────

/**
 * Server-side logout stub.
 * JWT invalidation is client-side (delete localStorage token).
 * This endpoint clears the FCM device_token when the User model has that field.
 *
 * @param {string} user_id - From the decoded JWT payload (req.user.id)
 * @returns {Promise<void>}
 */
export async function logout_user(user_id) {
  // TODO (FR-S-04): Update user.device_token = null via Prisma once
  // the FCM device_token column is added to the User model.
  // For now the primary action is client-side token deletion.
  return;
}

// ── FR-U-03 — Forgot Password ─────────────────────────────────────────────────

/** Reset token TTL: 1 hour */
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

/**
 * Generate a password reset token for the given email.
 *
 * Security design:
 *  - Raw token:  32 random bytes → hex string (never stored)
 *  - Stored:     SHA-256(raw_token) only
 *  - Response:   raw token included ONLY when NODE_ENV === 'development'
 *
 * Deliberately does NOT distinguish "email not found" to prevent
 * user enumeration attacks — always returns a success-shaped response.
 *
 * @param {string} email
 * @returns {Promise<{ message: string, dev_token?: string }>}
 */
export async function request_password_reset(email) {
  const normalised = email.trim().toLowerCase();
  const acc = await get_acc_by_email(normalised);

  // Silent no-op for unknown emails (prevents enumeration)
  if (!acc) {
    return {
      message: "If that email is registered, a reset link has been sent.",
    };
  }

  // 1. Generate a cryptographically secure raw token
  const raw_token = crypto.randomBytes(32).toString("hex");

  // 2. Hash it before touching the database
  const token_hash = sha256(raw_token);

  // 3. Persist only the hash + expiry
  const expires_at = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await create_reset_token(normalised, token_hash, expires_at);

  // 4. In production: email the raw_token to the user here (Nodemailer / Resend)
  // TODO (FR-U-03): plug in email transport
  console.info(`[AUTH] Password reset token for ${normalised} generated. (email transport not yet configured)`);

  const result = {
    message: "If that email is registered, a reset link has been sent.",
  };

  // 5. Expose raw token in development responses only
  if (process.env.NODE_ENV === "development") {
    result.dev_token = raw_token;
  }

  return result;
}

// ── FR-U-03 — Reset Password ──────────────────────────────────────────────────

/**
 * Consume a reset token and update the user's password.
 *
 * Throws `TokenError` when the token is invalid, not found, or expired.
 *
 * @param {string} raw_token   - The token received by the user (from email / dev response)
 * @param {string} new_password - Plain-text new password (will be hashed here)
 * @returns {Promise<void>}
 */
export async function reset_password(raw_token, new_password) {
  const token_hash = sha256(raw_token.trim());

  const record = await get_reset_token_by_hash(token_hash);

  if (!record) {
    throw new TokenError("Invalid or already-used reset token.");
  }

  if (new Date() > record.expires_at) {
    // Clean up the expired record
    await delete_reset_token(token_hash);
    throw new TokenError("Reset token has expired. Please request a new one.");
  }

  // Hash the new password and update the user
  const new_hash = await hash_password(new_password);
  await update_password_by_email(record.email, new_hash);

  // Invalidate the token — one-time use only
  await delete_reset_token(token_hash);
}

// ── Admin helpers (kept for future use) ───────────────────────────────────────

export async function register_admin(body) {
  // TODO (FR-A): Admin creation should only be triggered by a seeder script
  // or a secure internal endpoint — never a public route.
  throw new Error("Not implemented.");
}

export async function confirm_merchant(id){
    const merchant_data = await confirm_merchant_acc(id);

    return merchant_data;
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
      console.log("userasdajsdlajsdioajsldijasidjasoildjasildjalisdjasildjalsi");

      if (user === null) {
        throw new Error("Email is not registered!");
      }
  } catch (err) {
    return { success: false, message: err.message };
  }

  try {

      // const { error } = await supabaseClient.auth.signInWithOtp({
      //     email,
      //     options: {
      //         shouldCreateUser: false,
      //     },
      // });

      if (error) {
          throw new Error("Supabase OTP send error:", error);
      }

      return { success: true };
  } catch (err) {
      console.error("Error sending OTP:", err);
      return { success: false, message: err.message };
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