const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3002;
const JSON_SERVER_URL = "http://localhost:3001"; // Define your JSON server URL

// Directory for storing uploaded PDFs
const UPLOAD_DIR = path.join(__dirname, 'Uploads', 'pdfFiles');

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// File to store report metadata (simple database)
const DB_FILE = path.join(__dirname, 'reports.json');

// Initialize reports database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ reports: [] }, null, 2));
}

// Helper functions to read/write reports
const readReports = () => {
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data).reports;
};

const writeReports = (reports) => {
  fs.writeFileSync(DB_FILE, JSON.stringify({ reports }, null, 2));
};

// Configure Multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `report-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
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

// Serve static PDF files
app.use('/uploads', express.static(UPLOAD_DIR));

// Route to handle report uploads
app.post('/reports', upload.single('file'), async (req, res) => {
  try {
    // Log raw req.body before parsing
    console.log("Raw req.body before multer:", req.body);

    const { patientId, description, dmeId, labTest, fileName } = req.body;

    // Log parsed req.body and req.file
    console.log("Server received req.body:", { patientId, description, dmeId, labTest, fileName });
    console.log("Server received req.file:", {
      originalname: req.file?.originalname,
      filename: req.file?.filename,
    });

    // Validate required fields
    if (!req.file || !patientId || !description || !dmeId || !fileName) {
      console.error("Validation failed:", {
        hasFile: !!req.file,
        patientId,
        description,
        dmeId,
        fileName,
      });
      return res.status(400).json({ error: 'Missing required fields: file, patientId, description, dmeId, and fileName are required' });
    }

    // Prevent fileName from matching the uploaded file's original name
    if (fileName === req.file.originalname) {
      console.error("fileName matches req.file.originalname, which is not allowed:", fileName);
      return res.status(400).json({ error: 'fileName must not match the uploaded file’s original name' });
    }

    // Sanitize fileName to allow spaces, remove .pdf, and normalize
    const sanitizedFileName = fileName
      .replace(/\.pdf$/i, '') // Remove .pdf extension
      .replace(/[^a-zA-Z0-9\-_\s]/g, '') // Allow alphanumeric, hyphen, underscore, and spaces
      .trim();

    if (!sanitizedFileName) {
      console.error("Invalid fileName after sanitization:", fileName);
      return res.status(400).json({ error: 'Invalid fileName provided' });
    }

    // Log sanitized fileName
    console.log("Sanitized fileName:", sanitizedFileName, "Original fileName:", fileName, "Uploaded file:", req.file.originalname);

    // Create new report object
    const newReport = {
      id: Date.now().toString(),
      patientId,
      description,
      fileName: sanitizedFileName,
      filePath: `/Uploads/pdfFiles/${req.file.filename}`,
      timestamp: new Date().toISOString(),
      dmeId,
      labTest,
    };

    // Save to local JSON database (Node server)
    const reports = readReports();
    reports.push(newReport);
    writeReports(reports);

    // Update JSON server (3001)
    try {
      const jsonServerResponse = await axios.post(`${JSON_SERVER_URL}/reports`, newReport);
      console.log("JSON server updated with report:", jsonServerResponse.data);
    } catch (jsonError) {
      console.error("Failed to update JSON server:", jsonError.message, jsonError.response?.data);
      // Continue to respond to client, but log the error
    }

    res.status(201).json(newReport);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});