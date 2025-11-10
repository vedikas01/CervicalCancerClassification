import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import uploadRoutes from './routes/uploadRoutes.js';
import predictRoutes from './routes/predictRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import path from "path";
import { fileURLToPath } from "url";
import seedRoutes from './routes/seedRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/seed", seedRoutes);


// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/users", userRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});