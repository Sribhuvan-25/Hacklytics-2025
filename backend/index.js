const express = require('express')
const app = express()

require("dotenv").config();
app.use(express.json());




app.get('/', (req, res) => {
    res.send(`Server running on port ${PORT}`);
});

app.post('/initialData', (req, res) => {
    res.send('Data received');
    console.log(req.body);
})

PORT = 3000

app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`);
})