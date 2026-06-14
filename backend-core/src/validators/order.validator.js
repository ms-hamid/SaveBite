/**
 * @file order.validator.js
 * @description Request validation schemas for the Order domain.
 *              Guards checkout, QR scan, and status-update endpoints.
 */

// TODO: import { body, param } from 'express-validator';

export const createOrderValidation = [
  // body('listingId').isUUID(),
  // body('quantity').isInt({ min: 1 }),
];

export const scanQrValidation = [
  // body('qrPayload').notEmpty(),
  // body('orderId').isUUID(),
];
