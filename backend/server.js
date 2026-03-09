import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import employeeRouter from "./routes/empRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.use("/employees", employeeRouter);


if (!process.env.MONGO_URI) {
  console.error("🚨 FATAL ERROR: MONGO_URI is missing. Check your .env file.");
  process.exit(1); 
}

console.log("⏳ Attempting to connect to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connection successful!");
    app.listen(PORT, () => {
      console.log(`🚀 Server started and listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });