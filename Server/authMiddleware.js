const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('Authorization');

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, 'secret'); // Replace 'secret' with your actual secret key

    // Attach the decoded user object to the request object
    req.user = decoded.user;

    // Move to the next middleware
    next();
  } catch (err) {
    // Token verification failed
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;