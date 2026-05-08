/**
 * RBAC middleware factory.
 * Usage: router.get('/users', authenticate, requireRole('admin'), handler)
 *
 * @param {...string} roles - Allowed role(s)
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient role' });
  }
  next();
};
