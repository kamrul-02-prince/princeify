const photoRoutes = require('./routes/photoRoutes');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const { database } = require('./database/cosmosClient');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.get('/', async (req, res) => {

    try {

        await database.read();

        res.send('Princeify API + CosmosDB Connected Successfully');

    } catch (error) {

        res.status(500).send('CosmosDB Connection Failed');

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});