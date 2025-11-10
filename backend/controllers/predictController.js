// import axios from "axios";
// import fs from "fs";
// import FormData from "form-data";
// import Image from "../models/Image.js";

// export const getPrediction = async (req, res) => {
//   try {
//     const imageData = await Image.findById(req.params.id);
//     if (!imageData) return res.status(404).json({ message: "Image not found" });

//     const formData = new FormData();
//     formData.append("image", fs.createReadStream(imageData.imagePath));

//     const response = await axios.post(process.env.COLAB_MODEL_URL, formData, {
//       headers: formData.getHeaders()
//     });

//     const { result, confidence } = response.data;

//     imageData.prediction = result;
//     imageData.confidence = confidence;
//     imageData.predictedAt = new Date();
//     await imageData.save();

//     res.json({ message: "Prediction complete", data: imageData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Prediction failed", error: error.message });
//   }
// };

import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import Image from "../models/Image.js";

export const getPrediction = async (req, res) => {
  try {
    const imageData = await Image.findById(req.params.id);
    if (!imageData) {
      return res.status(404).json({ message: "Image not found" });
    }

    const formData = new FormData();
    formData.append("image", fs.createReadStream(imageData.imagePath));

    const response = await axios.post(process.env.COLAB_MODEL_URL, formData, {
      headers: formData.getHeaders(),
    });

    const { result, confidence } = response.data;

    imageData.prediction = result;
    imageData.confidence = confidence;
    imageData.predictedAt = new Date();
    await imageData.save();

    res.json({ message: "Prediction complete", data: imageData });
  } catch (error) {
    console.error("Error in getPrediction:", error.message);
    if (error.response) {
      console.error("Colab response:", error.response.data);
    }

    res.status(500).json({
      message: "Prediction failed",
      error: error.message,
      colabResponse: error.response?.data || "No response data",
    });
  }
};
