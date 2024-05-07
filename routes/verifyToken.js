const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
// function verifyToken(req, res, next) {
//     const token = req.headers['authorization'];
//     if (!token) return res.status(401).send('Access Denied: No token provided');
//     try {
//         const tokenValue = token.split(' ')[1];
//         console.log('Token Received:', tokenValue); // Log the token value for inspection
//         const decoded = jwt.verify(tokenValue, process.env.JWT_SEC);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         console.error('Token Verification Error:', err);
//         return res.status(401).send('Invalid Token');
//     }
// }

const verifyToken = (req, res, next) => {
  const authHeader = req.header.token;
  if (authHeader) {
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
