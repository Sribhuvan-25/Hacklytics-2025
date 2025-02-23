const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const handleAddDetails = require('./controllers/addDetails');
const handleGetDetails = require('./controllers/getDetails');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();

// Configure AWS SDK
const dynamoDBClient = new DynamoDBClient({
    region: 'us-east-1', // Update to your region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

app.post('/addDetails', (req, res) => handleAddDetails(req, res, dynamoDB));
app.get('/getDetails', (req, res) => handleGetDetails(req, res, dynamoDB));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});