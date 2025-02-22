const User = require('../models/User');

async function handleAddDetails(req, res) {
    try {
        const details = new User(req.body);
        await details.save();
        console.log('Details added successfully');
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while adding user details' });
    }
}

module.exports = handleAddDetails;