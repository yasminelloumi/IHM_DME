const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3002;
const JSON_SERVER_URL = "http://localhost:3001";

const UPLOAD_DIR = path.join(__dirname, 'Uploads', 'pdfFiles');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const DB_FILE = path.join(__dirname, 'reports.json');

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ reports: [] }, null, 2));
}

const readReports = () => {
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data).reports;
};

const writeReports = (reports) => {
  fs.writeFileSync(DB_FILE, JSON.stringify({ reports }, null, 2));
};

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

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static PDF files from /Uploads/pdfFiles
app.use('/Uploads/pdfFiles', express.static(path.join(__dirname, 'Uploads', 'pdfFiles')));

app.post('/reports', upload.single('file'), async (req, res) => {
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
      labTest: sanitizedLabTest,
      fileName: req.file.filename,
      filePath: `/Uploads/pdfFiles/${req.file.filename}`,
      timestamp: new Date().toISOString(),
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
