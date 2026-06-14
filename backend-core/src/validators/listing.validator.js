/**
 * @file listing.validator.js
 * @description Request validation schemas for the Listing (surplus food) domain.
 *              Uses express-validator or joi to guard controller input.
 */

// TODO: import { body, validationResult } from 'express-validator';

export const createListingValidation = [
  // body('title').notEmpty().trim(),
  // body('surplusPrice').isFloat({ min: 0 }),
  // body('originalPrice').isFloat({ min: 0 }),
  // body('surplusPrice').custom((val, { req }) => val < req.body.originalPrice),
  // body('quantity').isInt({ min: 1 }),
  // body('expiresAt').isISO8601(),
];
