/**
 * @file src/middlewares/rbac.middleware.js
 * @description Role-Based Access Control (RBAC) guard.
 *
 * Usage (mount AFTER authenticate):
 *   router.delete('/admin/user/:id',
 *     authenticate,
 *     authorize('ADMIN'),
 *     handler
 *   );
 *
 * Multiple roles allowed:
 *   authorize('MERCHANT', 'ADMIN')
 */

/**
 * Returns an Express middleware that rejects requests whose
 * req.user.role is not in the `allowedRoles` list.
 *
 * @param {...string} allowedRoles - e.g. 'ADMIN', 'MERCHANT', 'CONSUMER'
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    console.log("req.user: ", req.user)

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "Not authenticated" });
    }

    console.log(req.user.role)

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Access denied for role: ${req.user.role}`,
      });
    }

    next();
  };
}
