import express from "express";
import Image from "../models/Image.js"; // ensure you have this schema
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { imagePath, prediction, confidence } = req.body;

    if (!imagePath || !prediction || confidence === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEntry = await Image.create({
      imagePath,
      prediction,
      confidence,
    });

    res.status(201).json({ message: "✅ Data saved successfully", data: newEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});

export default router;
