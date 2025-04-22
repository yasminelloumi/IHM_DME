const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3002;
const JSON_SERVER_URL = 'http://localhost:3001';

// Directories for uploads
const PDF_UPLOAD_DIR = path.join(__dirname, 'Uploads', 'pdfFiles');
const IMAGE_UPLOAD_DIR = path.join(__dirname, 'Uploads', 'images');

// Create directories if they don't exist
if (!fs.existsSync(PDF_UPLOAD_DIR)) {
  fs.mkdirSync(PDF_UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGE_UPLOAD_DIR)) {
  fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });
}

// Database files for reports and images
const REPORTS_DB_FILE = path.join(__dirname, 'reports.json');
const IMAGES_DB_FILE = path.join(__dirname, 'images.json');

// Initialize database files if they don't exist
if (!fs.existsSync(REPORTS_DB_FILE)) {
  fs.writeFileSync(REPORTS_DB_FILE, JSON.stringify({ reports: [] }, null, 2));
}
if (!fs.existsSync(IMAGES_DB_FILE)) {
  fs.writeFileSync(IMAGES_DB_FILE, JSON.stringify({ images: [] }, null, 2));
}

// Helper functions for reports
const readReports = () => {
  try {
    const data = fs.readFileSync(REPORTS_DB_FILE);
    return JSON.parse(data).reports;
  } catch (err) {
    console.error('Error reading reports.json:', err);
    return [];
  }
};

const writeReports = (reports) => {
  try {
    fs.writeFileSync(REPORTS_DB_FILE, JSON.stringify({ reports }, null, 2));
  } catch (err) {
    console.error('Error writing reports.json:', err);
    throw err;
  }
};

// Helper functions for images
const readImages = () => {
  try {
    const data = fs.readFileSync(IMAGES_DB_FILE);
    return JSON.parse(data).images;
  } catch (err) {
    console.error('Error reading images.json:', err);
    return [];
  }
};

const writeImages = (images) => {
  try {
    fs.writeFileSync(IMAGES_DB_FILE, JSON.stringify({ images }, null, 2));
  } catch (err) {
    console.error('Error writing images.json:', err);
    throw err;
  }
};

// Multer configuration for PDFs
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PDF_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `report-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Multer configuration for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGE_UPLOAD_DIR);
  },
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
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) allowed'), false);
    }
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for PDFs and images
app.use('/Uploads/pdfFiles', express.static(PDF_UPLOAD_DIR));
app.use('/uploads/images', express.static(IMAGE_UPLOAD_DIR));

// POST /reports - Upload a PDF report
app.post('/reports', pdfUpload.single('file'), async (req, res) => {
  try {
    console.log("Server received req.body:", req.body);
    console.log("Server received req.file:", {
      originalname: req.file?.originalname,
      filename: req.file?.filename,
      path: req.file?.path,
    });

    const { patientId, description, dmeId, labTest } = req.body;

    if (!req.file || !patientId || !description || !dmeId || !labTest) {
      console.error("Validation failed:", {
        hasFile: !!req.file,
        patientId,
        description,
        dmeId,
        labTest,
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sanitizedLabTest = labTest
      .replace(/\.pdf$/i, '')
      .replace(/[^a-zA-Z0-9\-_\s]/g, '')
      .trim();

    if (!sanitizedLabTest) {
      console.error("Invalid labTest after sanitization:", labTest);
      return res.status(400).json({ error: 'Invalid labTest provided' });
    }

    console.log("Sanitized labTest:", sanitizedLabTest, "Original labTest:", labTest, "Uploaded file:", req.file.originalname);

    const newReport = {
      id: Date.now().toString(),
      patientId,
      description,
      labTest: sanitizedLabTest, // Renamed to match frontend expectation
      filePath: `/Uploads/pdfFiles/${req.file.filename}`, // Changed filePath to url to match frontend
      timestamp: new Date().toISOString(), // Changed timestamp to dateCreated to match frontend
      dmeId,
    };

    const reports = readReports();
    reports.push(newReport);
    writeReports(reports);

    try {
      const jsonServerResponse = await axios.post(`${JSON_SERVER_URL}/reports`, newReport);
      console.log("JSON server updated with report:", jsonServerResponse.data);
    } catch (jsonError) {
      console.error("Failed to update JSON server:", jsonError.message, jsonError.response?.data);
    }

    res.status(201).json(newReport);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// POST /images - Upload an image
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
      dateCreation: new Date().toISOString(),
      dmeId,
      imgTest: sanitizedImgTest,
    };

    const images = readImages();
    images.push(newImage);
    writeImages(images);

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

// GET /images - Fetch images by patientId
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

// DELETE /images/:id - Delete an image
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
