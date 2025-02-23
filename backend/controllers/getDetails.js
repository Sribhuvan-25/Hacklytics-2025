const { GetCommand } = require('@aws-sdk/lib-dynamodb');

async function handleGetDetails(req, res, dynamoDB) {
    try {
        const username = req.query.username;

        const getParams = {
            TableName: 'abs-hacklytics', // Ensure this matches your table name
            Key: { username }
        };

        const details = await dynamoDB.send(new GetCommand(getParams));
        if (!details.Item) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(details.Item);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching user details' });
    }
}

module.exports = handleGetDetails;
