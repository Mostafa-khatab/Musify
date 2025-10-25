// Node Modules
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import UserRoute from "./routes/v1/route.js";

// Configurations
dotenv.config();

const connecDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL as string, {
      dbName: "Musify",
    });
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.log(err);
  }
};

const app = express();

app.use(express.json());
app.use("api/v1/user", UserRoute);

app.get("/", (req, res) => {
  res.send("Server is Working");
});

connecDb();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
