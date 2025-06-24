// middleware/auth.js
const requireAuth = (req, res, next) => {
  console.log('Auth middleware - checking authentication');
  console.log('Session:', req.session);
  console.log('Authenticated:', req.session.authenticated);
  
  if (req.session.authenticated) {
    console.log('User is authenticated, proceeding');
    return next();
  } else {
    console.log('User not authenticated, redirecting to login');
    return res.redirect('/auth/login');
  }
};

module.exports = { requireAuth };