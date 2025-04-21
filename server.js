const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3002;
const JSON_SERVER_URL = 'http://localhost:3001';

// Directories
const IMAGE_UPLOAD_DIR = path.join(__dirname, 'Uploads', 'images');
if (!fs.existsSync(IMAGE_UPLOAD_DIR)) {
  fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });
}

// Image metadata storage
const IMAGE_DB_FILE = path.join(__dirname, 'images.json');
if (!fs.existsSync(IMAGE_DB_FILE)) {
  fs.writeFileSync(IMAGE_DB_FILE, JSON.stringify({ images: [] }, null, 2));
}

// Helper functions
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
  } catch (err) {
    console.error('Error writing images.json:', err);
    throw err;
  }
};

// Multer configuration for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGE_UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) allowed'));
    }
  },
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Image Upload Route
app.post('/images', imageUpload.single('image'), async (req, res) => {
  try {
    const { patientId, description, dmeId, imgTest } = req.body;
    if (!req.file || !patientId || !description || !dmeId || !imgTest) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sanitizedImgTest = imgTest.replace(/[^a-zA-Z0-9\-_\s]/g, '').trim();
    if (!sanitizedImgTest) {
      return res.status(400).json({ error: 'Invalid imaging test' });
    }

    const newImage = {
      id: Date.now().toString(),
      patientId,
      description,
      fileName: req.file.filename,
      url: `/uploads/images/${req.file.filename}`,
      dateCreated: new Date().toISOString(),
      dmeId,
      imgTest: sanitizedImgTest,
    };

    const images = readImages();
    images.push(newImage);
    writeImages(images);

    // Optional: Sync with JSON server
    try {
      await axios.post(`${JSON_SERVER_URL}/images`, newImage);
    } catch (err) {
      console.error('JSON server sync failed:', err.message);
    }

    res.status(201).json(newImage);
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload image', details: err.message });
  }
});

// Get Images Route
app.get('/images', (req, res) => {
  try {
    const { patientId } = req.query;
    let images = readImages();
    if (patientId) {
      images = images.filter((img) => img.patientId === patientId);
    }
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
    const filePath = path.join(IMAGE_UPLOAD_DIR, image.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    images.splice(imageIndex, 1);
    writeImages(images);

    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});