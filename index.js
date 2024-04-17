import http from "http";
import dotenv from "dotenv";
import server from "./app.js";
import connectDB from "./config/database.js";

// Handling uncaugh Exception
process.on("uncaughtException", (err) => {
  process.exit(1);
});

// Config
dotenv.config({ path: "config/config.env" });

// DB
connectDB();

// Server
const app = server.listen(process.env.PORT, () => {
  console.log(`server is working ${process.env.PORT}`);
});

// Unhandaled Connection Error
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err}`);
  app.close(() => {
    process.exit(1);
  });
});

// Work with HTTP -
// const server = http.createServer((req, res, next) => {
//     console.log(req.method,'========')
// });
