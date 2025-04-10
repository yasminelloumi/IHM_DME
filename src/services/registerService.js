import QRCode from "qrcode";

export const registerPatient = async (formData) => {
  try {
    // Step 1: Add a default role as 'patient' to the form data
    const patientData = {
      ...formData,
      role: 'patient',  // Default role for the registering user
    };

    // Step 2: Create the patient in the database
    const res = await fetch("http://localhost:3001/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData), // Send the patient's form data with role
    });

    if (!res.ok) {
      throw new Error("Failed to register patient");
    }

    const patient = await res.json();

    // Step 3: Generate QR Code with DME link (Dynamic link for the DME page)
    const qrValue = `http://localhost:3000/dme/${patient.id}`;
    const qrCodeURL = await QRCode.toDataURL(qrValue); // Generate QR code as image URL

    // Step 4: Update the patient with the generated QR code
    const updatedPatientRes = await fetch(`http://localhost:3001/patients/${patient.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrCode: qrCodeURL }), // Save the QR code image URL in the patient's record
    });

    if (!updatedPatientRes.ok) {
      throw new Error("Failed to update patient with QR code");
    }

    const updatedPatient = await updatedPatientRes.json();

    // Step 5: Return the updated patient object with QR code and other details
    return { ...updatedPatient, qrCode: qrCodeURL }; // Return the full updated patient object
  } catch (error) {
    console.error("Error registering patient:", error);
    throw error; // Optionally rethrow or handle differently
  }
};
