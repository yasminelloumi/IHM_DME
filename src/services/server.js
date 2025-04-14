// src/services/server.js
const jsonServer = require("json-server");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "../../db.json")); // Project root
const middlewares = jsonServer.defaults();

// Set up storage for file uploads
const uploadDir = path.join(__dirname, "../../Uploads");
const upload = multer({ dest: uploadDir });

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Created uploads directory:", uploadDir);
  } catch (err) {
    console.error("Failed to create uploads directory:", err);
  }
}

// Apply JSON Server middlewares
server.use(middlewares);

// Parse JSON and form-data bodies
server.use(jsonServer.bodyParser);

// Custom route for POST /reports
server.post("/reports", upload.single("file"), (req, res) => {
  try {
    console.log("POST /reports headers:", req.headers);
    console.log("POST /reports body:", req.body);
    console.log("POST /reports file:", req.file);

    const { patientId, description, timestamp } = req.body;
    const file = req.file;

    // Validate required fields (file optional for testing)
    if (!patientId || !description || !timestamp) {
      console.error("Validation failed:", { patientId, description, timestamp, file });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create report object
    const report = {
      id: Date.now(),
      patientId,
      fileName: file ? file.originalname : "no-file-uploaded.pdf",
      description,
      timestamp,
      filePath: file ? file.path : null,
    };

    // Save to db.json
    const db = router.db;
    const reports = db.get("reports").value();
    if (!Array.isArray(reports)) {
      console.error("Reports collection invalid:", reports);
      return res.status(500).json({ error: "Reports collection not initialized" });
    }
    reports.push(report);
    try {
      db.set("reports", reports).write();
      console.log("Report saved to db.json:", report);
    } catch (err) {
      console.error("Failed to write to db.json:", err);
      return res.status(500).json({ error: "Failed to save report", details: err.message });
    }

    res.status(201).json(report);
  } catch (error) {
    console.error("Error in POST /reports:", error.message, error.stack);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Use JSON Server router
server.use(router);

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server running on http://localhost:${PORT}`);
});