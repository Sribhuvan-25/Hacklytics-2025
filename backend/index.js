const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const cors = require('cors');

require("dotenv").config();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const authRoutes = require("./routes/authRoutes");




app.use("/auth", authRoutes);
                                                             

PORT = 3000

app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`);
})