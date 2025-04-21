const axios = require('axios');
const JSON_SERVER_URL = "http://localhost:3001";

async function migrateReports() {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/reports`);
    const reports = response.data;
    for (const report of reports) {
      if (!report.reportName) {
        await axios.patch(`${JSON_SERVER_URL}/reports/${report.id}`, {
          reportName: report.labTest || "Unnamed Report",
        });
        console.log(`Updated report ${report.id} with reportName: ${report.labTest || "Unnamed Report"}`);
      }
    }
    console.log("Migration complete");
  } catch (error) {
    console.error("Migration failed:", error.message);
  }
}

migrateReports();