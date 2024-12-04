import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRoute from "./routes/user.route.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoute);

app.get("/api", (req, res) => {
 res.json({ message: "Welcome to snake game api" });
});

const port = process.env.PORT || "3030";
app.listen(port, () => {
 connectDB();
 console.log(`Server is running on port ${port}`);
});
