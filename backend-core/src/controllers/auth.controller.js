import { 
    completeRegister, 
    get_token, 
    register_user,
    forgot_password_service,
    verify_reset_otp_service,
    reset_password_service
} from "../services/auth.service.js";
import { supabase } from "../lib/supabase.js";
// import { kyc_status } from "@prisma/client";
import { serializeBigInt } from "../utils/json.js";

// export async function register(req, res) {
//     try {
//         const new_user = await register_user(req.body);
//         return res.status(201).json({
//             user: new_user,
//             message: "Berhasil mendaftarkan akun"
//         })
//     } catch (e) {
//         return res.status(500).json({
//             error: e.message,
//             message: "Internal Server Error"
//         });
//     }
// }


export async function register(
    req,
    res
  ) {
    try {
      const result = await completeRegister(
          req.body
        );
      return res.status(201).json({
        success: true,
        data: serializeBigInt (result),
      });
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }


// ── FR-U-01 — Merchant registration ──────────────────────────────────────────

/**
 * POST /auth/merch_reg
 * Registers a new MERCHANT account (with merchant profile).
 * Responds 201 on success, 409 on duplicate email.
 */
export async function merchant_register(req, res) {
  try {
    const new_user = await register_user(req.body, "MERCHANT");

    return res.status(201).json({
      message: "Merchant account created successfully.",
      user: new_user, // password_hash already stripped in service
    });
  } catch (err) {
    const status = error_status(err);
    if (status === 500) console.error("[merchant_register]", err);
    return res.status(status).json({
      error: err.name,
      message: err.message,
    });
  }
}

export async function login(req, res) {
    try {
        const {token, role} = await get_token(req.body);

        res.cookie("sb_access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            token: token,
            role: role, 
        });
    } catch (e) {
      console.log(e);  
      return res.status(500).json({
            error: e.message,
            message: "Internal Server Error"
        })
    }
}

export async function logout(req, res) {
    try {
      res.clearCookie("sb_access_token");
  
      return res.status(200).json({
        success: true,
        message: "Logout berhasil",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Logout gagal",
      });
    }
}

/**
 * POST /auth/forgot-password
 * Initiate password reset by sending OTP to email
 */
export async function forgot_password(req, res) {
    try {
        const { email } = req.body;

        // Call service with Supabase client
        const result = await forgot_password_service(email, supabase);

        // Always return 200 to prevent email enumeration
        return res.status(200).json({
            success: true,
            message: "OTP telah dikirim ke email jika terdaftar"
        });

    } catch (error) {
        // Even on validation error, return same response
        console.error("Forgot password error:", error.message);
        return res.status(200).json({
            success: true,
            message: "OTP telah dikirim ke email jika terdaftar"
        });
    }
}

/**
 * POST /auth/verify-reset-otp
 * Verify OTP and generate reset token
 */
export async function verify_reset_otp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: "validation_error",
                message: "Email dan OTP wajib diisi"
            });
        }

        // Call service with Supabase client
        const result = await verify_reset_otp_service(email, otp, supabase);

        return res.status(200).json({
            success: true,
            resetToken: result.resetToken,
            message: result.message
        });

    } catch (error) {
        const statusCode = error.message.includes("invalid")
            ? 401
            : error.message.includes("not found")
            ? 404
            : 400;

        return res.status(statusCode).json({
            success: false,
            error: "auth_error",
            message: error.message
        });
    }
}

/**
 * POST /auth/reset-password
 * Reset password using verified reset token
 */
export async function reset_password(req, res) {
    try {
        const { resetToken, password, confirmPassword } = req.body;

        if (!resetToken || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                error: "validation_error",
                message: "Reset token, password, dan konfirmasi password wajib diisi"
            });
        }

        // Call service
        const result = await reset_password_service(resetToken, password, confirmPassword);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        const statusCode = error.message.includes("invalid") ||
            error.message.includes("expired") ||
            error.message.includes("not found")
            ? 401
            : 400;

        return res.status(statusCode).json({
            success: false,
            error: "auth_error",
            message: error.message
        });
    }
}
