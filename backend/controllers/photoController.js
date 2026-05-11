const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const { BlobServiceClient } = require('@azure/storage-blob');
const { photoContainer } = require('../database/cosmosClient');

// Multer configuration (store file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Azure Blob Storage connection
const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
    process.env.PHOTO_CONTAINER
);

// Upload Photo Controller
const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded'
            });
        }

        // Generate unique filename
        const blobName =
            `${uuidv4()}${path.extname(req.file.originalname)}`;

        // Get blob client
        const blockBlobClient =
            containerClient.getBlockBlobClient(blobName);

        // Upload file to Azure Blob Storage
        await blockBlobClient.uploadData(req.file.buffer, {
            blobHTTPHeaders: {
                blobContentType: req.file.mimetype
            }
        });

        // Save metadata to Cosmos DB
        const photoData = {
    id: uuidv4(),
    userId: req.user.id,
    uploadedBy: req.body.uploadedBy || 'Unknown User',

    title: req.body.title,
    caption: req.body.caption,
    location: req.body.location,
    people: req.body.people,

    fileName: blobName,
    originalName: req.file.originalname,
    imageUrl: blockBlobClient.url,
    createdAt: new Date().toISOString(),
    category: 'general',
    likes: 0,
    comments: []
};

        await photoContainer.items.create(photoData);

        // Return success response
        res.status(201).json({
            message: 'Photo uploaded successfully',
            photo: photoData
        });

    } catch (error) {
        console.error('Upload Error:', error);

        res.status(500).json({
            message: 'Upload failed',
            error: error.message
        });
    }
};

// Get All Photos Controller
const getAllPhotos = async (req, res) => {
    try {
        const querySpec = {
            query: "SELECT * FROM c ORDER BY c.createdAt DESC"
        };

        const { resources } = await photoContainer.items
            .query(querySpec)
            .fetchAll();

        res.status(200).json({
            photos: resources
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch photos',
            error: error.message
        });
    }
};
const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        await photoContainer.item(id, 'general').delete();

        res.status(200).json({
            message: 'Photo deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete photo',
            error: error.message
        });
    }
};
const likePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        const { resource: photo } = await photoContainer
            .item(id, 'general')
            .read();

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found'
            });
        }

        photo.likes = photo.likes ? photo.likes + 1 : 1;

        await photoContainer
            .item(id, 'general')
            .replace(photo);

        res.status(200).json({
            message: 'Photo liked successfully',
            likes: photo.likes
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to like photo',
            error: error.message
        });
    }
};
const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const { resource: photo } = await photoContainer
            .item(id, 'general')
            .read();

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found'
            });
        }

        if (!photo.comments) {
            photo.comments = [];
        }

        photo.comments.push({
            user: req.user.id,
            text: comment,
            createdAt: new Date().toISOString()
        });

        await photoContainer
            .item(id, 'general')
            .replace(photo);

        res.status(200).json({
            message: 'Comment added successfully',
            comments: photo.comments
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to add comment',
            error: error.message
        });
    }
};

// Export controllers and middleware
module.exports = {
    upload,
    uploadPhoto,
    getAllPhotos,
    deletePhoto,
    likePhoto,
    addComment
};