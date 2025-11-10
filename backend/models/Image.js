import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  prediction: { type: String },
  confidence: { type: Number },
  uploadedAt: { type: Date, default: Date.now },
  predictedAt: { type: Date }
});

export default mongoose.model("Image", imageSchema);
