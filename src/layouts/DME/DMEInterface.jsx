import React, { useState } from "react";
import { getDMEById } from "services/dmeService"; // Make sure this path is correct
import { updateDMEProfile } from "services/dmeService"; // Make sure this path is correct
import { Button, TextField } from "@mui/material";
const DMEInterface = () => {
  const [dmeId, setDmeId] = useState("");
  const [dmeData, setDmeData] = useState(null);
  const [newDiagnostique, setNewDiagnostique] = useState("");
  const [newOrdonnance, setNewOrdonnance] = useState("");
  const [profileUpdate, setProfileUpdate] = useState({});

  const handleFetchDME = async () => {
    try {
      const data = await getDMEById(dmeId);
      setDmeData(data);
    } catch (err) {
      alert("DME not found");
    }
  };

  const handleAddDiagnostique = () => {
    const updated = { ...dmeData };
    updated.diagnostiques.push(newDiagnostique);
    setDmeData(updated);
    setNewDiagnostique("");
  };

  const handleAddOrdonnance = () => {
    const updated = { ...dmeData };
    updated.ordonnances.push(newOrdonnance);
    setDmeData(updated);
    setNewOrdonnance("");
  };

  const handleProfileUpdate = async () => {
    await updateDMEProfile(dmeId, profileUpdate);
    alert("Profile updated");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 600 }}>
      <h2>🩺 DME Interface</h2>

      <input
        type="text"
        placeholder="Enter DME ID"
        value={dmeId}
        onChange={(e) => setDmeId(e.target.value)}
      />
      <button onClick={handleFetchDME}>Consult DME</button>

      {dmeData && (
        <div style={{ marginTop: "1rem" }}>
          <h3>DME Info:</h3>
          <p>
            <strong>Patient CIN:</strong> {dmeData.patientCIN}
          </p>
          <p>
            <strong>Diagnostiques:</strong> {dmeData.diagnostiques.join(", ")}
          </p>
          <p>
            <strong>Ordonnances:</strong> {dmeData.ordonnances.join(", ")}
          </p>

          <h4>➕ Add Diagnostique</h4>
          <input
            type="text"
            placeholder="New Diagnostique"
            value={newDiagnostique}
            onChange={(e) => setNewDiagnostique(e.target.value)}
          />
          <button onClick={handleAddDiagnostique}>Add</button>

          <h4>➕ Add Ordonnance</h4>
          <input
            type="text"
            placeholder="New Ordonnance"
            value={newOrdonnance}
            onChange={(e) => setNewOrdonnance(e.target.value)}
          />
          <button onClick={handleAddOrdonnance}>Add</button>

          <h4>🛠️ Update Profile</h4>
          <input
            type="text"
            placeholder="New Patient CIN"
            onChange={(e) => setProfileUpdate({ ...profileUpdate, patientCIN: e.target.value })}
          />
          <button onClick={handleProfileUpdate}>Update</button>
        </div>
      )}
    </div>
  );
};

export default DMEInterface;
