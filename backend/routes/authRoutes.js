const express = require("express");
const { signUp, login } = require("../controllers/cognitoService");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await signUp(email, password);
      res.json({ message: "User signed up successfully", result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await login(email, password);
      res.json({ token: result.AuthenticationResult.IdToken });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
  });
  
  module.exports = router;