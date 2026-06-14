/**
 * @file global.d.js
 * @description Shared JSDoc typedef declarations for the backend-core service.
 *              Provides IntelliSense for common domain objects without TypeScript.
 *
 * @typedef {Object} AuthenticatedUser
 * @property {string} id        - UUID of the authenticated user
 * @property {string} email
 * @property {'CUSTOMER'|'MERCHANT'|'ADMIN'} role
 *
 * @typedef {Object} PaginationMeta
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 */
