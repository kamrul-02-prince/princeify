const express = require('express');
const router = express.Router();

const {
    upload,
    uploadPhoto,
    getAllPhotos,
    deletePhoto,
    likePhoto,
    addComment
} = require('../controllers/photoController');
const authMiddleware = require('../middleware/authMiddleware');

// Upload photo
router.post(
    '/upload',
    authMiddleware,
    upload.single('photo'),
    uploadPhoto
);

// Get all photos
router.get(
    '/',
    authMiddleware,
    getAllPhotos
);
router.delete(
    '/:id',
    authMiddleware,
    deletePhoto
);
router.put(
    '/like/:id',
    authMiddleware,
    likePhoto
);
router.post(
    '/comment/:id',
    authMiddleware,
    addComment
);
module.exports = router;