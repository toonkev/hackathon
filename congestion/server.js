// server.js

const express = require('express');
const fetch = require('isomorphic-fetch'); // Replaced node-fetch with isomorphic-fetch
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.static(__dirname)); // Added this line

app.get('/directions', async (req, res) => {
    const { origin, destination } = req.query;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_API_KEY}&departure_time=now`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.log(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
