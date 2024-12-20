import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import linkRouter from "./routes/link.route.js";
import redirectRouter from "./routes/redirect.route.js";
import productsRouter from "./routes/products.route.js";
import cors from "cors";

const app = express();

const whitelist = [process.env.ALLOWED_ORIGIN];

app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.includes(origin) || !origin) {
        return callback(null, origin);
      }
      return callback("Error: Not allowed by CORS:" + origin);
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", redirectRouter); // back redirect (optional)
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/links", linkRouter);
app.use("/api/v1/products", productsRouter);
// app.use(express.static("public"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log("Server is running on port:" + PORT));
