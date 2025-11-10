// import Image from "../models/Image.js";

// export const uploadImage = async (req, res) => {
//   try {
//     const newImage = await Image.create({
//       imagePath: req.file.path,
//       uploadedAt: new Date()
//     });
//     res.status(201).json({ message: "Image uploaded", id: newImage._id });
//   } catch (error) {
//     res.status(500).json({ message: "Upload failed", error: error.message });
//   }
// };

import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import Image from "../models/Image.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Step 1️⃣: Save image info to MongoDB
    const newImage = await Image.create({
      imagePath: req.file.path,
      uploadedAt: new Date(),
    });

    // Step 2️⃣: Prepare form data for Colab model
    const formData = new FormData();
    formData.append("image", fs.createReadStream(req.file.path));

    // Step 3️⃣: Send image to Colab model for prediction
    const response = await axios.post(process.env.COLAB_MODEL_URL, formData, {
      headers: formData.getHeaders(),
    });

    // Step 4️⃣: Extract result and confidence from Colab’s response
    const { result, confidence } = response.data;

    // Step 5️⃣: Update database (optional)
    newImage.prediction = result;
    newImage.confidence = confidence;
    newImage.predictedAt = new Date();
    await newImage.save();

    // Step 6️⃣: Send response to frontend
    res.json({
      status: result || "Unknown",
      message: "Prediction completed successfully.",
      confidence: confidence ? `${confidence}%` : "N/A",
    });
  } catch (error) {
    console.error("Error in uploadImage:", error.message);
    res.status(500).json({
      message: "Prediction failed",
      error: error.message,
    });
  }
};
