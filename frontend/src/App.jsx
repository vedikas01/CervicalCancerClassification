import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("http://localhost:5000/api/upload/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const predictionData = await response.json();
      setResult(predictionData);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Cervical Cancer Detection</h1>
      <p className="subtitle">
        Upload a cervical medical image to detect cervical cancer
      </p>

      <input
        type="file"
        accept="image/*"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <button
        className="upload-btn"
        onClick={() => document.getElementById("fileInput").click()}
      >
        Upload Your Test Image
      </button>

      {previewImage && (
        <div className="preview-box">
          <img src={previewImage} alt="Preview" className="preview-img" />
          <button className="predict-btn" onClick={handleUpload}>
            {loading ? "Analyzing..." : "Get Prediction"}
          </button>
        </div>
      )}

      {result && (
        <div className="result-section">
          <h2 className="section-title">Instant Prediction Result</h2>
          <div className="result-box">
            <div className="status">
              <span className="checkmark">✔</span>
              <strong>{result.status}</strong>
            </div>
            <p>{result.message}</p>
            <p className="confidence">Confidence: {result.confidence}</p>
          </div>
        </div>
      )}

      <div className="learn-more">
        <h2 className="section-title">Learn More</h2>
        <div className="learn-grid">
          <div className="learn-card">
            <div className="icon">⚕️</div>
            <h3>What is Cervical Cancer?</h3>
            <p>Understand the basics and causes of cervical cancer.</p>
          </div>
          <div className="learn-card">
            <div className="icon">📄</div>
            <h3>Why Early Detection Matters</h3>
            <p>Learn about the importance of early diagnosis and care.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

