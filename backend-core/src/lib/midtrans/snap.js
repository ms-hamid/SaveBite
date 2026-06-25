/**
 * @file midtrans/snap.js
 * @description Midtrans Snap SDK initialisation.
 *              Creates a singleton Snap client configured from environment
 *              variables. Used by PaymentService to create payment tokens.
 *
 * Docs: https://docs.midtrans.com/reference/snap-js
 */

import Midtrans from 'midtrans-client';

// TODO: implement
export const core_api = new Midtrans.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});
