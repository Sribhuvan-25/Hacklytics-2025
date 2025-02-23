const User = require("../models/User");

async function handleGetDetails(req, res) {
  try {
    
    const username = req.query.username;
    console.log(username)
    const details = await User.findOne({ "userDetails.username": username });
    console.log(details)
    console.log(details)
    res.status(200).json(details);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user details" });
  }
}

module.exports = handleGetDetails;

