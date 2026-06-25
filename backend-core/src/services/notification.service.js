import { messaging } from "../lib/firebase-admin.js";

import {
  upsert_device_token,
  delete_device_token,
  get_customer_device_tokens,
} from "../repositories/deviceToken.repository.js";

/**
 * Save device token for a user.
 * 
 * @param {string} userId
 * @param {string} token
 * @param {string} [platform]
 */
export async function save_token(userId, token, platform) {
  return upsert_device_token(userId, token, platform);
}

/**
 * Delete device token for a user.
 * 
 * @param {string} userId
 * @param {string} token
 */
export async function remove_token(userId, token) {
  return delete_device_token(userId, token);
}

/**
 * Send notification to multiple device tokens.
 * 
 * @param {string[]} tokens
 * @param {string} title
 * @param {string} body
 * @param {object} [data] Optional key-value payload (must be strings)
 */
export async function send_multicast_notification(
  tokens,
  title,
  body,
  data = {}
) {

  if (!tokens || tokens.length === 0) {
    console.log(
      "No device tokens available to send notification."
    );

    return {
      success: true,
      message: "No tokens to notify"
    };
  }


  try {

    const response =
      await messaging.sendEachForMulticast({

        tokens,

        notification: {
          title,
          body,
        },

        data: {
          ...data,
        },

      });


    console.log(
      `Multicast sent: ${response.successCount} succeeded, ${response.failureCount} failed.`
    );


    return response;


  } catch (error) {

    console.error(
      "Error sending multicast notification:",
      error
    );

    throw error;
  }
}

/**
 * Notify all customer users of a newly created surplus listing.
 * 
 * @param {object} listing Created listing object
 * @param {string} merchantName Name of the merchant
 */
export async function notify_all_customers_of_new_listing(listing, merchantName) {
  const tokens = await get_customer_device_tokens();
  if (!tokens || tokens.length === 0) {
    console.log("No customers with registered device tokens to notify.");
    return;
  }

  const title = `Surplus baru dari ${merchantName}! 🎉`;
  const body = `Toko ${merchantName} baru saja mengunggah ${listing.name}. Dapatkan dengan harga diskon sebelum kehabisan!`;
  
  const data = {
    type: "new_listing",
    listingId: String(listing.id),
    publicId: String(listing.public_id || ""),
  };

  return send_multicast_notification(tokens, title, body, data);
}
