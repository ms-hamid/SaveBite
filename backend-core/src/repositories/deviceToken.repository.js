import { prisma } from "../lib/prisma.js";

/**
 * Save or update a device token for a user.
 * Binds the token to the given user, avoiding duplicates on the token.
 * 
 * @param {string} userId
 * @param {string} token
 * @param {string} [platform]
 */
export async function upsert_device_token(userId, token, platform = "web") {
  const existing = await prisma.device_tokens.findFirst({
    where: { token },
  });

  if (existing) {
    return prisma.device_tokens.update({
      where: { id: existing.id },
      data: {
        user_id: userId,
        platform,
      },
    });
  }

  return prisma.device_tokens.create({
    data: {
      user_id: userId,
      token,
      platform,
    },
  });
}

/**
 * Remove a device token for a user.
 * 
 * @param {string} userId
 * @param {string} token
 */
export async function delete_device_token(userId, token) {
  return prisma.device_tokens.deleteMany({
    where: {
      user_id: userId,
      token,
    },
  });
}

/**
 * Fetch all device tokens belonging to users with the CUSTOMER role.
 * 
 * @returns {Promise<string[]>} List of FCM tokens
 */
export async function get_customer_device_tokens() {
  const result = await prisma.device_tokens.findMany({
    where: {
      users: {
        customer: {
          isNot: null,
        },
      },
    },
    select: {
      token: true,
    },
  });

  return result.map((r) => r.token).filter(Boolean);
}
