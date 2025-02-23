const User = require('../models/User');

async function handleAddDetails(req, res) {
    try {
          
          
        const { username } = req.body.userDetails;

        // Check if the username already exists
        const existingUser = await User.findOne({ "userDetails.username": username });
        if (existingUser) {
            // Update the existing user details
            await User.findOneAndUpdate(
                { "userDetails.username": username },
                req.body,
                { new: true }
            );
            console.log('Details updated successfully');
            return res.status(200).json({ message: 'User details updated successfully' });
        }
        
        await details.save();
        console.log('Details added successfully');
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while adding user details' });
    }
}

module.exports = handleAddDetails;