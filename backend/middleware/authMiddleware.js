const { verifyToken } = require("../controllers/cognitoService");

const authMiddleware = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Unauthorized" });
  
      const userData = await verifyToken(token);
      req.user = userData;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
  
  module.exports = authMiddleware;
