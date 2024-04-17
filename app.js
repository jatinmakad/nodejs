import express from "express";
import product from "./routes/ProductRoute.js";
import userRoute from "./routes/UserRoute.js";
import cookieParser from "cookie-parser";
const server = express();
server.use(express.json());
server.use(cookieParser())
// Route
server.use("/api/v1", product);
server.use("/api/v1", userRoute);
export default server;
