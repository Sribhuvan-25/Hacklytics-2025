const { GetCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

async function handleAddDetails(req, res, dynamoDB) {
    try {
        const { username } = req.body.userDetails;

        // Check if the username already exists
        const getParams = {
            TableName: 'abs-hacklytics', // Ensure this matches your table name
            Key: { username }
        };

        const existingUser = await dynamoDB.send(new GetCommand(getParams));
        if (existingUser.Item) {
            // Update the existing user details
            const updateParams = {
                TableName: 'abs-hacklytics', // Ensure this matches your table name
                Key: { username },
                UpdateExpression: 'set userDetails = :userDetails, income = :income, debt = :debt, expenses = :expenses',
                ExpressionAttributeValues: {
                    ':userDetails': req.body.userDetails,
                    ':income': req.body.income || [],
                    ':debt': req.body.debt || [],
                    ':expenses': req.body.expenses || { needs: [], wants: [] }
                },
                ReturnValues: 'UPDATED_NEW'
            };

            await dynamoDB.send(new UpdateCommand(updateParams));
            console.log('Details updated successfully');
            return res.status(200).json({ message: 'User details updated successfully' });
        }

        // If the username does not exist, create a new user
        const putParams = {
            TableName: 'abs-hacklytics', // Ensure this matches your table name
            Item: {
                username: username, // Ensure the primary key is included
                userDetails: req.body.userDetails, // Ensure userDetails is included
                income: req.body.income || [],
                debt: req.body.debt || [],
                expenses: req.body.expenses || { needs: [], wants: [] }
            }
        };

        await dynamoDB.send(new PutCommand(putParams));
        console.log('Details added successfully');
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while adding/updating user details' });
    }
}

module.exports = handleAddDetails;
