const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());

// Enable CORS if needed
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '');
  res.header('Access-Control-Allow-Headers', '');
  next();
});

// File upload endpoint
app.post('/reports', upload.single('file'), (req, res) => {
  try {
    const { patientId, description } = req.body;
    const file = req.file;

    if (!file || !patientId || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const report = {
      id: Date.now(),
      patientId,
      fileName: file.originalname,
      description,
      timestamp: new Date().toISOString(),
      filePath: file.path
    };

    // Save to your JSON database
    const dbPath = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath));
    db.reports.push(report);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.status(201).json(report);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});