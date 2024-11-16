import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use(express.static("public"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log("Server is running on port:" + PORT));
