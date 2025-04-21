const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3002;
const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

// Directories for storing uploaded files
const IMAGE_UPLOAD_DIR = path.join(__dirname, 'Uploads', 'images');

// Ensure upload directory exists
if (!fs.existsSync(IMAGE_UPLOAD_DIR)) {
  console.log(`Creating directory: ${IMAGE_UPLOAD_DIR}`);
  fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });
}

// Test directory permissions
fs.access(IMAGE_UPLOAD_DIR, fs.constants.W_OK, (err) => {
  if (err) {
    console.error(`Directory ${IMAGE_UPLOAD_DIR} is not writable:`, err);
  } else {
    console.log(`Directory ${IMAGE_UPLOAD_DIR} is writable`);
  }
});

// File to store image metadata
const IMAGE_DB_FILE = path.join(__dirname, 'images.json');

// Initialize image database if it doesn't exist
if (!fs.existsSync(IMAGE_DB_FILE)) {
  fs.writeFileSync(IMAGE_DB_FILE, JSON.stringify({ images: [] }, null, 2));
}

// Helper functions for images
const readImages = () => {
  try {
    return JSON.parse(fs.readFileSync(IMAGE_DB_FILE)).images;
  } catch (err) {
    console.error('Error reading images.json:', err);
    return [];
  }
};

const writeImages = (images) => {
  try {
    fs.writeFileSync(IMAGE_DB_FILE, JSON.stringify({ images }, null, 2));
    console.log('Images written to images.json');
  } catch (err) {
    console.error('Error writing to images.json:', err);
    throw err;
  }
};

// Configure Multer for Image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGE_UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed'), false);
    }
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Image Upload Route
app.post('/images', imageUpload.single('image'), async (req, res) => {
  try {
    console.log('Received image upload request:', req.body, req.file);
    const { patientId, description } = req.body;

    // Validate required fields
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    if (!patientId || !description) {
      return res.status(400).json({ error: 'patientId and description are required' });
    }

    const newImage = {
      id: Date.now().toString(),
      patientId,
      description,
      fileName: req.file.originalname,
      url: `/uploads/images/${req.file.filename}`,
      dateCreated: new Date().toISOString(),
    };

    // Save to local image database
    const images = readImages();
    images.push(newImage);
    writeImages(images);

    // Update JSON server
    try {
      await axios.post(`${JSON_SERVER_URL}/images`, newImage);
    } catch (jsonServerError) {
      console.error('JSON Server Error:', jsonServerError.message);
      return res.status(500).json({ error: 'Failed to save to JSON server' });
    }

    res.status(201).json(newImage);
  } catch (err) {
    console.error('Image Upload Error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to save image', details: err.message });
  }
});

// Get All Images Route
app.get('/images', (req, res) => {
  try {
    const images = readImages();
    res.json(images);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Delete Image Route
app.delete('/images/:id', (req, res) => {
  try {
    const { id } = req.params;
    const images = readImages();
    const imageIndex = images.findIndex((img) => img.id === id);

    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = images[imageIndex];
    const filePath = path.join(__dirname, 'Uploads', 'images', path.basename(image.url));

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }

    // Remove from local database
    images.splice(imageIndex, 1);
    writeImages(images);

    // Delete from JSON server
    axios.delete(`${JSON_SERVER_URL}/images/${id}`)
      .catch((err) => console.error('Failed to delete from JSON server:', err.message));

    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});