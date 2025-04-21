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
    // Log parsed req.body and req.file
    console.log("Server received req.body:", req.body);
    console.log("Server received req.file:", {
      originalname: req.file?.originalname,
      filename: req.file?.filename,
    });

    const { patientId, description, dmeId, labTest } = req.body;

    // Validate required fields
    if (!req.file || !patientId || !description || !dmeId || !labTest) {
      console.error("Validation failed:", {
        hasFile: !!req.file,
        patientId,
        description,
        dmeId,
        labTest,
      });
      return res.status(400).json({ error: 'Missing required fields: file, patientId, description, dmeId, and labTest are required' });
    }

    // Sanitize labTest to allow spaces, remove .pdf, and normalize
    const sanitizedLabTest = labTest
      .replace(/\.pdf$/i, '') // Remove .pdf extension
      .replace(/[^a-zA-Z0-9\-_\s]/g, '') // Allow alphanumeric, hyphen, underscore, and spaces
      .trim();

    if (!sanitizedLabTest) {
      console.error("Invalid labTest after sanitization:", labTest);
      return res.status(400).json({ error: 'Invalid labTest provided' });
    }

    // Log sanitized labTest
    console.log("Sanitized labTest:", sanitizedLabTest, "Original labTest:", labTest, "Uploaded file:", req.file.originalname);

    // Create new report object
    const newReport = {
      id: Date.now().toString(),
      patientId,
      description,
      labTest: sanitizedLabTest,
      fileName: req.file.filename, // Use server-generated filename
      filePath: `/Uploads/pdfFiles/${req.file.filename}`,
      timestamp: new Date().toISOString(),
      dmeId,
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