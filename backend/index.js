const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const handleAddDetails = require('./controllers/addDetails');
const handleGetDetails = require('./controllers/getDetails');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());
require("dotenv").config();

const mongoURI = "mongodb+srv://abhinavkompella502:abhi1289@cluster0.sngix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.post('/addDetails',handleAddDetails)
app.get('/getDetails',handleGetDetails)



app.listen(8080, () => {
    console.log('Server is running on port 8080');
});