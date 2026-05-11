const { CosmosClient } = require("@azure/cosmos");
require('dotenv').config();

const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY
});

const database = client.database(process.env.DATABASE_NAME);

const photoContainer = database.container(process.env.PHOTO_CONTAINER);

const userContainer = database.container(process.env.USER_CONTAINER);

module.exports = {
    client,
    database,
    photoContainer,
    userContainer
};