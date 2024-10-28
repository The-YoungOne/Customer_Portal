const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // If the user is an admin, continue to the next middleware or route handler
    } else {
      res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  };
  
  module.exports = isAdmin;