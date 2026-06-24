/**
 * @file src/validators/auth.validator.js
 * @description Authentication input validators for forgot password, OTP, and reset password
 */

/**
 * Validate email format and length
 * @param {string} email
 * @throws {Error} if invalid
 * @returns {boolean}
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim().length === 0) {
    throw new Error('Email wajib diisi');
  }

  if (!emailRegex.test(email)) {
    throw new Error('Format email tidak valid');
  }

  if (email.length > 254) {
    throw new Error('Email terlalu panjang');
  }

  return true;
}

/**
 * Validate OTP format (6 digits)
 * @param {string} otp
 * @throws {Error} if invalid
 * @returns {boolean}
 */
export function validateOTP(otp) {
  const otpRegex = /^\d{6}$/;

  if (!otp || otp.trim().length === 0) {
    throw new Error('OTP wajib diisi');
  }

  if (!otpRegex.test(otp)) {
    throw new Error('OTP harus 6 digit angka');
  }

  return true;
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - 1 uppercase letter
 * - 1 lowercase letter
 * - 1 digit
 * @param {string} password
 * @throws {Error} if invalid
 * @returns {boolean}
 */
export function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!password || password.trim().length === 0) {
    throw new Error('Password wajib diisi');
  }

  if (password.length < 8) {
    throw new Error('Password minimal 8 karakter');
  }

  if (!passwordRegex.test(password)) {
    throw new Error(
      'Password minimal 8 karakter, 1 huruf besar, 1 huruf kecil, dan 1 angka'
    );
  }

  return true;
}

/**
 * Validate password confirmation match
 * @param {string} password
 * @param {string} confirmPassword
 * @throws {Error} if not matching
 * @returns {boolean}
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new Error('Password dan konfirmasi password tidak sama');
  }

  return true;
}

/**
 * Validate reset token format
 * @param {string} token
 * @throws {Error} if invalid
 * @returns {boolean}
 */
export function validateResetToken(token) {
  if (!token || token.trim().length === 0) {
    throw new Error('Reset token wajib diisi');
  }

  if (typeof token !== 'string') {
    throw new Error('Reset token harus berupa string');
  }

  return true;
}
